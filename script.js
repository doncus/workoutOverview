const openFrontContainer = () =>
{
    const backTop = document.querySelector(".content-back-top");
    const frontTop = document.querySelector(".content-front-top");
    
    contentBack.style.opacity = 0;
    backTop.style.transform = "translateX(" + (-120) + "%)";
    setTimeout(() => {
        contentBack.style.display = "none";
        backTop.style.transform = "translateX(" + 0 + ")";
        frontTop.style.display = "flex";
        contentFront.style.display = "flex";
        addSessionButton.style.width = 100 + "%";
        setTimeout(() => {
            backTop.style.display = "none";
            frontTop.style.transform = "translateX(" + 0 + ")";
            setTimeout(() => {
                contentFront.style.opacity = 1;
                backTop.style.opacity = 0;
            }, 600);
        }, 50);
    }, 800);

    setTimeout(() => {
        if (contentBack.querySelector(".content-back button"))
            contentBack.querySelectorAll(".content-back button").forEach(button => button.remove());
        if (contentBack.querySelector(".set-parent"))
            contentBack.querySelectorAll(".set-parent").forEach(element => element.remove());
        if (contentBack.querySelector(".save-button"))
            contentBack.querySelector(".save-button").remove();
    }, 800);

    showAllOfData();
    const previousSession = contentFront.querySelectorAll(".previous-session-div button");
    if (document.querySelector(".previous-session-div button"))
    {
        setTimeout(() => {
            let cnt = 0;
            const slideInterval = setInterval(() => {
                previousSession[cnt++].style.transform = "translateX(" + 0 + ")";
                if (cnt >= previousSession.length)
                    clearInterval(slideInterval);
            }, 100);
        }, 1500);
    }
}

const removeFrontpage = () => {
    const backTop = document.querySelector(".content-back-top");
    const frontTop = document.querySelector(".content-front-top");
    
    contentFront.style.opacity = 0;
    contentBack.style.display = "flex";
    setTimeout(() => {
        frontTop.style.transform = "translateX(" + 120 + "%)";
        backTop.style.display = "flex";
        setTimeout(() => {
            frontTop.style.display = "none";
            contentFront.style.display = "none";
            backTop.style.opacity = 1;
            contentBack.style.opacity = 1;
        }, 600);
    }, 800);
}

function inputClicked(input) {
    const inputLabel = input.parentElement.querySelector("p");
    inputLabel.style.fontWeight = "bold";
    inputLabel.style.color = "rgb(182, 248, 0)";
}

function inputLeft(input) {
    const inputLabel = input.parentElement.querySelector("p");
    inputLabel.style.fontWeight = "normal";
    inputLabel.style.color = "rgb(230, 230, 230)";
}

const getCurrentDate = () => {
    const date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let weekday = date.getDay();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let timeObject = {};

    if (hour < 10)
        hour = "0" + hour;
    if (minute < 10)
        minute = "0" + minute;
    if (month < 10)
        month = "0" + month;
    if (day < 10)
        day = "0" + day;
    
    switch (weekday) {
        case 0:
            weekday = "Sunday";
            break;
        case 1:
            weekday = "Monday";
            break;
        case 2:
            weekday = "Tuesday";
            break;
        case 3:
            weekday = "Wednesday";
            break;
        case 4:
            weekday = "Thursday";
            break;
        case 5:
            weekday = "Friday";
            break;
        default:
            weekday = "Saturday";
    }
    timeObject.weekday = weekday;
    timeObject.day = day;
    timeObject.monthName = getMonthName(month);
    timeObject.month = month;
    timeObject.year = year;
    timeObject.time = hour + ":" + minute;

    return timeObject;
}

const getMonthName = (month) => {
    month -= 1;
    switch (month) {
        case 0:
            month = "January";
            break;
        case 1: 
            month = "February";
            break;
        case 2: 
            month = "March";
            break;
        case 3: 
            month = "April";
            break;
        case 4: 
            month = "May";
            break;
        case 5: 
            month = "June";
            break;
        case 6: 
            month = "July";
            break;
        case 7: 
            month = "August";
            break;
        case 8: 
            month = "September";
            break;
        case 9: 
            month = "October";
            break;
        case 10: 
            month = "November";
            break;
        case 11: 
            month = "December";
            break;
    }
    return month;
}

function setDate() {
    const date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let weekday = date.getDay();

    if (month < 10)
        month = "0" + month;
    if (day < 10)
        day = "0" + day;
    
    switch (weekday) {
        case 0:
            weekday = "Sun";
            break;
        case 1:
            weekday = "Mon";
            break;
        case 2:
            weekday = "Tue";
            break;
        case 3:
            weekday = "Wed";
            break;
        case 4:
            weekday = "Thu";
            break;
        case 5:
            weekday = "Fri";
            break;
        default:
            weekday = "Sat";
    }

    const dateDiv = document.querySelector(".current-date");
    dateDiv.innerHTML = weekday + ", " + day + "." + month + "." + year;
    dateDiv.style.userSelect =  "none";
}

function markChecked(checkbox)
{
    const check = document.querySelector(".body-weight i");
    if (checkbox.checked)
    {
        check.style.color = "rgb(182, 248, 0)";
        check.style.fontSize = "30px";
    }
    else
    {
        check.style.color = "rgb(230, 230, 230)";
        check.style.fontSize = "20px";
    }
    initSets(document.querySelector(".select-sets input"));
}

function initSets(inputSet) {
    // NaN = Not a Number
    if (isNaN(inputSet.value)) return;
    let nrSets = parseInt(inputSet.value)
    if (nrSets > 20 || nrSets < 0) return;

    if (contentBack.querySelector(".set-parent"))
    {
        contentBack.querySelectorAll(".set-parent").forEach(element => element.remove());
        contentBack.querySelector(".save-button").remove();
    }

    for (let i = 1; i < nrSets + 1; i++)
    {
        const setParentDiv = document.createElement("div");
        setParentDiv.classList.add("set-parent");
        setParentDiv.setAttribute("id", "set" + i);

        document.querySelector(".content-back").append(setParentDiv);

        let p = document.createElement("p");
        p.classList.add("set-number");
        p.innerHTML = "SET " + i;
        setParentDiv.append(p);

        if (!document.querySelector("#bw").checked)
        {
            let div = document.createElement("div");
            div.classList.add("select-weight");
            setParentDiv.append(div);

            p = document.createElement("p");
            p.innerHTML = "WEIGHT";
            div.append(p);

            input = document.createElement("input");
            input.setAttribute("type", "text");
            input.setAttribute("onfocus", "inputClicked(this)");
            input.setAttribute("onfocusout", "inputLeft(this)");
            div.append(input);
        }

        let div = document.createElement("div");
        div.classList.add("select-reps");
        setParentDiv.append(div);

        p = document.createElement("p");
        p.innerHTML = "REPS";
        div.append(p);

        input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("onfocus", "inputClicked(this)");
        input.setAttribute("onfocusout", "inputLeft(this)");
        div.append(input);
    }

    if (inputSet.value != "" && nrSets != 0)
    {
        let button = document.createElement("button");
        button.classList.add("save-button");
        button.innerHTML = "SAVE";
        button.addEventListener('click', saveButtonFunction);
        contentBack.append(button);
    }
}


const putDataToArray = () => {
    const sessionInputs = document.querySelectorAll(".content-back input:not([type=checkbox])");

    let sessionData = {};
    let sets = [];

    sessionData.date = getCurrentDate();
    sessionData.exercise = sessionInputs[0].value;

    if (document.querySelector("#bw").checked)
    {
        sessionData.weightAdded = false;

        let nrOfSets = parseInt(sessionInputs[1].value);
        let repsInt;

        for (let i = 2; i < nrOfSets+2; i++)
        {
            repsInt = parseInt(sessionInputs[i].value);
            sets.push({"reps": repsInt});
        }
    }
    else
    {
        sessionData.weightAdded = true;
        for (let i = 2; i < sessionInputs.length + 2; i++)
        {
            if (i%2 == 0 && i != sessionInputs.length)
            {
                sets.push({
                    "weight": parseInt(sessionInputs[i].value), 
                    "reps": parseInt(sessionInputs[i+1].value)
                });
            }
        }
    }
    sessionData.sets = sets;

    workoutData.push(sessionData);
    saveDataToStorage("workoutData", workoutData);
    console.log("workoutData: ");
    console.log(workoutData);
}