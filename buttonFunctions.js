const createUserButtonFunction = () => {
    const loginContainer = document.querySelector(".login-container");
    const loginInput = loginContainer.querySelector("input");
    const loginMinCondition = loginContainer.querySelector(".condition-container #min");
    const loginMaxCondition = loginContainer.querySelector(".condition-container #max");
    const main = document.querySelector(".main-container");
    
    const loginButton = loginContainer.querySelector(".login-button");

    if (loginInput.value == "") return;
    if (loginInput.value.length > 12)
    {
        loginMinCondition.style.color = "white";
        loginMaxCondition.style.color = "red";
        return;
    }
    if (loginInput.value.length < 3)
    {
        loginMinCondition.style.color = "red";
        loginMaxCondition.style.color = "white";
        return;
    }
    loginButton.style.width = 40 + "%";
    loginButton.style.opacity = 0;
    setTimeout(() => {
        loginContainer.style.opacity = 0;
        setTimeout(() => {
            main.style.display = "flex";
            saveDataToStorage("userData", {"username": loginInput.value});
            userData = getData("userData");
            setTimeout(() => initFrontContainer(), 500);
        }, 800);
    }, 400);
}

const addSessionButtonFunction = (e) => {
    e.target.style.width = 75 + "%";
    e.target.disabled = true;
    setDate();
    removeFrontpage();
}

const backButtonFunction = (e) => {
    openFrontContainer();
    setTimeout(() => {
        addSessionButton.disabled = false;
        const contentBackDivs = document.querySelectorAll(".content-back div");
        contentBackDivs.forEach(div => div.style.display = "flex");
    }, 2000);
}

const saveButtonFunction = (e) => {
    const inputs = contentBack.querySelectorAll("input");
    let inputEmpty = false;
    for (let i = 0; i < inputs.length; i++)
    {
        if (inputs[i].value == "")
        {
            inputEmpty = true;
            return;
        }
    }
    if (inputEmpty) return;

    e.target.style.width = 40 + "%";
    e.target.style.opacity = 0;
    e.target.disabled = true;
    setTimeout(() => {
        openFrontContainer();
        contentBack.querySelectorAll("input").forEach(input => input.value = "");
    }, 600);
    putDataToArray();
    setTimeout(() => addSessionButton.disabled = false, 2000);
}

const previousMonthButtonFunction = (e, tempDataOfIndex) => {
    e.target.disabled = true;
    e.target.style.color = "black";
    e.target.style.backgroundColor = "hsl(60, 25%, 60%)";
    const month = tempDataOfIndex.date.month;
    const year = tempDataOfIndex.date.year;
    const currentMonth = document.querySelector(".current-date");
    const contentBackDivs = document.querySelectorAll(".content-back div");
    currentMonth.innerHTML = e.target.innerHTML;
    contentBackDivs.forEach(div => div.style.display = "none");
    setTimeout(()=> removeFrontpage(), 500);
    showEachDay(month, year);
}

const previousDayButtonFunction = (e, tempDataOfIndex) => {
    e.target.disabled = true;
    e.target.style.color = "black";
    e.target.style.backgroundColor = "hsl(60, 25%, 60%)";
    const month = tempDataOfIndex.date.month;
    const year = tempDataOfIndex.date.year;
    const currentMonth = document.querySelector(".current-date");
    const contentBackDivs = document.querySelectorAll(".content-back div");
    currentMonth.innerHTML = e.target.innerHTML;
    contentBackDivs.forEach(div => div.style.display = "none");
    setTimeout(()=> removeFrontpage(), 500);
    showEachDay(month, year);
}