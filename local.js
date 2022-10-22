let workoutData;
let userData;

const saveDataToStorage = (storage, data) => localStorage.setItem(storage, JSON.stringify(data));

const getData = storage => {
    if (localStorage.getItem(storage) === null)
        return null;
    data = JSON.parse(localStorage.getItem(storage));
        return data;
}

const deleteData = e => {
    const previousSessions = document.querySelector(".previous-session-div");
    let index = parseInt(e.target.id.match(/\d+/)[0]);
    workoutData.splice(workoutData[index], 1);

    if (!workoutData.length)
        previousSessions.style.display = "none";

    localStorage.setItem('workoutData', JSON.stringify(workoutData));
}

// check how many entries differ in month and/or date
const showAllOfData = () => {
    const previousSessions = document.querySelector(".previous-session-div");

    // if saved buttons exists already on front page, 
    // delete them because they get generated again
    if (previousSessions.querySelector("button"))
        previousSessions.querySelectorAll("button").forEach(button => button.remove());
    
    // check if workoutData hast actual data in it
    if (workoutData == undefined || !workoutData.length)
    {
        previousSessions.style.display = "none";
        return;
    }
    else
        previousSessions.style.display = "flex";

    let tempData = [];
    tempData.push(workoutData[0]);
    let month, year;
    let newEntry;

    for (let i = 1; i < workoutData.length; i++)
    {
        month = workoutData[i].date.month;
        year = workoutData[i].date.year;
        newEntry = true;

        for (let j = 0; j < tempData.length; j++)
        {
            if (month === tempData[j].date.month &&
                year === tempData[j].date.year)
            {
                newEntry = false;
                break;
            }
        }
        if (newEntry)
        tempData.push(workoutData[i]);
    }
    console.log("tempData: ");
    console.log(tempData);

    for (let i = 0; i < tempData.length; i++)
        showWorkoutButtons(i, tempData);
    
};

// create relevant buttons on the front page
const showWorkoutButtons = (index, tempData) => {
    const prevSessionDiv = document.querySelector(".previous-session-div");
    const year = tempData[index].date.year;
    const monthOfYear = tempData[index].date.monthName.toUpperCase() + " [" + year + "]";

    let button = document.createElement("button");
    button.classList.add("previous-session-button");
    button.setAttribute("id", "prevButton" + index);
    button.innerHTML = monthOfYear;
    button.addEventListener('click', e => previousMonthButtonFunction(e, tempData[index]));
    prevSessionDiv.append(button);
}

const showEachDay = (monthOfDay, yearOfDay) => {
    const previousDaysDiv = document.querySelector(".previous-days-div");
    previousDaysDiv.style.display = "flex";

    let tempData = [];
    let month, year;

    for (let i = 0; i < workoutData.length; i++)
    {
        month = workoutData[i].date.month;
        year = workoutData[i].date.year;

        if (month === monthOfDay &&
            year === yearOfDay)
            tempData.push(workoutData[i]);
    }

    for (let i = 0; i < tempData.length; i++)
    {
        let button = document.createElement("button");
        button.classList.add("previous-days-button");
        button.setAttribute("id", "prevDayButton" + i);
        let wholeDay =  tempData[i].date.day + "." + tempData[i].date.month + ". | " + 
            tempData[i].date.weekday + " | " + tempData[i].date.time;
        button.innerHTML = wholeDay;
        button.addEventListener('click', () => {
            // IMPLEMENT HERE
        });
        previousDaysDiv.append(button);
    }
    setTimeout(() => {
        const previousSessionDays = document.querySelectorAll(".previous-days-button");
        let cnt = 0;
        const slideInterval = setInterval(() => {
            previousSessionDays[cnt++].style.transform = "translateX(" + 0 + ")";
        if (cnt >= previousSessionDays.length)
            clearInterval(slideInterval);
        }, 100);
    }, 1500);
}