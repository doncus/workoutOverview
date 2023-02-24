const showFrontContainer = () => {
    calendarDate.removeEventListener("click", createCalendar);
    let menuButtons = contentFront.querySelectorAll(".menu-select button");
    menuButtons.forEach(curBtn => curBtn.removeEventListener("click", menuButtonAction));

    const backTop = document.querySelector(".content-back-top");
    const frontTop = document.querySelector(".content-front-top");
    
    contentBack.style.opacity = 0;
    backTop.style.transform = "translateX(" + (-120) + "%)";
    setTimeout(() => {
        contentBack.style.display = "none";
        backTop.style.transform = "translateX(" + 0 + ")";
        frontTop.style.display = "flex";
        contentFront.style.display = "flex";
        setTimeout(() => {
            backTop.style.display = "none";
            frontTop.style.transform = "translateX(" + 0 + ")";
            setTimeout(() => {
                contentFront.style.opacity = 1;
                backTop.style.opacity = 0;
            }, 400);
        }, 50);
    }, 600);
    

    setTimeout(() => contentBack.querySelector(".previous-days-div").innerHTML = "", 800);

    generatePrevSessionData(1500);
    contentFront.querySelector(".add-session-button").classList.remove("active");
    contentFront.querySelector(".monthly-sessions-button").classList.add("active");

    setTimeout(() => menuButtons.forEach(btn => btn.addEventListener("click", menuButtonAction)), 1500);
}

const hideFrontContainer = () => {
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
            contentFront.querySelector(".selected-menu-div").innerHTML = "";
            backTop.style.opacity = 1;
            contentBack.style.opacity = 1;
        }, 400);
    }, 600);
}

const inputClicked = (input) => {
    const inputLabel = input.parentElement.querySelector("p");
    inputLabel.style.fontWeight = "bold";
    inputLabel.style.color = "rgb(182, 248, 0)";
}

const inputLeft = (input) => {
    const inputLabel = input.parentElement.querySelector("p");
    inputLabel.style.fontWeight = "normal";
    inputLabel.style.removeProperty("color");
}
const getLastSessionData = (inputValue) => {
    lastExercise = undefined;
    weightOfLastSession = "";
    repsOfLastSession = "";
    nrSetsOfLastSession = "";

    for (let i = 0; i < workoutData.length; i++)
    {
        if (workoutData[i].exercise == inputValue)
        {
            if (!lastExercise)
                lastExercise = workoutData[i];
            if (lastExercise.date.ms < workoutData[i].date.ms)
                lastExercise = workoutData[i];
        }
    }
    if (lastExercise)
    {
        let checkbox = document.querySelector(".body-weight input[type=checkbox]");
        if (lastExercise.weightAdded)
        {
            weightOfLastSession = lastExercise.sets[0].weight;
            if (checkbox.checked)
            {
                checkbox.checked = false;
                markChecked(checkbox);
            }
        }
        else
        {
            if (!checkbox.checked)
            {
                checkbox.checked = true;
                markChecked(checkbox);
            }
        }
        repsOfLastSession = lastExercise.sets[0].reps;
        nrSetsOfLastSession = lastExercise.sets.length;
    }

    let setInput = document.querySelector(".select-sets input");
    setInput.value = nrSetsOfLastSession;
    initSets();
}

const getDateAsObject = () => {
    let year = selectedDate.getFullYear();
    let month = selectedDate.getMonth() + 1;
    let day = selectedDate.getDate();
    let weekday = selectedDate.getDay();
    let hour = selectedDate.getHours();
    let minute = selectedDate.getMinutes();
    let ms = selectedDate.getTime();
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
    timeObject.monthName = months[month-1];
    timeObject.month = month;
    timeObject.year = year;
    timeObject.time = hour + ":" + minute;
    timeObject.ms = ms;

    return timeObject;
}

const markChecked = (checkbox) => {
    const div = checkbox.parentElement;
    const check = div.querySelector("i");
    if (checkbox.checked)
    {
        check.style.color = "rgb(182, 248, 0)";
        check.style.fontSize = "30px";
    }
    else
    {
        check.style.removeProperty("color");
        check.style.removeProperty("font-size");
    }
    div.style.transform = "scale(" + 1.2 + ")";
    setTimeout(() => {
        div.style.removeProperty("transform");
    }, 200);
    initSets();
}

const initSets = () => {
    const MAX_SETS = 20;
    let setInput = document.querySelector(".select-sets input");
    if (isNaN(setInput.value)) return;
    let nrSets = parseInt(setInput.value);
    if (nrSets > MAX_SETS)
    {
        nrSets = MAX_SETS;
        setInput.value = MAX_SETS;
    }

    while (contentBack.querySelector(".select-sets").nextElementSibling)
        contentBack.querySelector(".select-sets").nextElementSibling.remove();

    for (let i = 1; i < nrSets + 1; i++)
    {
        const setParentDiv = document.createElement("div");
        setParentDiv.classList.add("set-parent");
        setParentDiv.setAttribute("id", "set" + i);

        document.querySelector(".content-back").append(setParentDiv);
        setTimeout(() => setParentDiv.style.opacity = 1, 20);

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

            let input = document.createElement("input");
            input.setAttribute("type", "tel");
            input.setAttribute("onfocus", "setLastValue(this), inputClicked(this), resetInputValue(this)");
            input.setAttribute("onfocusout", "inputLeft(this), getLastValue(this)");
            if (i == 1)
                input.setAttribute("oninput", "copyPasteWeight(this), checkIfSmallerThan(this, 999)");
            else
                input.setAttribute("oninput", "checkIfSmallerThan(this, 999)");
            input.addEventListener("input", checkIfNumber);
            input.value = weightOfLastSession;
            div.append(input);

            p = document.createElement("p");
            p.innerHTML = "kg";
            p.style.color = "black";
            p.style.width = "49.5px";
            p.style.margin = 0;
            p.style.marginLeft = -30 + "px";
            div.append(p);
        }

        let div = document.createElement("div");
        div.classList.add("select-reps");
        setParentDiv.append(div);

        p = document.createElement("p");
        p.innerHTML = "REPS";
        div.append(p);

        let input = document.createElement("input");
        input.setAttribute("type", "tel");
        input.setAttribute("onfocus", "setLastValue(this), inputClicked(this), resetInputValue(this)");
        input.setAttribute("onfocusout", "inputLeft(this), getLastValue(this)");
        if (i == 1)
                input.setAttribute("oninput", "copyPasteReps(this), checkIfSmallerThan(this, 999)");
            else
                input.setAttribute("oninput", "checkIfSmallerThan(this, 999)");
        input.addEventListener("input", checkIfInteger);
        input.value = repsOfLastSession;
        div.append(input);
    }

    if (setInput.value == "" || setInput.value == 0) return;

    let button = document.createElement("button");
    button.classList.add("save-button");
    button.innerHTML = "SAVE";
    button.addEventListener('click', saveButtonFunction);
    contentBack.append(button);
    setTimeout(() => button.style.opacity = 1, 20);

    let span = document.createElement("span");
    span.innerHTML = getWholeDate();
    span.classList.add("date-control");
    setTimeout(() => span.style.opacity = 1, 20);
    contentBack.append(span);
}

const putDataToArray = () => {
    const sessionInputs = document.querySelectorAll(".content-back input:not([type=checkbox])");

    let sessionData = {};
    let sets = [];

    sessionData.date = getDateAsObject();
    sessionData.exercise = sessionInputs[0].value;
    
    // add exercise to list if it doesn't exist
    if (!userData.exercises.includes(sessionInputs[0].value))
    {
        userData.exercises.push(sessionInputs[0].value);
        sortDataAsc(userData.exercises);
        saveDataToStorage("userData", userData);
    }

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
                    "weight": parseFloat(sessionInputs[i].value), 
                    "reps": parseInt(sessionInputs[i+1].value)
                });
            }
        }
    }
    sessionData.sets = sets;

    workoutData.push(sessionData);
    sortByDateAsc(workoutData);
    saveDataToStorage("workoutData", workoutData);
    console.log("workoutData: ");
    console.log(workoutData);
}

const buttonAnimation = ({target}) => {
    let clickedButton = target.tagName.toLowerCase() === 'i' ? target.parentElement : target;
    if (clickedButton.classList.contains("active")) return;
    
    clickedButton.style.transform = "scale(" + 1.2 + ")";
    clickedButton.style.color = "black";
    clickedButton.style.backgroundColor = "hsl(60, 25%, 60%)";
    setTimeout(() => {
        clickedButton.style.transform = "scale(" + 1 + ")";
        clickedButton.style.removeProperty("color");
        clickedButton.style.removeProperty("background-color");
    }, 150);
}

const copyPasteWeight = (input) => {
    let inputs = document.querySelectorAll(".select-weight input");
    inputs.forEach((ele) => ele.value = input.value);
}
const copyPasteReps = (input) => {
    let inputs = document.querySelectorAll(".select-reps input");
    inputs.forEach((ele) => ele.value = input.value);
}

const confirmEnter = (e) => {
    if (e.key === "Enter")
    {
        if (e.target.nextElementSibling && e.target.value != "")
            e.target.nextElementSibling.firstElementChild.click();
        closeAllLists();
        e.target.blur();
    }
}

const messageUser = (title, message, toVerify, isTimed, duration = 2000) => {
    if (messaging) return;
    messaging = true;

    let messageBox = document.querySelector(".message-box");
    messageBox.style.display = "block";

    let messageContent = document.querySelector(".message-content");
    messageContent.style.display = "flex";
    
    if (toVerify)
    {
        messageContent.style.top = (window.innerHeight / 2) - 150 +  "px";
        document.querySelector(".verify-div").style.display = "block";
    }
    else
        messageContent.style.top = (window.innerHeight / 2) - (messageContent.offsetHeight / 2) +  "px";

    messageContent.querySelector(".title").innerHTML = title;
    messageContent.querySelector(".message-text").innerHTML = message;
    
    setTimeout(() => {
        messageBox.style.opacity = 1;
        messageContent.style.opacity = 1;
    }, 10);

    if (!isTimed) return;
    setTimeout(() => closeMessageBox(), duration);
}
const closeMessageBox = () => {
    if (!messaging) return;
    messaging = false;
    let messageBox = document.querySelector(".message-box");
    let messageContent = document.querySelector(".message-content");

    messageBox.style.opacity = 0;
    messageContent.style.opacity = 0;
    setTimeout(() => {
        messageBox.style.display = "none";
        messageContent.style.display = "none";
        document.querySelector(".verify-div").style.display = "none";
    }, 800);
}

let holdTimer;
let warnTimer;
const deleteElement = (e) => {
    let element = (e.target.tagName === "BUTTON") ? e.target : e.target.closest("button");
    element.classList.add("active");

    if (e.type === "touchstart")
    {
        warnTimer = setTimeout(warnUser, 500);
        holdTimer = setTimeout(deleteEntry, 2500);
    }
    else
    {
        if (element.classList.contains("delete"))
        {
            element.classList.remove("delete");
            element.style.opacity = 1;
            if (element.classList.contains("previous-session-button"))
                element.addEventListener('click', previousMonthButtonFunction);
            else if (element.classList.contains("previous-day-button"))
                element.addEventListener('click', previousDayButtonFunction);
        }
        element.classList.remove("active");

        clearTimeout(warnTimer);
        warnTimer = undefined;

        clearTimeout(holdTimer);
        holdTimer = undefined;
    }
    
    function warnUser() {
        element.classList.add("delete");
        element.style.opacity = 0;

        if (element.classList.contains("previous-session-button"))
            element.removeEventListener('click', previousMonthButtonFunction);
        else if (element.classList.contains("previous-day-button"))
            element.removeEventListener('click', previousDayButtonFunction);
        
    }

    function deleteEntry() {
        let index = parseInt(element.id.match(/\d+/)[0]);

        if (element.classList.contains("previous-session-button"))
        {
            for (let i = 0; i < workoutData.length; i++)
            {
                if (workoutData[i].date.month === curData[index].date.month &&
                    workoutData[i].date.year === curData[index].date.year)
                    workoutData.splice(i--, 1);
            }
            curData.splice(index, 1);
        }
        else
        {
            for (let i = 0; i < workoutData.length; i++)
            {
                if (workoutData[i].date.month === curData[index].date.month &&
                    workoutData[i].date.year === curData[index].date.year &&
                    workoutData[i].date.day === curData[index].date.day)
                    workoutData.splice(i--, 1);
            }
            curData.splice(index, 1);
            curDaysData.splice(index, 1);
        }
        saveDataToStorage('workoutData', workoutData);
        element.remove();
    }
}