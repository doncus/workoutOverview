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

    switch(clickedButton.className) {
        case "overview-button active":
            openOverviewMenu();
            break;
        case "monthly-sessions-button active":
            generatePrevSessionData();
            break;
        case "add-session-button active":
            addSessionButtonFunction();
            break;
        default:
            // openOverviewMenu();
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

const openOverviewMenu = () => {
    if (workoutData == undefined || !workoutData.length) return;
    const selectedMenuDiv = document.querySelector(".selected-menu-div");
    selectedMenuDiv.innerHTML = "";

    const title = document.createElement("p");
    title.innerHTML = "Overview:";
    title.classList.add("title");
    selectedMenuDiv.append(title);
    
    const backgroundDiv = document.createElement("div");
    backgroundDiv.classList.add("overview-div");

    let text = document.createElement("p");
    text.innerHTML = "SELECT EXERCISE";
    
    backgroundDiv.append(text);

    const dropDownInput = document.createElement("input");
    dropDownInput.style.width = 80 + "%";
    dropDownInput.setAttribute("type", "text");
    dropDownInput.setAttribute("onfocus", "resetInputValue(this); showExercises(this)");
    dropDownInput.setAttribute("oninput", "showExercises(this)");
    dropDownInput.setAttribute("onfocusout", "handleOverviewRows(this)");
    dropDownInput.setAttribute("autocomplete", "off");

    backgroundDiv.append(dropDownInput);

    selectedMenuDiv.append(backgroundDiv);
}

const resetInputValue = (input) => {
    input.value = "";
}

const handleOverviewRows = (input) => {
    const overViewDiv = document.querySelectorAll(".overview-row-div");
    if (overViewDiv)
    {
        overViewDiv.forEach(div => div.remove())
    }
    setTimeout(() => showDataOfSelectedExercise(input), 200);
}

const showDataOfSelectedExercise = (input) => {
    const selectedMenuDiv = document.querySelector(".selected-menu-div");
    
    if (input.value == "") return;

    let exerciseCounter = 0;
    let maxWeight = 0;
    let sumSets = 0;
    let sumReps = 0;
    let lastExercise;

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

            if (exerciseCounter == 1)
            {
                lastTime = workoutData[i].date.day + "." + workoutData[i].date.month + "."
                workoutData[i].date.month
            }
            for (let j = 0; j < workoutData[i].sets.length; j++)
            {
                sumSets++;
                sumReps += workoutData[i].sets[j].reps;
                if (workoutData[i].sets[j].weight > maxWeight)
                    maxWeight = workoutData[i].sets[j].weight;
            }

        }
    }
    if (exerciseCounter == 0)
    {
        let rowDiv = document.createElement("div");
        rowDiv.classList.add("overview-row-div");
        rowDiv.style.justifyContent = "center";
        
        let text = document.createElement("span");
        text.style.marginTop = "80px";
        text.innerHTML = "No data for this exercise.";
        rowDiv.append(text);
        selectedMenuDiv.append(rowDiv);
        setTimeout(() => rowDiv.style.opacity = 1, 20);
        return;
    }

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
            rowDiv.style.marginTop = "80px";
        
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
                data.innerHTML = Math.trunc(sumReps / sumSets);
                break;
            case 2:
                text.innerHTML = "Times performed:";
                data.innerHTML = exerciseCounter;
                break;
            case 3:
                text.innerHTML = "Last time:";
                if (lastExercise) 
                {
                    data.innerHTML = lastExercise.date.day + "." + lastExercise.date.month + 
                        "." + lastExercise.date.year;
                }
                else
                    data.innerHTML = "never";
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