const showExercises = (input) => {
    closeAllLists();

    const autocompleteList = document.createElement("div");
    autocompleteList.classList.add("autocomplete-list");
    autocompleteList.style.width = input.getBoundingClientRect().width + "px";
    autocompleteList.style.top = input.getBoundingClientRect().top + input.offsetHeight + "px";

    input.parentElement.appendChild(autocompleteList);

    if (input.value == "")
        closeAllLists();
    else
    {
        const dropDownInput = document.querySelector(".select-exercise input");
        dropDownInput.classList.add("drop-down-input");
    }
    regExValue = input.value.replace(/[-\s]/g, '');
    
    

    for (let i = 0; i < exercises.length; i++)
    {
        regExExercise = exercises[i].replace('-', '');
        
        if (regExExercise.toUpperCase().includes(regExValue.toUpperCase()))
        {
            const suggestion = document.createElement("div");

            suggestion.innerHTML = exercises[i];
            
            suggestion.addEventListener("click", () => {
                input.value = suggestion.innerText;
                closeAllLists();
            });
            autocompleteList.appendChild(suggestion);
        }
    }
    if (!autocompleteList.querySelector("div"))
        closeAllLists();
}

const closeAllLists = e => {
    if (e)
        if (e.target == document.querySelector('.select-exercise input')) return;
    if (document.querySelector('.autocomplete-list'))
    {
        const dropDownInput = document.querySelector(".select-exercise input");
        dropDownInput.classList.remove("drop-down-input");
        document.querySelector('.autocomplete-list').remove();
    }
}