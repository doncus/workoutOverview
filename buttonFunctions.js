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
    loginButton.style.backgroundColor = "hsl(60, 25%, 60%)";
    loginButton.style.color = "black";
    loginButton.style.width = 50 + "%";
    loginButton.style.opacity = 0;

    // save user to storage
    let dataToStore = {"username": loginInput.value, "exercises": exercises};
    saveDataToStorage("userData", dataToStore);
    userData = getData("userData");
    if (!workoutData || !workoutData.length)
    {
        workoutData = [];
        saveDataToStorage("workoutData", workoutData);
    }

    setTimeout(() => {
        loginContainer.style.opacity = 0;
        setTimeout(() => {
            main.style.display = "flex";
            setTimeout(() => initFrontContainer(), 500);
        }, 800);
    }, 400);
}

const addSessionButtonFunction = () => {
    calendarDate.addEventListener("click", createCalendar);
    setDate();
    setTimeout(() => hideFrontContainer(), 200);
}

const backButtonFunction = ({target}) => {
    showFrontContainer();
    setTimeout(() => {
        addSessionButton.disabled = false;
        const contentBackDivs = document.querySelectorAll(".content-back div");
        contentBackDivs.forEach(div => div.style.display = "flex");
        let addSessionElements = getNextSiblings(contentBack.querySelector(".select-sets"));
        if (addSessionElements.length)
            addSessionElements.forEach(ele => ele.style.removeProperty("display"));
    }, 1000);
}
const backButtonFunctionTwo = ({target}) => {
    let button = target.tagName.toLowerCase() === 'i' ? target.parentElement : target;
    button.removeEventListener("click", backButtonFunctionTwo);
    
    setTimeout(() => {
        let navTop = document.querySelector(".content-back-top");
        navTop.classList.remove("float");
        button.addEventListener("click", backButtonFunction);
        setTimeout(() => navTop.style.removeProperty("transition"), 10);
    }, 300);
    
    createFilterButtons();
    createPreviousDays(300);
}

const saveButtonFunction = ({target}) => {
    const inputs = contentBack.querySelectorAll("input:not([type=checkbox])");
    for (let i = 0; i < inputs.length; i++)
    {
        if (inputs[i].value == "") 
        {
            messageUser("Error", "Fill all inputs!", false, true);
            return;
        }
        if (inputs[i].parentElement.classList.contains("select-reps") && inputs[i].value == 0)
        {
            messageUser("Error", "0 reps is not acceptable!", false, true);
            return;
        }
        if (inputs[i].value.startsWith('.'))
            inputs[i].value = '0' + inputs[i].value;
    }
    if (selectedDate > new Date()) 
    {
        messageUser("Error", "You can't protocol for the future. </br></br> Check your date!", false, true);
        return;
    }

    target.style.backgroundColor = "hsl(60, 25%, 60%)";
    target.style.color = "black";
    target.style.width = 40 + "%";
    target.style.opacity = 0;
    target.disabled = true;
    setTimeout(() => {
        showFrontContainer();
        contentBack.querySelectorAll("input").forEach(input => input.value = "");
    }, 600);
    putDataToArray();
    setTimeout(() => {
        while (contentBack.querySelector(".select-sets").nextElementSibling)
            contentBack.querySelector(".select-sets").nextElementSibling.remove();
        selectedDate = new Date();
        addSessionButton.disabled = false;
    }, 1500);
}

const previousMonthButtonFunction = ({target}) => {
    let button = target.tagName.toLowerCase() === 'span' ? target.parentElement : target;
    const id = parseInt(button.id.match(/\d+/)[0]);
    const prevButtons = contentFront.querySelectorAll(".previous-session-button");
    prevButtons.forEach(btn => btn.disabled = true);
    button.style.color = "black";
    button.style.backgroundColor = "hsl(60, 25%, 60%)";

    let contentBackDivs = contentBack.querySelectorAll("div");
    let addSessionElements = getNextSiblings(contentBack.querySelector(".select-sets"));
    contentBackDivs.forEach(div => div.style.display = "none");
    addSessionElements.forEach(ele => ele.style.display = "none");
    
    calendarDate.innerHTML = button.innerHTML;
    
    setTimeout(() => {
        hideFrontContainer(); 
        showEachDay(id);
        document.body.style.overflowY = "hidden";
    }, 200);
}

const previousDayButtonFunction = ({target}) => {
    const backButton = document.querySelector(".back-button");
    backButton.removeEventListener("click", backButtonFunction);
    backButton.addEventListener("click", backButtonFunctionTwo);
    backButton.disabled = true;
    let button = target.tagName === 'SPAN' ? target.parentElement : target;
    const prevButtons = contentBack.querySelectorAll(
        ".previous-days-div button:not(#" + button.id + ")");
    const filter = contentBack.querySelector(".day-filter-button");
    let topOffset = filter.getBoundingClientRect().top - 30;
    let transY = button.getBoundingClientRect().top - filter.getBoundingClientRect().top;

    button.style.transition = "all 550ms";
    button.style.transform = "translateY(" + (-transY) + "px)";
    button.style.borderRadius = "10px";
    button.style.fontWeight = "bold";
    
    prevButtons.forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = 0;
        setTimeout(() => btn.remove(), 500);
    });

    button.disabled = true;
    button.style.color = "black";
    button.style.backgroundColor = "hsl(60, 25%, 60%)";
    setTimeout(() => button.remove(), 498);

    setTimeout(() => {
        let topNav = document.querySelector(".content-back-top");
        topNav.style.transition = "all 0ms";
        topNav.classList.add("float");

        const button2 = button;
        button2.style.marginTop = topOffset + "px";
        button2.style.transform = "translateY(" + 0 + "px)";
        document.querySelector(".previous-days-div").append(button2);
    }, 500);
    setTimeout(() => backButton.disabled = false, 700);
    ///////////////////////////////////////////////////////////
    const id = parseInt(button.id.match(/\d+/)[0]);
    const dayOfMonth = curDaysData[id].date.day;

    curDay = [];
    for (let i = 0; i < curData.length; i++)
    {
        if (curData[i].date.day === dayOfMonth)
            curDay.push(curData[i]);
    }

    //////////
    const prevDays = document.querySelector(".previous-days-div");
    
    let divSave = [];

    for (let i = 0; i < curDay.length; i++)
    {
        let div = document.createElement("div");
        div.classList.add("day-container");
        div.setAttribute("id", "dayContainer" + i);

        let subDiv = document.createElement("div");
        subDiv.classList.add("time-of-exercise-div");
        subDiv.id = "exercise" + i;
        subDiv.addEventListener("click", expandSetInfos);

        let span = document.createElement("span");
        span.innerHTML = curDay[i].date.time;
        subDiv.append(span);

        let p = document.createElement("p");
        p.innerHTML = curDay[i].exercise;
        subDiv.append(p);

        div.append(subDiv);
        
        for (let j = 0; j < curDay[i].sets.length; j++)
        {
            let setDiv = document.createElement("div");
            setDiv.classList.add("set-container");
            setDiv.setAttribute("id", "setContainer" + j);

            // set number
            span = document.createElement("span");
            span.innerHTML = "SET " + (j+1);
            span.style.fontStyle = "italic";

            setDiv.append(span);

            // sets
            let setChildDiv = document.createElement("div");
            setChildDiv.classList.add("set-reps");

            span = document.createElement("span");
            span.classList.add("reps-label");
            span.innerHTML = "reps";
            setChildDiv.append(span);
            let input = document.createElement("input");
            input.classList.add("reps-value");
            input.setAttribute("type", "tel");
            input.setAttribute("onfocus", "setLastValue(this)");
            input.addEventListener("input", checkIfInteger);
            input.setAttribute("oninput", "checkIfSmallerThan(this, 999)");
            input.addEventListener("change", setEditRepsFunction);
            input.value = curDay[i].sets[j].reps;
            setChildDiv.append(input);

            setDiv.append(setChildDiv);
            div.append(setDiv);

            // weight
            setChildDiv = document.createElement("div");
            setChildDiv.classList.add("set-weight");

            span = document.createElement("span");
            span.classList.add("weight-label");
            span.innerHTML = "kg";
            setChildDiv.append(span);
            input = document.createElement("input");
            input.classList.add("weight-value");
            input.setAttribute("type", "tel");
            input.setAttribute("onfocus", "setLastValue(this)");
            input.addEventListener("input", checkIfNumber);
            input.setAttribute("oninput", "checkIfSmallerThan(this, 999)");
            input.addEventListener("change", setEditWeightFunction);
            if (!curDay[i].sets[j].weight)
                input.value = 0;
            else
                input.value = curDay[i].sets[j].weight;
            setChildDiv.append(input);

            setDiv.append(setChildDiv);
            div.append(setDiv);

            // minimize all sessions
            setDiv.style.display = "none";
        }
        divSave.push(div);

        let setCounter = document.createElement("div");
        setCounter.classList.add("set-counter");
        setCounter.innerHTML = curDay[i].sets.length + " SET";
        if (curDay[i].sets.length > 1)
            setCounter.innerHTML += "S";
        div.append(setCounter);
    }
    setTimeout(() => {
        for (let i = 0; i < divSave.length; i++)
        {
            prevDays.append(divSave[i]);
            setTimeout(() => divSave[i].style.opacity = 1, 50);
        }
    }, 500);
}

const expandSetInfos = ({target}) => {
    target = (target.className == "DIV") ? target : target.parentElement;
    let clickedExerciseId = parseInt(target.id.match(/\d+/)[0]);
    const parent = document.querySelector("#dayContainer" + clickedExerciseId);
    let setsToToggle = parent.querySelectorAll(".set-container");
    const parendClosed = 101;
    let wait = Math.trunc(120 / setsToToggle.length);
    parent.style.height = parent.getBoundingClientRect().height + "px";

    if (window.getComputedStyle(setsToToggle[0]).display == "flex")
    {
        parent.style.height = parendClosed + "px";
        setsToToggle.forEach(setInfo => setInfo.style.display = "none");

        let setCounter = document.createElement("DIV");
        setCounter.classList.add("set-counter");
        setCounter.innerHTML = setsToToggle.length + " SET";
        setCounter.style.opacity = 0;
        if (setsToToggle.length > 1)
            setCounter.innerHTML += "S";
        parent.append(setCounter);
        setTimeout(() => setCounter.style.opacity = 1, 80);
    }
    else
    {
        parent.style.height = parent.getBoundingClientRect().height + (70 * setsToToggle.length) + "px";
        parent.querySelector(".set-counter").remove();
        setsToToggle.forEach(setInfo => {
            setInfo.style.opacity = 0;
            setInfo.style.display = "flex";
        });
        let cnt = 0;
        setTimeout(() => {
            const slideInterval = setInterval(() => {
                setsToToggle[cnt++].style.opacity = 1;
                if (cnt >= setsToToggle.length)
                    clearInterval(slideInterval);
            }, wait);
        }, 10);
        setTimeout(() => parent.scrollIntoView({ behavior: 'smooth', block: 'center'}), 200);
    }
}

const setEditWeightFunction = ({target}) => {
    if (target.value == "")
    {
        target.value = lastValue;
        return;
    }
    if (target.value.endsWith('.'))
        target.value = target.value.substring(0, target.value.length-1);
    if (target.value.startsWith('.'))
        target.value = '0' + target.value;
        
    let id = target.closest(".day-container").id;
    let index = parseInt(id.match(/\d+/)[0]);

    let setId = target.closest(".set-container").id;
    let setIndex = parseInt(setId.match(/\d+/)[0]);
    curDay[index].sets[setIndex].weight = parseFloat(target.value);

    saveDataToStorage("workoutData", workoutData);
}
const setEditRepsFunction = ({target}) => {
    if (target.value == "")
    {
        target.value = lastValue;
        return;
    }

    let id = (target.closest(".day-container").id);
    let index = parseInt(id.match(/\d+/)[0]);

    let setId = target.closest(".set-container").id;
    let setIndex = parseInt(setId.match(/\d+/)[0]);

    curDay[index].sets[setIndex].reps = parseInt(target.value);

    saveDataToStorage("workoutData", workoutData);
}

const createPreviousDays = (slideTimeout) => {
    const prevDaysDiv = document.querySelector(".previous-days-div");

    if (document.querySelector(".previous-days-button"))
    {
        const prevDays = document.querySelectorAll(".previous-days-button");
        prevDays.forEach(prevDay => {
            prevDay.style.opacity = 0;
            setTimeout(() => prevDay.remove(), 300);
        });
    }
    if (document.querySelector(".day-container"))
    {
        const days = document.querySelectorAll(".day-container");
        days.forEach(day => {
            day.style.opacity = 0;
            setTimeout(() => day.remove(), 300);
        });
    }

    for (let i = 0; i < curDaysData.length; i++)
    {
        let button = document.createElement("button");
        button.classList.add("previous-days-button");
        button.setAttribute("id", "prevDayButton" + i);

        let showDate = curDaysData[i].date.day + "." + curDaysData[i].date.month + ".";
        let showWeekday = curDaysData[i].date.weekday;
        let wholeDay = [showDate, showWeekday];

        for (let i = 0; i < wholeDay.length; i++)
        {
            let span = document.createElement("span");
            span.innerHTML = wholeDay[i];
            if (i == 0)
                span.id = "date"
            else
                span.id = "weekday"
            button.append(span);
        }
        button.addEventListener('click', previousDayButtonFunction);
        button.addEventListener('touchstart', deleteElement, {passive: true});
        button.addEventListener('touchend', deleteElement);
        prevDaysDiv.append(button);

        setTimeout(() => {
            document.body.style.removeProperty("overflow-y");
            const prevDaysButton = document.querySelectorAll(".previous-days-div button");
            let cnt = 0;
            const slideInterval = setInterval(() => {
                prevDaysButton[cnt++].style.transform = "translateX(" + 0 + ")";
            if (cnt >= prevDaysButton.length)
                clearInterval(slideInterval);
            }, 50);
        }, slideTimeout);
    }
}

const createFilterButtons = () => {
    const previousDaysDiv = document.querySelector(".previous-days-div");
    let button = document.createElement("button");
    button.classList.add("day-filter-button");

    for (let i = 0; i < 2; i++)
    {
        let span = document.createElement("span");
        switch (i) {
            case 0:
                span.id = "date";
                span.innerHTML = "Date";
                span.classList.add("active");
                span.addEventListener('click', filterDateDesc);
                break;
            default:
                span.id = "weekday";
                span.innerHTML = "Weekday";
                span.addEventListener('click', filterWeekdayFunction);
                break;
        }
        button.append(span);
    }
    previousDaysDiv.append(button);
};

const filterDateDesc = ({target}) => {
    let prevDayButtons = document.querySelectorAll(".previous-days-div button:not(.day-filter-button)");
    prevDayButtons.forEach(button => button.disabled = true);
    const dayFilterButtons = document.querySelectorAll(".day-filter-button span");
    dayFilterButtons.forEach(filter => {
        filter.classList.remove("active");
    });
    if (!target.classList.contains("active"))
        target.classList.add("active");

    sortByDateDesc(curDaysData);

    target.removeEventListener('click', filterDateDesc);
    setTimeout(() => {
        target.addEventListener('click', filterDateAsc);
        prevDayButtons.forEach(button => button.disabled = false);
    }, 300);

    createPreviousDays(300);
}
const filterDateAsc = ({target}) => {
    let prevDayButtons = document.querySelectorAll(".previous-days-div button:not(.day-filter-button)");
    prevDayButtons.forEach(button => button.disabled = true);
    const dayFilterButtons = document.querySelectorAll(".day-filter-button span");
    dayFilterButtons.forEach(filter => {
        filter.classList.remove("active");
    });
    if (!target.classList.contains("active"))
        target.classList.add("active");

    sortByDateAsc(curDaysData);
    
    target.removeEventListener('click', filterDateAsc);
    setTimeout(() => {
        target.addEventListener('click', filterDateDesc);
        prevDayButtons.forEach(button => button.disabled = false);
    }, 300);

    createPreviousDays(300);
}

const filterWeekdayFunction = ({target}) => {
    if (target.classList.contains("active")) return;
    let prevDayButtons = document.querySelectorAll(".previous-days-div button:not(.day-filter-button)");
    prevDayButtons.forEach(button => button.disabled = true);

    const dayFilterButtons = document.querySelectorAll(".day-filter-button span");
    dayFilterButtons.forEach(filter => {
        filter.classList.remove("active");
    });
    target.classList.add("active");

    let tempData = JSON.parse(JSON.stringify(curDaysData));
    let sortedArray = [];
    let weekdays = ["Monday", "Tuesday", "Wednesday", 
        "Thursday", "Friday", "Saturday", "Sunday"];
    
    for (let j = 0; j < weekdays.length; j++)
    {
        for(let i = 0; i < tempData.length; i++)
        {
            if (tempData[i].date.weekday === weekdays[j])
                sortedArray.push(tempData[i]);
        }
    }
    curDaysData = sortedArray;
    setTimeout(() => prevDayButtons.forEach(button => button.disabled = false), 300);
    createPreviousDays(300);
}

const filterTimeFunction = ({target}) => {
    if (target.classList.contains("active")) return;
    
    document.querySelectorAll(".previous-days-div button:not(.day-filter-button)").forEach(
        button => button.disabled = true
    );
    const dayFilterButtons = document.querySelectorAll(".day-filter-button span");
    dayFilterButtons.forEach(filter => {
        filter.classList.remove("active");
    });
    target.classList.add("active");

    let tempData = JSON.parse(JSON.stringify(curDaysData));
    let sortedArray = [];
    let sortedIndex;
    let minHour, minMinute;
    
    while (sortedArray.length < curDaysData.length)
    {
        minHour = 23;
        minMinute = 59;
        for(let i = 0; i < tempData.length; i++)
        {
            hour = tempData[i].date.time.match(/\d+/g)[0];
            if (hour < minHour && hour >= 6)
            {
                minHour = hour;
            }
        }
        for(let i = 0; i < tempData.length; i++)
        {
            minute = tempData[i].date.time.match(/\d+/g)[1];
            hour = tempData[i].date.time.match(/\d+/g)[0];
            if (hour == minHour && minute < minMinute)
            {
                
                minMinute = minute;
                sortedIndex = i;
            }
        }
        sortedArray.push(tempData[sortedIndex]);
        tempData.splice(sortedIndex, 1);
    }
    curDaysData = sortedArray;

    createPreviousDays(200);
}

const openUserButtonFunction = () => {
    const userButton = document.querySelector(".user-button");
    if (document.querySelector(".user-settings"))
    {
        userButton.classList.remove("active");
        userButton.style.transform = "scale(" + 1 + ")";
        document.querySelector(".user-settings").remove();
        contentFront.style.display = "flex";
        return;
    }
    userButton.classList.add("active");

    const userSettings = document.createElement("DIV");
    setTimeout(() => userSettings.style.transform = "scale(1)", 10);
    userSettings.classList.add("user-settings");

    contentFront.style.display = "none";
    document.querySelector(".main-container").append(userSettings);

    setTimeout(() => createUserContent(), 100);
}