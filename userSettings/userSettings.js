const createUserContent = () => {
    const userSettings = document.querySelector(".user-settings");

    // (1) CHANGE USERNAME
    let label = document.createElement("label");
    label.classList.add("header-label");
    label.innerHTML = "USER DATA";
    label.addEventListener("click", open);
    userSettings.append(label);

    let div = buildOneUserInputField("user-change-name", false, "SET USERNAME", false,
        "SET", "set-username-button", "set");
    div.style.display = "none";
    userSettings.append(div);

    // (2) RESET USER
    let button = document.createElement("button");
    button.classList.add("reset-button");
    button.innerHTML = "Reset data";
    button.addEventListener("click", buttonAnimation);
    button.addEventListener("click", resetData);
    button.style.display = "none";
    userSettings.append(button);

    // (3) DOWNLOAD / UPLOAD
    label = document.createElement("label");
    label.classList.add("header-label");
    label.innerHTML = "TRANSFER DATA";
    label.addEventListener("click", open);
    userSettings.append(label);

    div = document.createElement("div");
    div.classList.add("data-transfer-div");
    div.style.display = "none";
    userSettings.append(div);

    let divSpan = document.createElement("div");
    divSpan.innerHTML = "workout data as .json";
    divSpan.style.display = "none";
    userSettings.append(divSpan);

    button = document.createElement("button");
    button.classList.add("download-button");
    button.innerHTML = "Download";
    button.addEventListener("click", buttonAnimation);
    button.addEventListener("click", download);
    div.append(button);

    button = document.createElement("button");
    button.classList.add("upload-button");
    button.innerHTML = "Upload";
    button.addEventListener("click", buttonAnimation);
    button.addEventListener("click", upload);
    div.append(button);

    // (4) CHART TYPE
    label = document.createElement("label");
    label.classList.add("header-label");
    label.innerHTML = "CHART DATA";
    label.addEventListener("click", open);
    userSettings.append(label);

    let parentDiv = document.createElement("div");
    parentDiv.style.display = "none";

    div = document.createElement("div");
    div.classList.add("chart-type-title-div");
    div.innerHTML = "Type of chart:";
    parentDiv.append(div);

    div = document.createElement("div");
    div.classList.add("chart-type-div");
    parentDiv.append(div);

    for (let i = 0; i < 2; i++)
    {
        let label = document.createElement("label");
        label.classList.add("container-label");
        if (i == 0) label.innerHTML = "Bar";
        else label.innerHTML = "Line";
        div.append(label);

        let rButton = document.createElement("input");
        rButton.type = "radio";
        rButton.name = "type";
        if (i == 0) 
        {
            if (!userData["chartType"])
                rButton.checked = true;
            else if (userData.chartType == "bar") 
                rButton.checked = true;
            rButton.value = "bar";
        }
        else
        {
            if (userData.chartType == "line") 
                rButton.checked = true;
            rButton.value = "line";
        }
        rButton.onchange = () => {
            userData.chartType = rButton.value;
            saveDataToStorage("userData", userData);
            if (document.querySelector("#progressChart"))
            {
                document.querySelector("#progressChart").remove();
                createProgressChart();
            }
        }
        label.append(rButton);

        let span = document.createElement("span");
        span.classList.add("checkmark");
        label.append(span);
    }
    userSettings.append(parentDiv);

    // (5) CHANGE EXERCISES
    label = document.createElement("label");
    label.classList.add("header-label");
    label.innerHTML = "EXERCISE LIST";
    label.addEventListener("click", open);
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
    div.querySelector("input").setAttribute("onfocus", "resetInputValue(this), showExercisesForUserSettings(this, true)");
    div.querySelector("input").setAttribute("onfocusout", "closeAllListsTimed()");

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
    input.addEventListener("input", checkIfCharacters);
    input.setAttribute("oninput", "showExercisesForUserSettings(this, false)");
    input.setAttribute("onfocus", "resetInputValue(this), showExercisesForUserSettings(this, false)");
    input.setAttribute("onfocusout", "closeAllListsTimed()");
    div.append(input);

    label = document.createElement("label");
    label.innerHTML = "CHANGE NAME OF EXERCISE";
    label.style.transform = "translateY(-44px)";
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
    // (6) EMPTY EXERCISE LIST
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
    }, 1000);

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
        header.innerHTML = "Settings";
    }, 200);
    userButton.classList.add("active");

    const userSettings = document.createElement("DIV");
    setTimeout(() => userSettings.style.transform = "scale(1)", 10);
    userSettings.classList.add("user-settings");

    contentFront.style.display = "none";
    document.querySelector(".main-container").append(userSettings);

    setTimeout(() => createUserContent(), 100);
}

const open = (e) => {
    document.querySelector(".user-settings").style.minHeight = "0";
    let sibling = e.target.nextElementSibling;
    let status = (window.getComputedStyle(sibling).display == "none") ? "flex" : "none";

    while (sibling && !sibling.classList.contains("header-label"))
    {
        sibling.style.display = status;
        sibling = sibling.nextElementSibling;
    }
}

const download = () => {
    let workoutJson = "data:text/json;charset=utf-8," + encodeURIComponent(
        JSON.stringify(getData("workoutData"))
        );

    let link = document.createElement("a");
    link.style.display = "none";
    document.body.append(link);

    link.setAttribute("href", workoutJson);
    link.setAttribute("download", "workoutData.json");
    link.click();
    link.remove();
}

const upload = () => {
    // TEST
    let fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";
    fileInput.style.display = "none";
    fileInput.onchange = ({target}) => {
        if (target.files[0].name.slice(-5) !== ".json") {
            messageUser("ERROR", "only .json files allowed", false, true, 2000);
            return;
        }
        let fileReader = new FileReader();
    
        fileReader.onloadend = (e) => {
            if (e.target.result.charAt(0) !== "[")
            {
                messageUser("ERROR", "invalid .json file", false, true, 2000);
                console.error("The .json workout file has to contain an array of workout objects");
                return;
            }
            let result = JSON.parse(e.target.result);
            let formatted = JSON.stringify(result);

            let uploadedWorkout = JSON.parse(formatted);
            checkUploadKeyValues(uploadedWorkout, target.files[0].name);
            // console.log(uploadedWorkout);
        }
        fileReader.readAsText(fileInput.files.item(0));
    }
    document.body.append(fileInput);

    fileInput.click();
}

const checkUploadKeyValues = (uploadData, filename) => {
    for (let i = 0; i < uploadData.length; i++)
    {
        if (uploadData[i]["comment"] == undefined)
            uploadData[i].comment = "";
    }
    // console.log(Object.keys(uploadData));
    let workoutKeys = ["date", "exercise", "weightAdded", "sets", "comment"];
    let dateKeys = ["weekday", "day", "monthName", "month", "year", "time", "ms"];
    let setKeys = ["weight", "reps"];
    // console.log(Object.keys(uploadData[0]));

    for (let i = 0; i < uploadData.length; i++)
    {
        // console.log(Object.keys(uploadData[i]));
        // check if the json contains all needed keys: [date, exercise, weightAdded, sets]
        if (Object.keys(uploadData[i]).length < 5 || Object.keys(uploadData[i]).length > 5)
        {
            messageUser("ERROR", "invalid .json file", false, true, 2000);
            console.error("invalid number of keys");
            return;
        }
        for (let j = 0; j < workoutKeys.length; j++) // [date, exercise, weightAdded, sets]
        {
            let obj = Object.keys(uploadData[i])[j];
            if (obj !== workoutKeys[j])
            {
                messageUser("ERROR", "invalid .json file", false, true, 2000);
                console.error("invalid key: '" + obj + "'");
                console.error("at object number {" + (i+1) + "}");
                return;
            }
            // console.log(obj);
            // console.log(Object.values(uploadData[i])[j]);

            switch (obj) {
                case "date":
                    for (let k = 0; k < dateKeys.length; k++)   // ["day", "month", "monthName", "ms", "time", "weekday", "year"]
                    {
                        let dateObj = Object.keys(Object.values(uploadData[i])[j])[k];
                        if (dateObj !== dateKeys[k])
                        {
                            messageUser("ERROR", "invalid .json file", false, true, 2000);
                            console.error("invalid key: '" + dateObj + "'");
                            console.error("at object number {" + (i+1) + "}");
                            return;
                        }
                    }
                    break;
                case "sets":
                    for (let k = 0; k < Object.values(uploadData[i])[j].length; k++)   // ["weight", "reps"]
                    {
                        let setArray = Object.keys(Object.values(uploadData[i])[j][k]);
                        // if object contains "weight" key although weightAdded is false:
                        if (setArray.length == 1)
                        {
                            if (Object.values(uploadData[i])[2])
                            {
                                messageUser("ERROR", "invalid .json file", false, true, 2000);
                                console.error("invalid set value: '" + setArray[0] + "'");
                                console.error("at object number {" + (i+1) + "}");
                                console.error("weightAdded is true !");
                                return;
                            }
                            if (setArray[0] !== setKeys[1])
                            {
                                messageUser("ERROR", "invalid .json file", false, true, 2000);
                                console.error("invalid key: '" + setArray[0] + "'");
                                console.error("at object number {" + (i+1) + "}");
                                return;
                            }
                        }
                        else
                        {
                            if (!Object.values(uploadData[i])[2])
                            {
                                messageUser("ERROR", "invalid .json file", false, true, 2000);
                                console.error("invalid set value: '" + setArray[0] + "'");
                                console.error("at object number {" + (i+1) + "}");
                                console.error("weightAdded is false !");
                                return;
                            }
                            if (setArray[0] !== setKeys[0])
                            {
                                messageUser("ERROR", "invalid .json file", false, true, 2000);
                                console.error("invalid key: '" + setArray[0] + "'");
                                console.error("at object number {" + (i+1) + "}");
                                return;
                            }
                            if (setArray[1] !== setKeys[1])
                            {
                                messageUser("ERROR", "invalid .json file", false, true, 2000);
                                console.error("invalid key: '" + setArray[1] + "'");
                                console.error("at object number {" + (i+1) + "}");
                                return;
                            }
                        }
                    }
                    break;
                default:
                    break;
            }
        }
    }
    
    let allDuplicates = true;
    let isDuplicate = false;
    for (let i = 0; i < uploadData.length; i++)
    {
        isDuplicate = false;
        for (let j = 0; j < workoutData.length; j++)
        {
            if (workoutData[j].date.ms === uploadData[i].date.ms)
            {
                isDuplicate = true;
                break;
            }
        }
        if (!isDuplicate)
        {
            allDuplicates = false;
            workoutData.push(uploadData[i]);
            if (!userData.exercises.includes(uploadData[i].exercise))
                userData.exercises.push(uploadData[i].exercise);
        }
    }
    if (allDuplicates)
    {
        messageUser("UPLOAD FAILED", "'" + filename + "' already saved", false, true, 3000);
        return;
    }
    sortDataAsc(userData.exercises);
    saveDataToStorage("userData", userData);
    
    sortByDateAsc(workoutData);
    saveDataToStorage("workoutData", workoutData);
    console.log(workoutData);
    messageUser("UPLOAD SUCCESS", "'" + filename + "' added", false, true, 3000);
    setTimeout(() => window.location.reload(), 2500);
}