const createUserContent = () => {
    const userSettings = document.querySelector(".user-settings");

    // (1) CHANGE USERNAME
    let div = buildOneUserInputField("user-change-name", false, "SET USERNAME", false,
        "SET", "set-username-button", "set");
    userSettings.append(div);

    // (2) RESET USER
    let button = document.createElement("button");
    button.classList.add("reset-button");
    button.innerHTML = "Reset data";
    button.addEventListener("click", buttonAnimation);
    button.addEventListener("click", resetData);
    userSettings.append(button);
    
    // (3) CHANGE EXERCISES
    const userExercises = document.createElement("div");
    userExercises.classList.add("user-change-exercises");
    // add exercise
    div = buildOneUserInputField("add-exercise-div", true, "ADD EXERCISE", true,
        "fa-plus", "add-exercise-button", "add");
    userExercises.append(div);
    // remove exercise
    div = buildOneUserInputField("remove-exercise-div", true, "REMOVE EXERCISE", true,
        "fa-minus", "remove-exercise-button", "del");
    div.querySelector("input").setAttribute("oninput", "showExercisesForUserSettings(this)");
    div.querySelector("input").setAttribute("onfocus", "showExercisesForUserSettings(this)");
    userExercises.append(div);

    userSettings.append(userExercises);

    button = document.createElement("button");
    button.classList.add("empty-list-button");
    button.innerHTML = "Empty list";
    button.addEventListener("click", buttonAnimation);
    button.addEventListener("click", emptyList);
    userSettings.append(button);

    // USER SETTINGS FUNCTION
    function buildOneUserInputField (divClass, inputListener, labelText,
        hasIcon, btnTextOrIconClass, btnClass, fnc) {

        let div = document.createElement("div");
        div.classList.add(divClass);

        let input = document.createElement("input");
        input.type = "text";
        if (inputListener) input.addEventListener("input", checkIfCharacters);
        div.append(input);

        let label = document.createElement("label");
        label.innerHTML = labelText;
        div.append(label);

        setTimeout(() => {
            input.style.transform = "scaleX(1)";
            setTimeout(() => label.style.opacity = 1, 300);
        }, 100);

        let button = document.createElement("button");
        button.classList.add(btnClass);
        button.addEventListener("click", buttonAnimation);
        switch (fnc) {
            case "add":
                button.setAttribute("onclick", "manageExerciseArray(this, true)");
                break;
            case "del":
                button.setAttribute("onclick", "manageExerciseArray(this, false)");
                break;
            default:
                button.setAttribute("onclick", "setUsername(this)");
                break;
        }
        if (!hasIcon) 
            button.innerHTML = btnTextOrIconClass;
        else
        {
            let icon = document.createElement("i");
            icon.classList.add("fa-solid");
            icon.classList.add(btnTextOrIconClass);
            button.append(icon);
        }
        div.append(button);

        return div;
    }
    function resetData() {
        let messageHTML = "Delete all saved workout data.";
        messageUser("You are about to", messageHTML, true, false);
        document.querySelector(".verify-button").value = "verify";
    };
    function emptyList() {
        let messageHTML = "Delete all exercise suggestions </br>from your list.";
        messageUser("You are about to", messageHTML, true, false);
        document.querySelector(".verify-button").value = "reset";
    };
}

const manageExerciseArray = (clickedButton, addToList) => {
    const exerciseDiv = clickedButton.parentElement;
    const input = exerciseDiv.querySelector("input");
    if (!input.value.length) return;

    let exerciseToMatch = input.value.replace(/[-\s]/g, '').toLowerCase();
    let isInList = false;
    let message = addToList ? "EXERCISE ADDED" : "EXERCISE NOT FOUND";
    let originalString = "";
    
    for (let i = 0; i < userData.exercises.length; i++)
    {
        let exerciseInArray = userData.exercises[i].replace(/[-\s]/g, '').toLowerCase();
        if (exerciseToMatch === exerciseInArray)
        {
            isInList = true;
            message = addToList ? "ALREADY IN LIST" : "EXERCISE REMOVED";
            originalString = userData.exercises[i];
        }
    }

    showMessage(exerciseDiv, message);

    if (!isInList && addToList)
    {
        userData.exercises.push(input.value);
        sortDataAsc(userData.exercises);
        input.value = "";
        saveDataToStorage("userData", userData);
    }
    else if (isInList && !addToList)
    {
        let index = userData.exercises.indexOf(originalString);
        if (index >= 0)
            userData.exercises.splice(index, 1);
        input.value = "";
        saveDataToStorage("userData", userData);
    }
}

const setUsername = (clickedButton) => {
    const exerciseDiv = clickedButton.parentElement;
    const input = exerciseDiv.querySelector("input");
    let username = input.value;
    let message = "MIN: 3 CHARACTERS";

    if (username.length >= 3 && username.length <= 12)
    {
        userData.username = username;
        input.value = "";
        message = "USERNAME CHANGED";
        saveDataToStorage("userData", userData);
        document.querySelector(".content-front-top h2 > span").innerHTML = username;

    }
    else if (username.length > 12)
        message = "MAX: 12 CHARACTERS";

    showMessage(exerciseDiv, message);
}

const showMessage = (exerciseDiv, message) => {
    if (exerciseDiv.querySelector("span"))
        exerciseDiv.querySelector("span").remove();

    let messageSpan = document.createElement("span");
    messageSpan.innerHTML = message;
    setTimeout(() => {
        messageSpan.style.transform = "translateY(-26px)";
        messageSpan.style.opacity = 1;
    }, 30);
    setTimeout(() => {
        messageSpan.style.transform = "translateY(0)";
        messageSpan.style.opacity = 0;
    }, 3000);
    exerciseDiv.append(messageSpan);
}