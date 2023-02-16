const menuButtonAction = ({target}) => {
    let clickedButton = target.tagName.toLowerCase() === 'i' ? target.parentElement : target;
    if (clickedButton.classList.contains("active")) return;

    // set the clicked button as active
    let allButtons = contentFront.querySelectorAll(".menu-select button");
    allButtons.forEach(curBtn => curBtn.classList.remove("active"));
    clickedButton.classList.add("active");
    // shortly disable all buttons
    allButtons.forEach(btn => btn.disabled = true);
    setTimeout(() => allButtons.forEach(btn => btn.disabled = false), 200);

    menuButtonAnimation(clickedButton);

    switch (clickedButton.className) {
        case "progress-chart active":
            showDropDownInput(true);
            break;
        case "monthly-sessions-button active":
            generatePrevSessionData();
            break;
        case "add-session-button active":
            addSessionButtonFunction();
            break;
        default:
            showDropDownInput(false);
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
        }, 200);
    }
}

const showDropDownInput = (isChartMenu) => {
    const selectedMenuDiv = document.querySelector(".selected-menu-div");
    selectedMenuDiv.innerHTML = "";

    const title = document.createElement("p");
    title.classList.add("title");
    selectedMenuDiv.append(title);
    
    const backgroundDiv = document.createElement("div");
    backgroundDiv.classList.add("drop-down-div");

    let text = document.createElement("p");
    text.innerHTML = "SELECT EXERCISE";
    
    backgroundDiv.append(text);

    const dropDownInput = document.createElement("input");
    dropDownInput.style.width = 80 + "%";
    dropDownInput.setAttribute("type", "text");
    dropDownInput.setAttribute("onfocus", "resetInputValue(this), showExercises(this)");
    dropDownInput.setAttribute("oninput", "showExercises(this)");
    dropDownInput.setAttribute("autocomplete", "off");

    backgroundDiv.append(dropDownInput);
    selectedMenuDiv.append(backgroundDiv);

    if (isChartMenu)
    {
        title.innerHTML = "Chart Of Progress";
        dropDownInput.setAttribute("onfocusout", "handleChart(this)");
    }
    else
    {
        title.innerHTML = "Overview";
        dropDownInput.setAttribute("onfocusout", "handleOverviewRows(this)");
    }
}

const handleChart = (input) => {
    while (input.parentElement.nextElementSibling)
        input.parentElement.nextElementSibling.remove();

    setTimeout(() => {
        if (input.value != "")
        {
            getDataOfExercise(input);
            if (exerciseCounter > 0)
                createProgressChart();
            else
                noDataFound();
        }
    }, 200);
}

const handleOverviewRows = (input) => {
    while (input.parentElement.nextElementSibling)
        input.parentElement.nextElementSibling.remove();
    setTimeout(() => {
        if (input.value != "")
        {
            getDataOfExercise(input);
            if (exerciseCounter > 0)
                showDataOfSelectedExercise();
            else
                noDataFound();
        }
    }, 200);
}

const getDataOfExercise = (input) => {
    let sumSets = 0;
    let sumReps = 0;
    exerciseCounter = 0;
    maxWeight = 0;
    averageReps = 0;
    lastExercise = undefined;

    for (let i = 0; i < workoutData.length; i++)
    {
        if (workoutData[i].exercise == input.value)
        {
            if (!lastExercise)
                lastExercise = workoutData[i];
            else
            {
                if (lastExercise.date.year < workoutData[i].date.year)
                    lastExercise = workoutData[i];
                else if (lastExercise.date.year == workoutData[i].date.year &&
                         lastExercise.date.month < workoutData[i].date.month)
                    lastExercise = workoutData[i];
                else if (lastExercise.date.year == workoutData[i].date.year &&
                         lastExercise.date.month == workoutData[i].date.month &&
                         lastExercise.date.day < workoutData[i].date.day)
                    lastExercise = workoutData[i];
            }
            
            exerciseCounter++;

            for (let j = 0; j < workoutData[i].sets.length; j++)
            {
                sumSets++;
                sumReps += workoutData[i].sets[j].reps;
                if (workoutData[i].sets[j].weight > maxWeight)
                    maxWeight = workoutData[i].sets[j].weight;
            }
        }
    }
    averageReps = Math.trunc(sumReps / sumSets);
}

const noDataFound = () => {
    const selectedMenuDiv = document.querySelector(".selected-menu-div");

    let noDataDiv = document.createElement("div");
    noDataDiv.classList.add("no-data-div");
    noDataDiv.style.justifyContent = "center";
    
    let text = document.createElement("span");
    text.classList.add("no-data-span");
    text.style.marginTop = "80px";
    text.innerHTML = "No data for this exercise.";
    noDataDiv.append(text);
    selectedMenuDiv.append(noDataDiv);
    setTimeout(() => noDataDiv.style.opacity = 1, 20);
    setTimeout(() => text.style.opacity = 1, 20);
}

const showDataOfSelectedExercise = () => {
    const selectedMenuDiv = document.querySelector(".selected-menu-div");

    // calculate since how many hours an exercise wasn't practiced
    let hoursSinceLastTime = 0;
    let curDate = new Date();
    hoursSinceLastTime = curDate.getTime() - lastExercise.date.ms;
    hoursSinceLastTime = Math.trunc(hoursSinceLastTime / 3600000);

    for (let i = 0; i < 5; i++)
    {
        let rowDiv = document.createElement("div");
        rowDiv.classList.add("overview-row-div");
        rowDiv.id = "info" + i;
        if (i == 0)
            rowDiv.style.marginTop = "60px";
        
        let text = document.createElement("span");
        let data = document.createElement("span");
        data.classList.add("exercise-data");
        switch (i) {
            case 0:
                text.innerHTML = "Personal record [kg]:";
                data.innerHTML = maxWeight;
                break;
            case 1:
                text.innerHTML = "Average reps:";
                data.innerHTML = averageReps;
                break;
            case 2:
                text.innerHTML = "Times performed:";
                data.innerHTML = exerciseCounter;
                break;
            case 3:
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