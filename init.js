window.onload = () => {
    // create messageBox
    initMessageBox();

    document.addEventListener("click", closeAllLists);
    document.addEventListener("click", closeCalendar);
    document.body.addEventListener("scroll", closeAllLists);
    // document.body.addEventListener("scrollend", closeAllLists);
    
    const setsInput = document.querySelector(".select-sets input");
    setsInput.addEventListener("input", checkIfInteger);
    const exerciseInput = document.querySelector(".select-exercise input");
    exerciseInput.addEventListener("keypress", confirmEnter);

    const menuButtons = document.querySelectorAll(".menu-select button");
    menuButtons.forEach(btn => btn.addEventListener("click", menuButtonAction));

    // check if a user exists otherwise create one
    if (getData("userData") === null)
    {
        showUserContainer();
        /**
         * remove here: addtestData()
         */
        workoutData = [];
        // addTestData();
        saveDataToStorage('workoutData', workoutData);
        return;
    }
    userData = getData('userData');
    if (userData["chartType"] == undefined)
        userData.chartType = "bar";
    sortDataAsc(userData.exercises);
            
    // check if a storage for workoutData exists otherwise create it
    workoutData = getData('workoutData');
    for (let i = 0; i < workoutData.length; i++)
    {
        if (workoutData[i]["comment"] == undefined)
            workoutData[i].comment = "";
    }
        
    initFrontContainer();
    // getExercises();
};

const showUserContainer = () => {
    const main = document.querySelector(".main-container");
    const loginMain = document.querySelector(".login-container");
    const loginButton = loginMain.querySelector(".login-button");

    loginMain.style.display = "flex";
    main.style.display = "none";
    setTimeout(() => {
        loginMain.style.opacity = 1;
        loginMain.style.height = "300px";
        loginMain.style.backgroundColor = "hsl(60, 25%, 20%)";
        loginMain.style.border= "20px solid hsl(60, 25%, 37%)";
        setTimeout(() => {
            loginMain.querySelector(".login-content").style.opacity = 1;
            setTimeout(() => loginButton.addEventListener(
                "click", createUserButtonFunction), 600);
        }, 500);
    }, 200);
};

const initFrontContainer = () => {
    document.querySelector(".login-container").remove();
    const frontTop = document.querySelector(".content-front-top");
    const backButton = document.querySelector(".back-button");
    backButton.addEventListener("click", backButtonFunction);
    backButton.addEventListener("click", buttonAnimation);
    
    frontTop.querySelector("h2").innerHTML += "<span>" + userData.username + "</span>";
    frontTop.style.transform = "translateX(" + 0 + ")";

    setTimeout(() => {
        contentFront.style.opacity = 1;
        const userButton = document.querySelector(".user-button");
        userButton.addEventListener("click", buttonAnimation);
        userButton.addEventListener("click", openUserButtonFunction);
    }, 1000);
    
    showFrontContainer();
}

const initMessageBox = () => {
    let div = document.createElement("div");
    div.classList.add("message-box");
    document.body.append(div);

    let subDiv = document.createElement("div");
    subDiv.classList.add("message-content");
    document.body.append(subDiv);

    let span = document.createElement("span");
    span.classList.add("title");
    subDiv.append(span);
    span = document.createElement("span");
    span.classList.add("message-text");
    subDiv.append(span);

    let subsubDiv = document.createElement("div");
    subsubDiv.classList.add("verify-div");

    span = document.createElement("span");
    span.innerHTML = "Please enter your username."
    subsubDiv.append(span);

    let input = document.createElement("input");
    input.type = "text";
    input.setAttribute("autocomplete", "off");
    subsubDiv.append(input);

    let buttonDiv = document.createElement("div");
    subsubDiv.append(buttonDiv);

    let button = document.createElement("button");
    button.classList.add("verify-button");
    button.innerHTML = "verify";
    button.onclick = buttonAnimation;
    button.addEventListener("click", verifyDeletion);
    buttonDiv.append(button);

    button = document.createElement("button");
    button.classList.add("cancel-button");
    button.innerHTML = "cancel";
    button.addEventListener("click", buttonAnimation);
    button.setAttribute("onclick", "closeMessageBox()");
    buttonDiv.append(button);

    subDiv.append(subsubDiv);

    function verifyDeletion(e) {
        if (input.value !== userData.username) return;
        
        if (e.target.value === "verify")
        {
            workoutData = [];
            saveDataToStorage('workoutData', workoutData);
            window.location.reload();
        }
        else
        {
            userData.exercises = [];
            saveDataToStorage('userData', userData);
            closeMessageBox();
            window.location.reload();
        }
    }
}

/**
 * load all available exercises from json into array
 */
// const getExercises = () => {
//     fetch('./json/exercises.json')
//     .then((response) => response.json())
//     .then((data) => {
//         for (let i = 0; i < data["exercise"].length; i++)
//             exercises.push(data["exercise"][i]);
//     });
// }