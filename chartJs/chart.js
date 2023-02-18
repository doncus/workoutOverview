const createProgressChart = () => {
    const selectedMenuDiv = document.querySelector(".selected-menu-div");

    let chartCanvas = document.createElement("canvas");
    chartCanvas.id = "progressChart";
    chartCanvas.style.height = "50px";
    chartCanvas.style.width = "50px";
    chartCanvas.style.marginTop = "20px";
    chartCanvas.style.backgroundColor = "black";
    selectedMenuDiv.append(chartCanvas);

    const xButton = document.querySelector(".time-filter-div button.active");
    const yButton = document.querySelectorAll(".value-filter-div button.active");
    let xData, yData;
    if (xButton.value === "month")
        xData = yearOfExercise;
    else if (xButton.value === "year")
        xData = monthOfExercise;

    // if (yButton.value === "weight")
    //     yData = 
    // else if (yButton.value === "reps")
    //     yData = 

    let weightArray = [];
    // yearOfExercise.forEach(exercise => weightArray.push(exercise.sets[0].weight))
    yearOfExercise.forEach(exercise => weightArray.push(exercise.sets[0].weight))
    console.log(yearOfExercise)

    new Chart(chartCanvas, {
        type: 'line',
        data: {
            // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: 'Donc',
                data: weightArray,
                borderWidth: 3,
                borderColor: 'white',
            }]
        },
        options: {
            scales: {
                y: {
                    max: weightArray[weightArray.length-1] + 10,
                    min: weightArray[0] - 10,
                    color: "white",
                    ticks: {
                        stepSize: 2,
                        padding: 6,
                        color: "hsl(60, 25%, 37%)",
                    },
                },
                x: {
                    type: "time",
                    time: {
                        unit: "month",
                    },
                    color: "white",
                    ticks: {
                        color: "hsl(60, 25%, 37%)",
                        padding: 6,
                        // font: {
                        //     size: 15,
                        //     weight: 'bold',
                        // }
                    },
                    // callback: ((value, index, values) => {
                    //     if (index !== values.length -1)
                    //         return value;
                    // })
                },
            },
            plugins: {
                legend: {
                    display: false,
                },
            },
        }
    });
}