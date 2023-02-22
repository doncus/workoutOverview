window.onload = () => {
    document.addEventListener("click", closeAllLists);
    document.body.addEventListener("scroll", closeAllLists);
    document.addEventListener("click", closeCalendar);
    
    const setsInput = document.querySelector(".select-sets input");
    setsInput.addEventListener("input", checkIfInteger);

    const menuButtons = document.querySelectorAll(".menu-select button");
    menuButtons.forEach(btn => btn.addEventListener("click", menuButtonAction));

    // check if a user exists otherwise create one
    if (getData("userData") === null)
    {
        showUserContainer();

        /**
         * remove here: testData
         */
        // workoutData = [];
        // addTestData();
        // saveDataToStorage('workoutData', workoutData);

        return;
    }
    userData = getData('userData');
            
    // check if a storage for workoutData exists otherwise create it
    workoutData = getData('workoutData');
        
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