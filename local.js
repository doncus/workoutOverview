let workoutData;
let userData;
let curData;
let curDaysData;
let curDay;
let curSession;

const saveDataToStorage = (storage, data) => localStorage.setItem(storage, JSON.stringify(data));

const getData = storage => {
    if (localStorage.getItem(storage) === null)
        return null;
    let data = JSON.parse(localStorage.getItem(storage));
        return data;
}

const deleteData = ({target}) => {
    const previousSessions = document.querySelector(".selected-menu-div");
    let index = parseInt(target.id.match(/\d+/)[0]);
    workoutData.splice(workoutData[index], 1);

    if (!workoutData.length)
        previousSessions.style.display = "none";

    saveDataToStorage('workoutData', workoutData);
}

// check how many entries differ in month and/or date
const generatePrevSessionData = (delay = 100) => {
    const previousSessionDiv = document.querySelector(".selected-menu-div");
    // delete all content of parent div because it gets generated again
    previousSessionDiv.innerHTML = "";

    const title = document.createElement("p");
    title.classList.add("title");
    title.innerHTML = "Previous Sessions";
    previousSessionDiv.append(title);
    setTimeout(() => title.style.transform = "translateX(0)", 10);

    // check if workoutData hast actual data in it
    if (workoutData == undefined || !workoutData.length)
    {
        let text = document.createElement("span");
        text.classList.add("no-data-span");
        text.innerHTML = "No workout sessions saved yet.";
        text.style.marginTop = "40px";
        text.style.borderBottom = "none";
        previousSessionDiv.append(text);
        text = document.createElement("span");
        text.classList.add("no-data-span");
        text.innerHTML = "Select the plus symbol to add a session.";
        previousSessionDiv.append(text);
        
        setTimeout(() => previousSessionDiv.querySelectorAll("span").forEach(span => span.style.opacity = 1), 100);
        return;
    }

    curData = [];
    curData.push(workoutData[0]);
    let month, year;
    let newEntry;

    // compare each workoutData[i] and only save those who
    // don't have the same month in the same year
    for (let i = 1; i < workoutData.length; i++)
    {
        month = workoutData[i].date.month;
        year = workoutData[i].date.year;
        newEntry = true;

        for (let j = 0; j < curData.length; j++)
        {
            if (month === curData[j].date.month &&
                year === curData[j].date.year)
            {
                newEntry = false;
                break;
            }
        }
        if (newEntry)
            curData.push(workoutData[i]);
    }

    // sort previous sessions by date
    sortByDateDesc(curData);

    showPrevSessionButtons(delay);
};

// create relevant buttons on the front page
const showPrevSessionButtons = (delay) => {
    const prevSessionDiv = document.querySelector(".selected-menu-div");
    for (let i = 0; i < curData.length; i++)
    {
        let year = curData[i].date.year;

        let button = document.createElement("button");
        button.classList.add("previous-session-button");
        button.setAttribute("id", "prevButton" + i);
        button.addEventListener('click', previousMonthButtonFunction);
        button.addEventListener('touchstart', deleteElement, {passive: true});
        button.addEventListener('touchend', deleteElement);
        let span = document.createElement("span");
        span.innerHTML = curData[i].date.monthName;
        button.append(span);
        span = document.createElement("span");
        span.innerHTML = year;
        button.append(span);
        prevSessionDiv.append(button);
    }

    const prevSessionButtons = prevSessionDiv.querySelectorAll("button");
    if (document.querySelector(".selected-menu-div button"))
    {
        setTimeout(() => {
            let cnt = 0;
            const slideInterval = setInterval(() => {
                prevSessionButtons[cnt++].style.transform = "translateX(" + 0 + ")";
                if (cnt >= prevSessionButtons.length)
                    clearInterval(slideInterval);
            }, 100);
        }, delay);
    }
}

const showEachDay = (index) => {
    const previousDaysDiv = document.querySelector(".previous-days-div");
    previousDaysDiv.style.display = "flex";
    const monthOfDay = curData[index].date.month;
    const yearOfDay = curData[index].date.year;

    curData = [];
    let month, year;
    
    for (let i = 0; i < workoutData.length; i++)
    {
        month = workoutData[i].date.month;
        year = workoutData[i].date.year;

        if (month === monthOfDay && year === yearOfDay)
            curData.push(workoutData[i]);
    }
    
    let tempDataSpliced = JSON.parse(JSON.stringify(curData));
    
    for (let i = 0; i < tempDataSpliced.length; i++)
    {
        for (let j = 0; j < tempDataSpliced.length; j++)
        {
            if (i == j) continue;
            if (tempDataSpliced[i].date.day == tempDataSpliced[j].date.day)
                tempDataSpliced.splice(j--, 1);
        }
    }
    curDaysData = [...tempDataSpliced];

    createFilterButtons();
    createPreviousDays(1000);
}
