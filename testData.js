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

    if (!workoutData.length || workoutData.length > 4) return;

    workoutData = [{ "date": { "weekday": "Wednesday", "day": 15, "monthName": "February", "month": "02", "year": 2023, "time": "11:36", "ms": 1676457404377 }, "exercise": "Rows", "weightAdded": true, "sets": [{ "weight": 46, "reps": 12 }, { "weight": 46, "reps": 12 }, { "weight": 46, "reps": 12 }, { "weight": 46, "reps": 10 }] }, { "date": { "weekday": "Friday", "day": 17, "monthName": "February", "month": "02", "year": 2023, "time": "11:36", "ms": 1676630204377 }, "exercise": "Rows", "weightAdded": true, "sets": [{ "weight": 50, "reps": 12 }, { "weight": 50, "reps": 12 }, { "weight": 50, "reps": 12 }, { "weight": 50, "reps": 10 }] }, { "date": { "weekday": "Thursday", "day": 16, "monthName": "February", "month": "02", "year": 2023, "time": "12:36", "ms": 1676547404377 }, "exercise": "Rows", "weightAdded": true, "sets": [{ "weight": 50, "reps": 12 }, { "weight": 50, "reps": 12 }, { "weight": 50, "reps": 12 }, { "weight": 50, "reps": 10 }] }, { "date": { "weekday": "Saturday", "day": 16, "monthName": "October", "month": 10, "year": 2021, "time": "12:36", "ms": 1634380604377 }, "exercise": "Air-squats", "weightAdded": false, "sets": [{ "reps": 20 }, { "reps": 20 }] }, { "date": { "weekday": "Friday", "day": 19, "monthName": "November", "month": 11, "year": 2021, "time": "12:36", "ms": 1637321804377 }, "exercise": "Air-squats", "weightAdded": false, "sets": [{ "reps": 20 }, { "reps": 20 }] }]
}