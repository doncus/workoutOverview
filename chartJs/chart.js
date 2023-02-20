const createProgressChart = () => {
    const selectedMenuDiv = document.querySelector(".selected-menu-div");

    let chartCanvas = document.createElement("canvas");
    chartCanvas.id = "progressChart";
    chartCanvas.style.height = "50px";
    chartCanvas.style.width = "50px";
    chartCanvas.style.marginTop = "20px";
    chartCanvas.style.backgroundColor = "black";
    selectedMenuDiv.append(chartCanvas);

    let xType, yType;
    let chartFilterBtns = document.querySelectorAll(".chart-top-navbar-div button");
    chartFilterBtns.forEach(filter => {
        if (filter.classList.contains("active"))
        {
            if (filter.closest(".time-filter-div"))
                xType = filter.value;
            else
                yType = filter.value;
        }
    });
    // ---------------------------------------------------- CHART VARIABLES
    let chartArray;
    let firstTime;
    let lastTime;

    if (xType === "month")
    {
        if (!monthOfExercise.length) 
        {
            chartCanvas.remove();
            noDataFound();
            return;
        }
        chartArray = JSON.parse(JSON.stringify(monthOfExercise));
        firstTime = chartArray[0].date.day;
        lastTime = chartArray[chartArray.length-1].date.day;
    }
    else if (xType === "year")
    {
        if (!yearOfExercise.length) 
        {
            chartCanvas.remove();
            noDataFound();
            return;
        }
        chartArray = JSON.parse(JSON.stringify(yearOfExercise));
        firstTime = chartArray[0].date.month-1;
        lastTime = parseInt(chartArray[chartArray.length-1].date.month)-1;
    }
    
    let axisData = [];
    let minWeight = 9999;
    let maxWeight = 0;
    let minReps = 9999;
    let maxReps = 0;

    let bgColor = ['rgb(0, 0, 0)'];
    let formatX, formatY;
    let yUnit;
    let timeUnit;
    let minY, maxY;
    let minX, maxX;
    // ---------------------------------------------------- GENERAL DATA
    
    // calculate min/max weight and reps
    for (let i = 0; i < chartArray.length; i++)
    {
        if (chartArray[i].sets[0].weight < minWeight)
            minWeight = chartArray[i].sets[0].weight;
        if (chartArray[i].sets[0].weight > maxWeight)
            maxWeight = chartArray[i].sets[0].weight;
        if (chartArray[i].sets[0].reps < minReps)
            minReps = chartArray[i].sets[0].reps;
        if (chartArray[i].sets[0].reps > maxReps)
            maxReps = chartArray[i].sets[0].reps;
    }

    // ---------------------------------------------------- SPECIFIC DATA
    if (xType === "month" && yType === "weight")
    {
        // determine axis data (month/weight)
        for (let i = 0; i < chartArray.length; i++)
            axisData.push({"x": chartArray[i].date.ms, "y": chartArray[i].sets[0].weight});

        // set minY and maxY
        minY = minWeight - 6;
        maxY = maxWeight + 6;

        // set highlight color on weight or reps raises
        for (let i = 1; i < chartArray.length; i++)
        {
            if (chartArray[i].sets[0].weight > chartArray[i-1].sets[0].weight)
                bgColor.push('rgb(182, 248, 0)');
            else
                bgColor.push('rgb(0, 0, 0)');
        }

        // calculate offset if possible
        getLimitsForMonth();

        yUnit = " kg";
    }
    else if (xType === "month" && yType === "reps")
    {
        // determine axis data (month/weight)
        for (let i = 0; i < chartArray.length; i++)
            axisData.push({"x": chartArray[i].date.ms, "y": chartArray[i].sets[0].reps});

        // set minY and maxY
        minY = minReps - 6;
        maxY = maxReps + 6;

        // set highlight color on weight or reps raises
        for (let i = 1; i < chartArray.length; i++)
        {
            if (chartArray[i].sets[0].reps > chartArray[i-1].sets[0].reps)
                bgColor.push('rgb(182, 248, 0)');
            else
                bgColor.push('rgb(0, 0, 0)');
        }

        // calculate offset if possible
        getLimitsForMonth();

        yUnit = " reps";
    }
    else if (xType === "year" && yType === "weight")
    {
        // determine axis data (month/weight)
        for (let i = 0; i < chartArray.length; i++)
            axisData.push({"x": chartArray[i].date.ms, "y": chartArray[i].sets[0].weight});

        // set minY and maxY
        minY = minWeight - 6;
        maxY = maxWeight + 6;

        // set highlight color on weight or reps raises
        for (let i = 1; i < chartArray.length; i++)
        {
            if (chartArray[i].sets[0].weight > chartArray[i-1].sets[0].weight)
                bgColor.push('rgb(182, 248, 0)');
            else
                bgColor.push('rgb(0, 0, 0)');
        }

        // calculate offset if possible
        getLimitsForYear();

        yUnit = " kg";
    }
    else if (xType === "year" && yType === "reps")
    {
        // determine axis data (month/reps)
        for (let i = 0; i < chartArray.length; i++)
            axisData.push({"x": chartArray[i].date.ms, "y": chartArray[i].sets[0].reps});
        
        // set minY and maxY
        minY = minReps - 6;
        maxY = maxReps + 6;

        // set highlight color on weight or reps raises
        for (let i = 1; i < chartArray.length; i++)
        {
            if (chartArray[i].sets[0].reps > chartArray[i-1].sets[0].reps)
                bgColor.push('rgb(182, 248, 0)');
            else
                bgColor.push('rgb(0, 0, 0)');
        }

        // calculate offset if possible
        getLimitsForYear();

        yUnit = " reps";
    }

    new Chart(chartCanvas, {
        type: 'line',
        data: {
            datasets: [{
                data: axisData,
                borderColor: 'white',
                backgroundColor: bgColor,
                pointRadius: 6,
            }]
        },
        options: {
            scales: {
                y: {
                    title: {
                        text: yUnit,
                        display: true,
                        color: "rgb(182, 248, 0)",
                        font: {
                            size: 12,
                            family: "Verdana, Geneva, Tahoma, sans-serif",
                            padding: 0,
                        },
                    },
                    grid: {
                        color: 'rgb(60, 60, 60)',
                    },
                    min: minY,
                    max: maxY,
                    color: "white",
                    ticks: {
                        stepSize: 2,
                        color: "hsl(60, 25%, 37%)",
                    },
                },
                x: {
                    grid: {
                        color: 'rgb(60, 60, 60)',
                    },
                    type: "time",
                    time: {
                        displayFormats: formatX,
                        tooltipFormat: 'dd.MM.yyyy',
                        unit: timeUnit,
                    },
                    min: minX,
                    max: maxX,
                    color: "white",
                    ticks: {
                        color: "hsl(60, 25%, 37%)",
                        padding: 6,
                        autoSkip: false,
                        maxRotation: 45,
                        minRotation: 45,
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
                tooltip: {
                    titleFont: {
                        size: 14,
                    },
                    bodyFont: {
                        size: 16,
                    },
                    callbacks: {
                        label: ((tooltipItem) => {
                            // console.log(tooltipItem.chart.data.datasets[0].data);
                            return " " + tooltipItem.chart.data.datasets[0].data[tooltipItem.dataIndex].y + yUnit;
                        })
                    },
                },
                legend: {
                    display: false,
                },
            },
        }
    });

    function getLimitsForMonth() {
        let stringMonth = (selectedDate.getMonth()+1 < 10) ? "0" + (selectedDate.getMonth()+1) : selectedDate.getMonth()+1;
        
        minX = selectedDate.getFullYear() + '-' + stringMonth + '-' + firstTime + ' 00:00:00';
        if (firstTime-2 > 0 && firstTime-2 >= 10)
            minX = selectedDate.getFullYear() + '-' + stringMonth + '-' + (firstTime-2) + ' 23:59:59';
        else if (firstTime-2 > 0 && firstTime-2 < 10) 
            minX = selectedDate.getFullYear() + '-' + stringMonth + '-0' + (firstTime-2) + ' 23:59:59';
        else if (firstTime-1 > 0 && firstTime-1 >= 10)
            minX = selectedDate.getFullYear() + '-' + stringMonth + '-' + (firstTime-1) + ' 23:59:59';
        else if (firstTime-1 > 0 && firstTime-1 < 10) 
            minX = selectedDate.getFullYear() + '-' + stringMonth + '-0' + (firstTime-1) + ' 23:59:59';

        maxX = selectedDate.getFullYear() + '-' + stringMonth + '-' + lastTime + ' 23:59:59';
        if (lastTime+1 < 29 && lastTime+1 >= 10)
            maxX = selectedDate.getFullYear() + '-' + stringMonth + '-' + (lastTime+1) + ' 00:00:00';
        else if (lastTime+1 < 29 && lastTime+1 < 10) 
            maxX = selectedDate.getFullYear() + '-' + stringMonth + '-0' + (lastTime+1) + ' 00:00:00';
        
        // format selection
        formatX = formatX = {"day": 'dd.MM.yy'};
        timeUnit = "day";
    }
    function getLimitsForYear() {
        minX = selectedDate.getFullYear() + '-01-01 00:00:00';
        if (firstTime-2 > 0 && firstTime-2 >= 10) 
            minX = selectedDate.getFullYear() + '-' + (firstTime-2) + '-28 23:59:59';
        else if (firstTime-2 > 0 && firstTime-2 < 10) 
            minX = selectedDate.getFullYear() + '-0' + (firstTime-2) + '-28 23:59:59';
        else if (firstTime-1 > 0 && firstTime-1 >= 10)
            minX = selectedDate.getFullYear() + '-' + (firstTime-1) + '-28 23:59:59';
        else if (firstTime-1 > 0 && firstTime-1 < 10) 
            minX = selectedDate.getFullYear() + '-0' + (firstTime-1) + '28 23:59:59';

        maxX = selectedDate.getFullYear() + '-12-31 23:59:59';
        if (lastTime+2 <= 12 && lastTime+2 >= 10) 
            maxX = selectedDate.getFullYear() + '-' + (lastTime+2) + '-31 23:59:59';
        else if (lastTime+2 <= 12 && lastTime+2 < 10) 
            maxX = selectedDate.getFullYear() + '-0' + (lastTime+2) + '-31 23:59:59';
        else if (lastTime+1 <= 12 && lastTime+1 >= 10)
            maxX = selectedDate.getFullYear() + '-' + (lastTime+1) + '-31 23:59:59';
        else if (lastTime+1 <= 12 && lastTime+1 < 10) 
            maxX = selectedDate.getFullYear() + '-0' + (lastTime+1) + '31 23:59:59';
        
        // format selection
        formatX = {'month': 'MMMM'};
        timeUnit = "month";
    }
}