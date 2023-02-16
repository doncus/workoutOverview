const addTestData = () => {
    // let clone1, clone2, clone3;
    // clone1 = JSON.parse(JSON.stringify(workoutData[0]));
    // clone2 = JSON.parse(JSON.stringify(workoutData[0]));
    // clone3 = JSON.parse(JSON.stringify(workoutData[0]));
    // clone1.date.month = 1;
    // clone1.date.year = 2023
    // clone1.date.monthName = "January";
    // workoutData.push(clone1);
    // clone2.date.month = 2;
    // clone2.date.year = 2023
    // clone2.date.monthName = "February";
    // workoutData.push(clone2);
    // clone3.date.month = 3;
    // clone3.date.year = 2024
    // clone3.date.monthName = "March";
    // workoutData.push(clone3);

    if (!workoutData.length || workoutData.length > 6) return;

    let clone1, clone2, clone3, clone4, clone5, clone6;
    clone1 = JSON.parse(JSON.stringify(workoutData[0]));
    clone2 = JSON.parse(JSON.stringify(workoutData[0]));
    clone3 = JSON.parse(JSON.stringify(workoutData[0]));
    clone4 = JSON.parse(JSON.stringify(workoutData[0]));
    clone5 = JSON.parse(JSON.stringify(workoutData[0]));
    clone6 = JSON.parse(JSON.stringify(workoutData[0]));
    clone1.date.weekday = "Monday"
    clone1.date.time = "06:23"
    clone1.date.day = 23;
    clone1.date.month = 10;
    clone1.date.year = 2022;
    clone1.date.monthName = "October";
    workoutData.push(clone1);
    clone2.date.weekday = "Wednesday"
    clone2.date.time = "15:01"
    clone2.date.day = 19;
    clone2.date.month = 10;
    clone2.date.year = 2022;
    clone2.date.monthName = "October";
    // workoutData.push(clone2);
    // clone3.date.month = 10;
    // clone3.date.year = 2024;
    // clone3.date.monthName = "October";
    // workoutData.push(clone3);
    clone4.date.month = 12;
    clone4.date.year = 2022;
    clone4.date.monthName = "December";
    workoutData.push(clone4);
    clone5.date.weekday = "Saturday"
    clone5.date.time = "15:00"
    clone5.date.day = 22;
    clone5.date.month = 10;
    clone5.date.year = 2022
    clone5.date.monthName = "October";
    workoutData.push(clone5);
    clone6.date.weekday = "Saturday"
    clone6.date.time = "16:12"
    clone6.date.day = 22;
    clone6.date.month = 10;
    clone6.date.year = 2022
    clone6.date.monthName = "October";
    workoutData.push(clone6);
}