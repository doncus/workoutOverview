const menuButtonAction = ({target}) => {
    let clickedButton = target.tagName.toLowerCase() === 'i' ? target.parentElement : target;
    if (clickedButton.classList.contains("active")) return;

    // set the clicked button as active
    let allButtons = contentFront.querySelectorAll(".menu-select button");
    allButtons.forEach(curBtn => curBtn.classList.remove("active"));
    clickedButton.classList.add("active");
    // remove fixed height if exists
    document.querySelector(".selected-menu-div").style.removeProperty("height");
    // shortly disable all buttons
    allButtons.forEach(btn => btn.disabled = true);
    setTimeout(() => allButtons.forEach(btn => btn.disabled = false), 200);

    menuButtonAnimation(clickedButton);

    switch (clickedButton.className) {
        case "progress-chart active":
            selectedDate = new Date();
            showDropDownInput(true);
            if (!userData.exercises.length)
                noDataFound();
            break;
        case "monthly-sessions-button active":
            generatePrevSessionData(10);
            break;
        case "add-session-button active":
            addSessionButtonFunction();
            break;
        default:
            showDropDownInput(false);
            if (!userData.exercises.length)
                noDataFound();
            break;
    }

    function menuButtonAnimation(clickedButton) {
        clickedButton.style.transform = "scale(" + 1.2 + ")";
        clickedButton.style.color = "black";
        clickedButton.style.backgroundColor = "hsl(60, 25%, 60%)";
        setTimeout(() => {
            clickedButton.style.transform = "scale(" + 1 + ")";
            clickedButton.style.removeProperty("color");
            clickedButton.style.removeProperty("background-color");
        }, 160);
    }
}

const showDropDownInput = (isChartMenu) => {
    const selectedMenuDiv = document.querySelector(".selected-menu-div");
    selectedMenuDiv.innerHTML = "";

    const title = document.createElement("p");
    title.classList.add("title");
    selectedMenuDiv.append(title);
    setTimeout(() => title.style.transform = "translateX(0)", 10);
    
    const backgroundDiv = document.createElement("div");
    backgroundDiv.classList.add("drop-down-div");

    let text = document.createElement("p");
    text.innerHTML = "SELECT EXERCISE";
    
    backgroundDiv.append(text);

    const dropDownInput = document.createElement("input");
    dropDownInput.style.width = 80 + "%";
    dropDownInput.id = "chartInput";
    dropDownInput.addEventListener("keypress", confirmEnter);
    dropDownInput.setAttribute("type", "text");

    if (isChartMenu)
    {
        title.innerHTML = "Progress Chart";
        dropDownInput.setAttribute("onfocus", "setLastValue(this), resetInputValue(this), showExercises(this, 'chart')");
        dropDownInput.setAttribute("oninput", "showExercises(this, 'chart')");
    }
    else
    {
        title.innerHTML = "Overview";
        dropDownInput.setAttribute("onfocus", "resetInputValue(this), showExercises(this, 'overview')");
        dropDownInput.setAttribute("oninput", "showExercises(this, 'overview')");
    }
    dropDownInput.setAttribute("onfocusout", "getLastValue(this)");
    dropDownInput.setAttribute("autocomplete", "off");

    backgroundDiv.append(dropDownInput);
    selectedMenuDiv.append(backgroundDiv);
}

const getDataOfExercise = (inputValue) => {
    let sumSets = 0;
    let sumReps = 0;
    exerciseCounter = 0;
    maxWeightOfExercise = 0;
    minWeightOfExercise = 9999;
    maxRepsOfExercise = 0;
    minRepsOfExercise = 9999;
    averageReps = 0;
    lastExercise = undefined;
    exerciseBeforeYear = undefined;
    exerciseBeforeMonth = undefined;
    latestDate = new Date().getFullYear();
    monthOfExercise = [];
    yearOfExercise = [];
    allOfExercise = [];
    lastValue = inputValue;

    for (let i = 0; i < workoutData.length; i++)
    {
        if (workoutData[i].exercise == inputValue)
        {
            allOfExercise.push(workoutData[i]);
            if (workoutData[i].sets[0].reps > maxRepsOfExercise)
                maxRepsOfExercise = workoutData[i].sets[0].reps;
            
            if (workoutData[i].sets[0].reps < minRepsOfExercise)
                minRepsOfExercise = workoutData[i].sets[0].reps;
            if (workoutData[i].sets[0].weight < minWeightOfExercise)
                minWeightOfExercise = workoutData[i].sets[0].weight;
            
            if (workoutData[i].date.year < latestDate)
                latestDate = workoutData[i].date.year;

            for (let j = 0; j < workoutData[i].sets.length; j++)
            {
                sumSets++;
                sumReps += workoutData[i].sets[j].reps;
                if (workoutData[i].sets[j].weight > maxWeightOfExercise)
                    maxWeightOfExercise = workoutData[i].sets[j].weight;
            }
        }
    }
    averageReps = Math.trunc(sumReps / sumSets);
    if (!allOfExercise.length) return;

    sortByDateAsc(allOfExercise);

    lastExercise = allOfExercise[allOfExercise.length-1];
    exerciseCounter = allOfExercise.length;
    getDataOfYear();
    getDataOfMonth();
    
    if (!yearOfExercise.length || !monthOfExercise.length ) return;
    let isFound = false;
    for (let i = 0; i < allOfExercise.length; i++)
    {
        if (allOfExercise[i] == monthOfExercise[0])
            exerciseBeforeMonth = (i > 0) ? allOfExercise[i-1] : undefined;
        
        if (!isFound && allOfExercise[i].date.month === yearOfExercise[0].date.month)
        {
            exerciseBeforeYear = (i > 0) ? allOfExercise[i-1] : undefined;
            isFound = true;
        }
    }
    
}

const getDataOfYear = () => {
    for (let i = 0; i < allOfExercise.length; i++)
    {
        if (allOfExercise[i].date.year === selectedDate.getFullYear())
            yearOfExercise.push(allOfExercise[i]);
    }
    for (let i = 0; i < yearOfExercise.length-1; i++)
    {
        if (yearOfExercise[i].date.month === yearOfExercise[i+1].date.month)
            yearOfExercise.splice(i--, 1);
    }
    
}
const getDataOfMonth = () => {
    for (let i = 0; i < allOfExercise.length; i++)
    {
        if (allOfExercise[i].date.year === selectedDate.getFullYear() &&
            allOfExercise[i].date.month == selectedDate.getMonth()+1)
        {
            if (monthOfExercise.length > 0)
            {
                let lastEntry = monthOfExercise.length-1;
                if (monthOfExercise[lastEntry].date.day === allOfExercise[i].date.day)
                    continue;
            }
            monthOfExercise.push(allOfExercise[i]);
        }
    }
}

const noDataFound = () => {
    const selectedMenuDiv = document.querySelector(".selected-menu-div");

    let noDataDiv = document.createElement("div");
    noDataDiv.classList.add("no-data-div");
    noDataDiv.style.justifyContent = "center";
    
    let text = document.createElement("span");
    text.classList.add("no-data-span");
    text.style.marginTop = "100px";
    text.innerHTML = "No data found.";
    noDataDiv.append(text);

    selectedMenuDiv.insertBefore(noDataDiv, selectedMenuDiv.querySelector(".calendar-month"));
    setTimeout(() => noDataDiv.style.opacity = 1, 20);
    setTimeout(() => text.style.opacity = 1, 20);
}

// -------------------------------------------------------------- CHART
const createSelector = () => {
    if (document.querySelector(".calendar-month"))
        document.querySelector(".calendar-month").remove();
    const selectedMenuDiv = document.querySelector(".selected-menu-div");
    // create month-selector
    const calendarMonthDiv = document.createElement("DIV");
    calendarMonthDiv.classList.add("calendar-month");
    calendarMonthDiv.innerHTML = "";

    // create buttons to switch the month within the month selector div
    let button = document.createElement("BUTTON");
    button.classList.add("month-button");
    button.id = "prevButton";
    button.addEventListener("click", selectorPrevMonth);
    
    let icon = document.createElement("I");
    icon.classList.add("fa-solid");
    icon.classList.add("fa-chevron-left");
    button.append(icon);
    calendarMonthDiv.append(button);
    
    let span = document.createElement("SPAN");
    span.style.transition = "opacity 500ms";
    span.style.opacity = 0;
    span.innerHTML = months[selectedDate.getMonth()];
    setTimeout(() => span.style.opacity = 1, 20);
    
    calendarMonthDiv.append(span);

    button = document.createElement("BUTTON");
    button.classList.add("month-button");
    button.id = "nextButton";
    button.addEventListener("click", selectorNextMonth);

    icon = document.createElement("I");
    icon.classList.add("fa-solid");
    icon.classList.add("fa-chevron-right");
    button.append(icon);
    calendarMonthDiv.append(button);

    selectedMenuDiv.append(calendarMonthDiv);
}

const selectorNextMonth = () => {
    if (selectedDate.getMonth() == 11)
        selectedDate.setFullYear(selectedDate.getFullYear() - 1);
    selectedDate.setMonth(selectedDate.getMonth() + 1);
    document.querySelector(".calendar-month span").innerHTML = months[selectedDate.getMonth()];
    handleChart(document.querySelector(".drop-down-div input").value);
}
const selectorPrevMonth = () => {
    if (selectedDate.getMonth() == 0)
        selectedDate.setFullYear(selectedDate.getFullYear() + 1);
    selectedDate.setMonth(selectedDate.getMonth() - 1);
    document.querySelector(".calendar-month span").innerHTML = months[selectedDate.getMonth()];
    handleChart(document.querySelector(".drop-down-div input").value);
}
const selectorNextYear = () => {
    if (selectedDate.getFullYear() == new Date().getFullYear()) return;
    selectedDate.setFullYear(selectedDate.getFullYear() + 1);
    document.querySelector(".calendar-month span").innerHTML = selectedDate.getFullYear();
    handleChart(document.querySelector(".drop-down-div input").value);
}
const selectorPrevYear = () => {
    if (selectedDate.getFullYear() == latestDate) return;
    selectedDate.setFullYear(selectedDate.getFullYear() - 1);
    document.querySelector(".calendar-month span").innerHTML = selectedDate.getFullYear();
    handleChart(document.querySelector(".drop-down-div input").value);
}

const handleChart = (inputValue) => {
    if (document.querySelector("#progressChart"))
        document.querySelector("#progressChart").remove();
    if (document.querySelector(".no-data-div"))
        document.querySelector(".no-data-div").remove();

    getDataOfExercise(inputValue);
    if (workoutData.length != 0 && userData.exercises.length != 0 && exerciseCounter > 0)
        createProgressChart();
    else
        noDataFound();

    // scroll to requested position
    const selMenu = document.querySelector(".selected-menu-div");
    // setTimeout(() => selMenu.scrollIntoView({ behavior: 'smooth', block: 'center'}), 100);
    selMenu.style.height = "560px";
    document.body.scrollTo(0, selMenu.scrollHeight);
}

const createChartNav = () => {
    if (document.querySelector(".chart-navbar"))
        document.querySelector(".chart-navbar").remove();
    const selectedMenuDiv = document.querySelector(".selected-menu-div");
    
    let navbarDiv = document.createElement("div");
    navbarDiv.classList.add("chart-navbar");

    let timefilterDiv = document.createElement("div");
    timefilterDiv.classList.add("time-filter-div");

    let valueFilterDiv = document.createElement("div");
    valueFilterDiv.classList.add("value-filter-div");

    for (let i = 0; i < 4; i++)
    {
        let button = document.createElement("button");
        button.classList.add("chart-filter-button");
        button.id = "chartFilterButton" + i;
        button.style.transform = "translateY(-100%)";

        switch (i) {
            case 0:
                button.innerHTML = "Month";
                button.value = "month";
                button.classList.add("active");
                button.addEventListener("click", chartFilterMonth);
                timefilterDiv.append(button);
                break;
            case 1:
                button.innerHTML = "Year";
                button.value = "year";
                button.addEventListener("click", chartFilterYear);
                timefilterDiv.append(button);
                break;
            case 2:
                button.innerHTML = "Weight";
                button.value = "weight";
                button.classList.add("active");
                button.addEventListener("click", chartFilterY);
                valueFilterDiv.append(button);
                break;
            case 3:
                button.innerHTML = "Reps";
                button.value = "reps";
                button.addEventListener("click", chartFilterY);
                valueFilterDiv.append(button);
                break;
        }
    }
    navbarDiv.append(timefilterDiv);
    navbarDiv.append(valueFilterDiv);
    selectedMenuDiv.append(navbarDiv);

    setTimeout(() => {
        const buttons = document.querySelectorAll(".chart-filter-button");
        let cnt = 0;
        const slideInterval = setInterval(() => {
            if (buttons[cnt])
                buttons[cnt++].style.removeProperty("transform");
            if (cnt >= buttons.length)
                clearInterval(slideInterval);
        }, 100);
    }, 200);
};

const chartFilterMonth = ({target}) => {
    if (target.classList.contains("active")) return;

    let allButtons = target.parentElement.querySelectorAll("button");
    allButtons.forEach(curBtn => curBtn.classList.remove("active"));
    target.classList.add("active");

    let span = document.querySelector(".calendar-month span");
    span.innerHTML = months[selectedDate.getMonth()];
    span.style.transition = "opacity 0ms";
    span.style.opacity = 0;
    setTimeout(() => {
        span.style.transition = "opacity 500ms";
        span.style.opacity = 1;
    }, 20);

    let prevButton = document.querySelector(".calendar-month #prevButton");
    prevButton.removeEventListener("click", selectorPrevYear);
    prevButton.addEventListener("click", selectorPrevMonth);
    let nextButton = document.querySelector(".calendar-month #nextButton");
    nextButton.removeEventListener("click", selectorNextYear);
    nextButton.addEventListener("click", selectorNextMonth);

    handleChart(document.querySelector('.drop-down-div input').value);
}
const chartFilterYear = ({target}) => {
    if (target.classList.contains("active")) return;

    let allButtons = target.parentElement.querySelectorAll("button");
    allButtons.forEach(curBtn => curBtn.classList.remove("active"));
    target.classList.add("active");

    let span = document.querySelector(".calendar-month span");
    span.innerHTML = selectedDate.getFullYear();
    span.style.transition = "opacity 0ms";
    span.style.opacity = 0;
    setTimeout(() => {
        span.style.transition = "opacity 500ms";
        span.style.opacity = 1;
    }, 20);

    let prevButton = document.querySelector(".calendar-month #prevButton");
    prevButton.removeEventListener("click", selectorPrevMonth);
    prevButton.addEventListener("click", selectorPrevYear);
    let nextButton = document.querySelector(".calendar-month #nextButton");
    nextButton.removeEventListener("click", selectorNextMonth);
    nextButton.addEventListener("click", selectorNextYear);

    handleChart(document.querySelector('.drop-down-div input').value);
}
const chartFilterY = ({target}) => {
    if (target.classList.contains("active")) return;

    let allButtons = target.parentElement.querySelectorAll("button");
    allButtons.forEach(curBtn => curBtn.classList.remove("active"));
    target.classList.add("active");

    handleChart(document.querySelector('.drop-down-div input').value);
}

const choseDate = (inputValue) => {
    getDataOfExercise(inputValue);
    if (!lastExercise) return;

    selectedDate.setFullYear(lastExercise.date.year);
    selectedDate.setMonth(lastExercise.date.month-1);
    document.querySelector(".calendar-month span").innerHTML = months[selectedDate.getMonth()];

    let yearBtn = document.querySelector("#chartFilterButton1");
    let weightBtn = document.querySelector("#chartFilterButton2");
    let repsBtn = document.querySelector("#chartFilterButton3");

    if (lastExercise.date.year < new Date().getFullYear())
        yearBtn.click();
    if (!lastExercise.weightAdded)
        repsBtn.click();
}

// -------------------------------------------------------------- OVERVIEW
const handleOverviewRows = (inputValue) => {
    if (document.querySelector(".drop-down-div"))
    {
        while (document.querySelector(".drop-down-div").nextElementSibling)
            document.querySelector(".drop-down-div").nextElementSibling.remove();
    }
    getDataOfExercise(inputValue);
    if (workoutData.length != 0 && userData.exercises.length != 0 && exerciseCounter > 0)
        showDataOfSelectedExercise();
    else
        noDataFound();
}

const showDataOfSelectedExercise = () => {
    const selectedMenuDiv = document.querySelector(".selected-menu-div");

    // calculate since how many hours an exercise wasn't practiced
    let hoursSinceLastTime = 0;
    let curDate = new Date();
    hoursSinceLastTime = curDate.getTime() - lastExercise.date.ms;
    hoursSinceLastTime = Math.trunc(hoursSinceLastTime / 3600000);

    for (let i = 0; i < 6; i++)
    {
        let rowDiv = document.createElement("div");
        rowDiv.classList.add("overview-row-div");
        rowDiv.id = "info" + i;
        if (i == 0)
            rowDiv.style.marginTop = "30px";
        
        let text = document.createElement("span");
        let data = document.createElement("span");
        data.classList.add("exercise-data");
        switch (i) {
            case 0:
                text.innerHTML = "Personal record [kg]:";
                data.innerHTML = maxWeightOfExercise;
                break;
            case 1:
                text.innerHTML = "Personal record [reps]:";
                data.innerHTML = maxRepsOfExercise;
                break;
            case 2:
                text.innerHTML = "Average reps:";
                data.innerHTML = averageReps;
                break;
            case 3:
                text.innerHTML = "Times performed:";
                data.innerHTML = exerciseCounter;
                break;
            case 4:
                text.innerHTML = "Last time:";
                data.innerHTML = lastExercise.date.day + "." + lastExercise.date.month + 
                    "." + lastExercise.date.year;
                break;
            default:
                text.innerHTML = "Hours since:";
                data.innerHTML = hoursSinceLastTime;
                break;
        }
        rowDiv.append(text);
        rowDiv.append(data);
        selectedMenuDiv.append(rowDiv);
        setTimeout(() => rowDiv.style.opacity = 1, 20);
    }
}