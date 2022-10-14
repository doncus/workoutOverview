window.onload = () => {
    const contentFront = document.querySelector(".content-front");
    const contentBack = document.querySelector(".content-back");
    const backTop = document.querySelector(".back-top");
    const title = document.querySelector(".title");
    
    const addSessionButton = contentFront.querySelector(".add-session-button");
    const backButton = document.querySelector(".back-button");
    title.style.transform = "translateX(" + 0 + ")";
    setTimeout(() => {
        contentFront.style.opacity = 1;
        setTimeout(() => {
            addSessionButton.addEventListener("click", () => {
                addSessionButton.style.width = 70 + "%";
                contentFront.style.opacity = 0;
                contentBack.style.display = "flex";
                setTimeout(() => {
                    title.style.transform = "translateX(" + 120 + "%)";
                    backTop.style.display = "flex";
                    setTimeout(() => {
                        title.style.display = "none";
                        contentFront.style.display = "none"; //reset when shown again
                        backTop.style.opacity = 1;
                        contentBack.style.opacity = 1;
                        setDate();
                        setTimeout(() => backButton.addEventListener("click", goBack), 600);
                    }, 600);
                }, 800);
            });
        }, 400);
    }, 800);
};

function goBack()
{
    const contentFront = document.querySelector(".content-front");
    const contentBack = document.querySelector(".content-back");
    const backTop = document.querySelector(".back-top");
    const title = document.querySelector(".title");
    const addSessionButton = contentFront.querySelector(".add-session-button");
    
    contentBack.style.opacity = 0;
    backTop.style.transform = "translateX(" + (-120) + "%)";
    setTimeout(() => {
        contentBack.style.display = "none";
        backTop.style.transform = "translateX(" + 0 + ")";
        title.style.display = "block";
        contentFront.style.display = "flex";
        addSessionButton.style.width = 100 + "%";
        setTimeout(() => {
            backTop.style.display = "none";
            title.style.transform = "translateX(" + 0 + ")";
            setTimeout(() => {
                contentFront.style.opacity = 1;
                backTop.style.opacity = 0;
            }, 600);
            
        }, 50);
    }, 800)
}

async function saveButton() {
    const fileHandle = await window.showSaveFilePicker();
    const fileStream = await fileHandle.createWritable();
    await fileStream.write(new Blob(["CONTENT"], {type: "text/plain"}));
    await fileStream.close();

    

    goBack();

    /* Daten sicherung
    fetch('./data.json')
    .then((response) => response.json())
    .then((json) => console.log(JSON.parse(json)));
    */

    setTimeout(() => {
        const contentBack = document.querySelector(".content-back");
        contentBack.querySelectorAll(".set-parent").forEach(element => element.remove());
        contentBack.querySelector(".save-button").remove();
        contentBack.querySelectorAll("input").forEach(input => input.value = "");
    }, 800);
    
    // neuer Eintrag auf Front
}

function inputClicked(input) {
    const inputLabel = input.parentElement.querySelector("p");
    inputLabel.style.fontWeight = "bold";
    inputLabel.style.color = "rgb(182, 248, 0)";
}

function inputLeft(input) {
    const inputLabel = input.parentElement.querySelector("p");
    inputLabel.style.fontWeight = "normal";
    inputLabel.style.color = "rgb(230, 230, 230)";
}

function setDate() {
    const date = new Date();
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let weekday = date.getDay();
    if (month < 10)
        month = "0" + month;
    if (day < 10)
        day = "0" + day;
    
    switch (weekday) {
        case 0:
            weekday = "Sun";
            break;
        case 1:
            weekday = "Mon";
            break;
        case 2:
            weekday = "Tue";
            break;
        case 3:
            weekday = "Wed";
            break;
        case 4:
            weekday = "Thu";
            break;
        case 5:
            weekday = "Fri";
            break;
        default:
            weekday = "Sat";
    }

    const dateDiv = document.querySelector(".current-date");
    
    dateDiv.innerHTML = weekday + ", " + day + "." + month + "." + year;
    dateDiv.style.userSelect =  "none";
}

function markChecked(checkbox)
{
    const check = document.querySelector(".body-weight i");
    if (checkbox.checked)
    {
        check.style.color = "rgb(182, 248, 0)";
        check.style.fontSize = "30px";
    }
    else
    {
        check.style.color = "rgb(230, 230, 230)";
        check.style.fontSize = "20px";
    }
    initSets(document.querySelector(".select-sets input"));
}

function initSets(inputSet) {
    if (isNaN(inputSet.value))
        return;
    let nrSets = parseInt(inputSet.value)
    if (nrSets > 20 || nrSets < 0)
        return;

    const contentBack = document.querySelector(".content-back");
    if (contentBack.querySelector(".set-parent"))
    {
        contentBack.querySelectorAll(".set-parent").forEach(element => element.remove());
        contentBack.querySelector(".save-button").remove();
    }

    for (let i = 1; i < nrSets + 1; i++)
    {
        const setParentDiv = document.createElement("div");
        setParentDiv.classList.add("set-parent");
        setParentDiv.setAttribute("id", "set" + i);

        document.querySelector(".content-back").append(setParentDiv);

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

            input = document.createElement("input");
            input.setAttribute("type", "text");
            input.setAttribute("onfocus", "inputClicked(this)");
            input.setAttribute("onfocusout", "inputLeft(this)");
            div.append(input);
        }

        let div = document.createElement("div");
        div.classList.add("select-reps");
        setParentDiv.append(div);

        p = document.createElement("p");
        p.innerHTML = "REPS";
        div.append(p);

        input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("onfocus", "inputClicked(this)");
        input.setAttribute("onfocusout", "inputLeft(this)");
        div.append(input);
    }

    if (inputSet.value != "" && nrSets != 0)
    {
        let button = document.createElement("button");
        button.classList.add("save-button");
        button.innerHTML = "SAVE";
        button.addEventListener("click", e => {
            e.target.style.width = 40 + "%";
            e.target.style.opacity = 0;
            setTimeout(saveButton, 600);
        });
        contentBack.append(button);
    }
}