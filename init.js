window.onload = () => {
    document.addEventListener("click", closeAllLists);
    // check if a user exists otherwise create one
    if (getData("userData") === null)
    {
        showUserContainer();
        workoutData = [];
    }
    else
    {
        userData = getData('userData');
        // check if a storage for workoutData exists otherwise create it
        if (getData('workoutData') === null)
        {
            workoutData = [];
            saveDataToStorage('workoutData', workoutData);
        } 
        else 
            workoutData = getData('workoutData');
        
        // let clone1, clone2, clone3;
        // clone1 = JSON.parse(JSON.stringify(workoutData[0]));
        // clone2 = JSON.parse(JSON.stringify(workoutData[0]));
        // clone3 = JSON.parse(JSON.stringify(workoutData[0]));
        // clone1.date.month = 1;
        // clone1.date.year = 2023
        // clone1.date.monthName = "January";
        // workoutData.push(clone1);
        // clone2.date.month = 2;
        // clone2.date.year = 2023
        // clone2.date.monthName = "February";
        // workoutData.push(clone2);
        // clone3.date.month = 3;
        // clone3.date.year = 2024
        // clone3.date.monthName = "March";
        // workoutData.push(clone3);
        initFrontContainer();
    }
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
        loginMain.style.backgroundColor = "hsl(60, 25%, 21%)";
        loginMain.style.border= "20px solid hsl(60, 17%, 46%)";
        setTimeout(() => {
            loginMain.querySelector(".login-content").style.opacity = 1;
            setTimeout(() => loginButton.addEventListener(
                "click", createUserButtonFunction), 600);
        }, 500);
    }, 200);
};

const initFrontContainer = () => {
    document.querySelector(".login-container").style.display = "none";
    const frontTop = document.querySelector(".content-front-top");
    const backButton = document.querySelector(".back-button");
    backButton.addEventListener("click", backButtonFunction);
    
    frontTop.querySelector("h2").innerHTML += "<span>" + userData.username + "</span>";
    frontTop.style.transform = "translateX(" + 0 + ")";

    setTimeout(() => {
        contentFront.style.opacity = 1;
        setTimeout(() => addSessionButton.addEventListener(
            "click", addSessionButtonFunction), 600);
    }, 1000);
    
    openFrontContainer();
}