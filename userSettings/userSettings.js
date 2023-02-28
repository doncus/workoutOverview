const createUserContent = () => {
    const userSettings = document.querySelector(".user-settings");

    // (1) CHANGE USERNAME
    let label = document.createElement("label");
    label.classList.add("header-label");
    label.innerHTML = "USER DATA";
    userSettings.append(label);

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
    label = document.createElement("label");
    label.classList.add("header-label");
    label.innerHTML = "EXERCISE LIST";
    userSettings.append(label);

    const userExercises = document.createElement("div");
    userExercises.classList.add("user-change-exercises");
    // add exercise
    div = buildOneUserInputField("add-exercise-div", true, "ADD EXERCISE", true,
        "fa-plus", "add-exercise-button", "add");
    userExercises.append(div);

    // remove exercise
    div = buildOneUserInputField("remove-exercise-div", true, "REMOVE EXERCISE", true,
        "fa-minus", "remove-exercise-button", "del");
    div.querySelector("input").setAttribute("oninput", "showExercisesForUserSettings(this, true)");
    div.querySelector("input").setAttribute("onfocus", "showExercisesForUserSettings(this, true), resetInputValue(this)");
    div.querySelector("input").setAttribute("onfocusout", "closeAllLists()");

    userExercises.append(div);
    // change name of exercise
    let parent = document.createElement("div");
    parent.classList.add("change-exercise-name-div");
    // change from
    div = document.createElement("div");
    div.classList.add("change-exercise-name-inputs-div");

    let input = document.createElement("input");
    input.type = "text";
    input.placeholder = "from ...";
    input.id = "from";
    input.style.width = document.querySelector(".user-change-name input").offsetWidth + "px";
    input.addEventListener("input", checkIfCharacters);
    input.setAttribute("oninput", "showExercisesForUserSettings(this, false)");
    input.setAttribute("onfocus", "showExercisesForUserSettings(this, false), resetInputValue(this)");
    input.setAttribute("onfocusout", "closeAllLists()");
    div.append(input);

    label = document.createElement("label");
    label.innerHTML = "CHANGE NAME OF EXERCISE";
    label.style.transform = "translateY(-42px)";
    label.style.fontSize = "12px";
    div.append(label);

    setTimeout(() => {
        input.style.transform = "scaleX(1)";
        setTimeout(() => label.style.opacity = 1, 300);
    }, 100);
    // change to
    inputTwo = document.createElement("input");
    inputTwo.type = "text";
    inputTwo.placeholder = "to ...";
    inputTwo.id = "to";
    inputTwo.style.width = document.querySelector(".user-change-name input").offsetWidth + "px";
    inputTwo.addEventListener("input", checkIfCharacters);
    div.append(inputTwo);

    setTimeout(() => inputTwo.style.transform = "scaleX(1)", 100);
    parent.append(div);

    button = document.createElement("button");
    button.addEventListener("click", buttonAnimation);
    button.setAttribute("onclick", "changeExerciseName()");
    button.classList.add("change-exercise-name-button");
    let icon = document.createElement("i");
    icon.classList.add("fa-solid");
    icon.classList.add("fa-pen");

    button.append(icon);
    parent.append(button);

    userExercises.append(parent);

    userSettings.append(userExercises);
    // (4) EMPTY EXERCISE LIST
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
            break;
        }
    }

    showMessage(input, message);

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
    }
    else if (username.length > 12)
        message = "MAX: 12 CHARACTERS";

    showMessage(input, message);
}

const showMessage = (input, message) => {
    exerciseDiv = input.parentElement;
    if (exerciseDiv.querySelector("span"))
        exerciseDiv.querySelector("span").remove();

    let messageSpan = document.createElement("span");
    messageSpan.style.top = input.getBoundingClientRect().top -105 + "px";
    messageSpan.style.width = input.offsetWidth + 4 + "px";
    messageSpan.style.height = input.offsetHeight + "px";
    messageSpan.innerHTML = message.toLowerCase();
    setTimeout(() => messageSpan.style.opacity = 1, 10);
    setTimeout(() => {
        messageSpan.style.opacity = 0;
        setTimeout(() => messageSpan.remove(), 500);
    }, 2000);

    exerciseDiv.append(messageSpan);
}

const changeExerciseName = () => {
    let parent = document.querySelector(".change-exercise-name-inputs-div");
    let inputs = parent.querySelectorAll("input");

    let message = "FILL HERE";
    if (!inputs[0].value.length) 
    {
        showMessage(inputs[0], message);
        return;
    }
    else if (!inputs[1].value.length)
    {
        showMessage(inputs[1], message);
        return;
    }
    
    let exerciseFrom = inputs[0].value.replace(/[-\s]/g, '').toLowerCase();
    let exerciseTo = inputs[1].value.replace(/[-\s]/g, '').toLowerCase();

    let FromIsInList = false;
    let ToIsInList = false;
    message = "NAME CHANGED";
    let exerciseOfList;
    
    for (let i = 0; i < userData.exercises.length; i++)
    {
        let exerciseInArray = userData.exercises[i].replace(/[-\s]/g, '').toLowerCase();
        if (exerciseTo === exerciseInArray)
        {
            ToIsInList = true;
            message = "ALREADY IN LIST";
        }
        if (exerciseFrom === exerciseInArray)
        {
            FromIsInList = true;
            exerciseOfList = userData.exercises[i];
        }
    }
    if (!FromIsInList)
    {
        message = "EXERCISE NOT FOUND";
        showMessage(inputs[0], message);
    }
    if (ToIsInList)
        showMessage(inputs[1], message);

    if (FromIsInList && !ToIsInList)
    {
        let index = userData.exercises.indexOf(exerciseOfList);
        userData.exercises[index] = inputs[1].value;
        sortDataAsc(userData.exercises);
        saveDataToStorage("userData", userData);
        
        for (let i = 0; i < workoutData.length; i++)
        {
            if (workoutData[i].exercise === exerciseOfList)
                workoutData[i].exercise = inputs[1].value;
        }
        saveDataToStorage("workoutData", workoutData);
        inputs[0].value = "";
        inputs[1].value = "";
        window.location.reload();
    }
}

const openUserButtonFunction = () => {
    const userButton = document.querySelector(".user-button");
    let header = document.querySelector(".content-front-top .title h2");

    if (document.querySelector(".user-settings"))
    {
        userButton.classList.remove("active");
        header.style.opacity = 0;
        setTimeout(() => {
            header.style.opacity = 1;
            header.innerHTML = "Welcome <span>" + userData.username + "</span>";
        }, 200);
        document.querySelector(".user-settings").remove();
        contentFront.style.display = "flex";
        return;
    }
    header.style.opacity = 0;
    setTimeout(() => {
        header.style.opacity = 1;
        header.innerHTML = "User Settings";
    }, 200);
    userButton.classList.add("active");

    const userSettings = document.createElement("DIV");
    setTimeout(() => userSettings.style.transform = "scale(1)", 10);
    userSettings.classList.add("user-settings");

    contentFront.style.display = "none";
    document.querySelector(".main-container").append(userSettings);

    setTimeout(() => createUserContent(), 100);
}