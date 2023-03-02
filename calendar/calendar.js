const calendarDate = document.querySelector(".current-date");
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];
let selectedDate = new Date();

const createCalendar = () => {
    if (document.querySelector(".calendar-div"))
    {
        closeCalendarSmooth();
        return;
    }
    if (contentBack.querySelector("#comment").checked)
        document.querySelector("textarea").style.visibility = "hidden";
    contentBack.style.visibility = "hidden";

    calendarDate.classList.add("active");
    // create calendar parent div
    const calendarDiv = document.createElement("DIV");
    calendarDiv.classList.add("calendar-div");
    calendarDiv.style.width = contentBack.offsetWidth + "px";
    calendarDiv.style.top = calendarDate.getBoundingClientRect().height + 40 + "px";
    
    // create time-selector
    const timeDiv = document.createElement("DIV");
    timeDiv.classList.add("time-picker");
    timeDiv.style.height = calendarDate.offsetHeight + "px";
    
    let minutes = selectedDate.getMinutes();
    let hours = selectedDate.getHours();
    minutes = minutes < 10 ? "0" + minutes : minutes;
    hours = hours < 10 ? "0" + hours : hours;
        
    for (let i = 0; i < 2; i++)
    {
        let input = document.createElement("input");
        if (i == 0)
        {
            input.value = hours;
            input.id = "hours";
        }
        else
        {
            input.value = minutes;
            input.id = "minutes";
        }
        input.classList.add("time-value");
        input.setAttribute("type", "tel");
        input.setAttribute("maxlength", "2");
        input.setAttribute("onfocus", "setLastValue(this), resetInputValue(this)");
        input.setAttribute("onfocusout", "getLastValue(this)");
        input.addEventListener("input", checkIfTime);
        input.addEventListener("change", setTime);
        timeDiv.append(input);
        if (i < 1)
        {
            let span = document.createElement("span");
            span.innerHTML = ":";
            timeDiv.append(span)
        }
    }

    calendarDiv.append(timeDiv);

    // create month-selector
    const calendarMonthDiv = document.createElement("DIV");
    calendarMonthDiv.classList.add("calendar-month");
    calendarMonthDiv.style.height = calendarDate.offsetHeight + "px";
    calendarMonthDiv.innerHTML = "";

    calendarDiv.append(calendarMonthDiv);
    // create buttons to switch the month within the month selector div
    let button = document.createElement("BUTTON");
    button.classList.add("month-button");
    button.id = "prevButton";
    button.addEventListener("click", getPrevMonth);
    
    let icon = document.createElement("I");
    icon.classList.add("fa-solid");
    icon.classList.add("fa-chevron-left");
    button.append(icon);
    calendarMonthDiv.append(button);
    
    let span = document.createElement("SPAN");
    span.innerHTML = months[selectedDate.getMonth()];
    
    calendarMonthDiv.append(span);

    button = document.createElement("BUTTON");
    button.classList.add("month-button");
    button.id = "nextButton";
    button.addEventListener("click", getNextMonth);

    icon = document.createElement("I");
    icon.classList.add("fa-solid");
    icon.classList.add("fa-chevron-right");
    button.append(icon);
    calendarMonthDiv.append(button);

    document.body.append(calendarDiv);
    setTimeout(() => calendarDiv.style.opacity = 1, 30);
    
    // create a div that contains all days of a month
    setCalendarDays();
}

const closeCalendar = ({target}) => {
    let calendar = document.querySelector(".calendar-div") ? document.querySelector(".calendar-div") : undefined;
    if (!calendar || target == calendar || calendar.contains(target) ||
       (target == calendarDate && calendar))
        return;
    calendar.remove();
    calendarDate.classList.remove("active");
    contentBack.style.removeProperty("visibility");
    if (contentBack.querySelector("#comment").checked)
        document.querySelector("textarea").style.removeProperty("visibility");
    if (document.querySelector(".date-control"))
        document.querySelector(".date-control").innerHTML = getWholeDate();
}

const closeCalendarSmooth = () => {
    let calendar = document.querySelector(".calendar-div");
    calendar.style.opacity = 0;
    setTimeout(() => calendar.remove(), 300);
    calendarDate.classList.remove("active");
    contentBack.style.removeProperty("visibility");
    if (contentBack.querySelector("#comment").checked)
        document.querySelector("textarea").style.removeProperty("visibility");
    if (document.querySelector(".date-control"))
        document.querySelector(".date-control").innerHTML = getWholeDate();
}

const selectCalendarDay = ({target}) => {
    document.querySelector(".selected-day").classList.remove("selected-day");
    target.classList.add("selected-day");
    selectedDate.setDate(parseInt(target.innerHTML));
    setDate();
    closeCalendarSmooth();
}

const setDate = () => {
    let year = selectedDate.getFullYear();
    let month = selectedDate.getMonth() + 1;
    let day = selectedDate.getDate();
    let weekday = selectedDate.getDay();

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
    
    calendarDate.innerHTML =  weekday + ", " + day + "." + month + "." + year;
}

const getNextMonth = ({target}) => {
    selectedDate.setMonth(selectedDate.getMonth() + 1);
    document.querySelector(".calendar-month span").innerHTML = months[selectedDate.getMonth()];
    setDate();
    setCalendarDays();
}
const getPrevMonth = ({target}) => {
    selectedDate.setMonth(selectedDate.getMonth() - 1);
    document.querySelector(".calendar-month span").innerHTML = months[selectedDate.getMonth()];
    setDate();
    setCalendarDays();
}
const getCurrentDay = ({target}) => {
    selectedDate = new Date();
    setDate();
    createCalendar();
}

const setCalendarDays = () => {
    let nrDays;
    selectedMonth = selectedDate.getMonth();
    if (selectedMonth == 0 || selectedMonth == 2 || selectedMonth == 4 || selectedMonth == 6 ||
        selectedMonth == 7 || selectedMonth == 9 || selectedMonth == 11)
        nrDays = 31;
    else if (selectedMonth == 1)
    {
        if (selectedDate.getFullYear() % 4 == 0 && selectedDate.getFullYear() % 100 != 0)
            nrDays = 29;
        else
            nrDays = 28;
    }
    else
        nrDays = 30;
    
    const calendarDaysDiv = document.createElement("DIV");
    calendarDaysDiv.classList.add("calendar-days");

    let selectedDay = selectedDate.getDate();
    for (let i = 0; i < 34; i++)
    {
        let calendarDay = document.createElement("DIV");
        calendarDay.classList.add("calendar-day");
        if (i < nrDays)
        {
            if (i+1 < 10)
                calendarDay.innerHTML = "0" + (i+1);
            else
                calendarDay.innerHTML = i+1;
            
            if ((i+1) == selectedDay)
                calendarDay.classList.add("selected-day");

            calendarDay.addEventListener("click", selectCalendarDay);
        }
        if (i == 33)
        {
            calendarDay.classList.add("today");
            calendarDay.innerHTML = "today";
            calendarDay.addEventListener("click", getCurrentDay);
        }
        calendarDaysDiv.append(calendarDay);
    }
    if (document.querySelector(".calendar-days"))
        document.querySelector(".calendar-days").remove();
    let calendarDiv = document.querySelector(".calendar-div");
    calendarDiv.append(calendarDaysDiv);
}

const setTime = ({target}) => {
    if (target.id === "hours")
        selectedDate.setHours(target.value);
    else
        selectedDate.setMinutes(target.value);
}

const getWholeDate = () => {
    let year = selectedDate.getFullYear();
    let month = selectedDate.getMonth() + 1;
    let day = selectedDate.getDate();
    let weekday = selectedDate.getDay();
    let minutes = selectedDate.getMinutes();
    let hours = selectedDate.getHours();
    minutes = minutes < 10 ? "0" + minutes : minutes;
    hours = hours < 10 ? "0" + hours : hours;

    if (month < 10)
        month = "0" + month;
    if (day < 10)
        day = "0" + day;
    switch (weekday) {
        case 0:
            weekday = "Sunday";
            break;
        case 1:
            weekday = "Monday";
            break;
        case 2:
            weekday = "Tuesday";
            break;
        case 3:
            weekday = "Wednesday";
            break;
        case 4:
            weekday = "Thursday";
            break;
        case 5:
            weekday = "Friday";
            break;
        default:
            weekday = "Saturday";
    }

    return weekday + " | " + day + "." + month + "." + year + " | "  + hours + ":" + minutes;
}