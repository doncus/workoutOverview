const showExercises = (input, name) => {
    closeAllLists();

    const autocompleteList = document.createElement("div");
    autocompleteList.classList.add("autocomplete-list");
    autocompleteList.style.width = input.getBoundingClientRect().width + "px";
    autocompleteList.style.top = input.getBoundingClientRect().top + input.offsetHeight + "px";
    autocompleteList.style.position = "absolute";

    input.parentElement.appendChild(autocompleteList);
    input.classList.add("drop-down-input");
    
    input.value = input.value.replace(/[^a-zA-Z -]/g, '');
    regExValue = input.value.replace(/[-\s]/g, '').toLowerCase();
    let dropDownArray = [...userData.exercises];
    // first: list all elements that starts with the users input
    for (let i = 0; i < dropDownArray.length; i++)
    {
        regExExercise = dropDownArray[i].replace('-', '').toLowerCase();
        
        // if (autocompleteList.childElementCount > 5) break;
        if (regExExercise.startsWith(regExValue))
        {
            const suggestion = document.createElement("div");
            suggestion.innerHTML = dropDownArray[i];
            suggestion.addEventListener("click", () => {
                input.value = suggestion.innerText;
                closeAllLists();
            });
            addOnClick(name, suggestion);
            
            autocompleteList.appendChild(suggestion);
            dropDownArray.splice(i, 1);
        }
    }
    // second: list all further elements that contain the users input
    for (let i = 0; i < dropDownArray.length; i++)
    {
        regExExercise = dropDownArray[i].replace('-', '').toLowerCase();
        
        // if (autocompleteList.childElementCount > 5) break;
        if (regExExercise.includes(regExValue))
        {
            const suggestion = document.createElement("div");
            suggestion.innerHTML = dropDownArray[i];
            suggestion.addEventListener("click", () => {
                input.value = suggestion.innerText;
                closeAllLists();
            });
            addOnClick(name, suggestion);

            autocompleteList.appendChild(suggestion);
        }
    }
    if (!autocompleteList.querySelector("div"))
        closeAllLists();
}

const addOnClick = (functionName, functionHolder) => {
    switch (functionName) {
        case "session":
            functionHolder.setAttribute("onclick", "getLastSessionData(this.innerText)");
            break;
        case "chart":
            functionHolder.setAttribute("onclick", "createChartNav()");
            functionHolder.setAttribute("onclick", "handleChart(this.innerText)");
            break;
        case "overview":
            functionHolder.setAttribute("onclick", "getLastSessionData(this.innerText)");
            functionHolder.setAttribute("onclick", "handleOverviewRows(this.innerText)");
            break;
    }
}

const closeAllLists = (e) => {
    if (e && e.target == document.querySelector('.drop-down-input')) return;
    if (document.querySelector('.autocomplete-list'))
    {
        document.querySelector('.autocomplete-list').remove();
        const dropDownInput = document.querySelector(".drop-down-input");
        dropDownInput.classList.remove("drop-down-input");
    }
}