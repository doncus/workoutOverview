let workoutData;
let userData;
let curData;
let curDaysData;
let curDay;
let inputValue;

const saveDataToStorage = (storage, data) => localStorage.setItem(storage, JSON.stringify(data));

const getData = storage => {
    if (localStorage.getItem(storage) === null)
        return null;
    data = JSON.parse(localStorage.getItem(storage));
        return data;
}

const deleteData = ({target}) => {
    const previousSessions = document.querySelector(".selected-menu-div");
    let index = parseInt(target.id.match(/\d+/)[0]);
    workoutData.splice(workoutData[index], 1);

    if (!workoutData.length)
        previousSessions.style.display = "none";

    localStorage.setItem('workoutData', JSON.stringify(workoutData));
}

// check how many entries differ in month and/or date
const generatePrevSessionData = (delay = 100) => {
    const previousSessionDiv = document.querySelector(".selected-menu-div");
    // delete all content of parent div because it gets generated again
    previousSessionDiv.innerHTML = "";
    
    // check if workoutData hast actual data in it
    if (workoutData == undefined || !workoutData.length) return;

    const title = document.createElement("p");
    title.classList.add("title");
    title.innerHTML = "Previous Sessions:";
    previousSessionDiv.append(title);

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
    // sort previous sessions by currency
    curData.sort((session1, session2) => {
        if (session1.date.year > session2.date.year)
            return -1;
        if (session1.date.year < session2.date.year)
            return 1;
        if (session1.date.year == session2.date.year &&
            session1.date.month > session2.date.month)
            return -1;
        if (session1.date.year == session2.date.year &&
            session1.date.month < session2.date.month)
            return 1;
    })

    // console.log("curMonthsData: ");
    // console.log(curData);
    showPrevSessionButtons(delay);
};

// create relevant buttons on the front page
const showPrevSessionButtons = (delay) => {
    const prevSessionDiv = document.querySelector(".selected-menu-div");
    let year, monthOfYear;
    for (let i = 0; i < curData.length; i++)
    {
        year = curData[i].date.year;

        let button = document.createElement("button");
        button.classList.add("previous-session-button");
        button.setAttribute("id", "prevButton" + i);
        button.addEventListener('click', previousMonthButtonFunction);
        let span = document.createElement("span");
        span.innerHTML = curData[i].date.monthName.toUpperCase();
        button.append(span);
        span = document.createElement("span");
        span.innerHTML = year;
        button.append(span);
        prevSessionDiv.append(button);
    }

    const prevSessionButtons = prevSessionDiv.querySelectorAll(" button");
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
    createPreviousDays(1500);
}