const createProgressChart = () => {
    const selectedMenuDiv = document.querySelector(".selected-menu-div");

    let chartCanvas = document.createElement("canvas");
    chartCanvas.id = "progressChart";
    chartCanvas.style.height = "100px";
    chartCanvas.style.width = "100px";
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
    let hasWeight = false;

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

        for (let i = 0; i < chartArray.length; i++)
        {
            let dateToTime = new Date(chartArray[i].date.ms);
            dateToTime.setHours(0);
            chartArray[i].date.ms = dateToTime.getTime();
        }
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

    let bgColor = ['rgb(230, 230, 230)'];
    let formatX, formatY;
    let xUnit, yUnit;
    let timeUnit;
    let minY, maxY;
    let minX, maxX;
    // ---------------------------------------------------- GENERAL DATA
    
    // calculate min/max weight and reps
    for (let i = 0; i < chartArray.length; i++)
    {
        if (chartArray[i].weightAdded)
            hasWeight = true;
        if (chartArray[i].sets[0].weight < minWeight)
            minWeight = chartArray[i].sets[0].weight;
        if (chartArray[i].sets[0].weight > maxWeight)
            maxWeight = chartArray[i].sets[0].weight;
        if (chartArray[i].sets[0].reps < minReps)
            minReps = chartArray[i].sets[0].reps;
        if (chartArray[i].sets[0].reps > maxReps)
            maxReps = chartArray[i].sets[0].reps;
    }

    // label x axis
    xUnit = selectedDate.getFullYear();

    // ---------------------------------------------------- SPECIFIC DATA
    if (xType === "month" && yType === "weight")
    {
        if (!hasWeight) 
        {
            chartCanvas.remove();
            noDataFound();
            return;
        }
        
        // determine axis data (month/weight)
        for (let i = 0; i < chartArray.length; i++)
            axisData.push({"x": chartArray[i].date.ms, "y": chartArray[i].sets[0].weight});

        // set minY and maxY
        minY = Math.trunc(minWeight - 6);
        maxY = Math.trunc(maxWeight + 6);

        // set highlight color on weight or reps raises
        for (let i = 1; i < chartArray.length; i++)
        {
            if (chartArray[i].sets[0].weight > chartArray[i-1].sets[0].weight)
                bgColor.push('rgb(182, 248, 0)');
            else
                bgColor.push('rgb(230, 230, 230)');
        }

        // calculate offset if possible
        getLimitsForMonth();

        // label y axis
        yUnit = " kg";
    }
    else if (xType === "month" && yType === "reps")
    {
        // determine axis data (month/weight)
        for (let i = 0; i < chartArray.length; i++)
            axisData.push({"x": chartArray[i].date.ms, "y": chartArray[i].sets[0].reps});

        // set minY and maxY
        minY = Math.trunc(minReps - 6);
        maxY = Math.trunc(maxReps + 6);

        // set highlight color on weight or reps raises
        for (let i = 1; i < chartArray.length; i++)
        {
            if (chartArray[i].sets[0].reps > chartArray[i-1].sets[0].reps)
                bgColor.push('rgb(182, 248, 0)');
            else
                bgColor.push('rgb(230, 230, 230)');
        }

        // calculate offset if possible
        getLimitsForMonth();

        // label y axis
        yUnit = " reps";
    }
    else if (xType === "year" && yType === "weight")
    {
        if (!hasWeight) 
        {
            chartCanvas.remove();
            noDataFound();
            return;
        }
        
        // determine axis data (month/weight)
        for (let i = 0; i < chartArray.length; i++)
        {
            let yearData = new Date(chartArray[i].date.year, chartArray[i].date.month).getTime();
            axisData.push({"x": yearData, "y": chartArray[i].sets[0].weight});
        }

        // set minY and maxY
        minY = Math.trunc(minWeight - 6);
        maxY = Math.trunc(maxWeight + 6);

        // set highlight color on weight or reps raises
        for (let i = 1; i < chartArray.length; i++)
        {
            if (chartArray[i].sets[0].weight > chartArray[i-1].sets[0].weight)
                bgColor.push('rgb(182, 248, 0)');
            else
                bgColor.push('rgb(230, 230, 230)');
        }

        // calculate offset if possible
        getLimitsForYear();

        // label y axis
        yUnit = " kg";
    }
    else if (xType === "year" && yType === "reps")
    {
        // determine axis data (month/reps)
        for (let i = 0; i < chartArray.length; i++)
        {
            let yearData = new Date(chartArray[i].date.year, chartArray[i].date.month).getTime();
            axisData.push({"x": yearData, "y": chartArray[i].sets[0].reps});
        }
        
        // set minY and maxY
        minY = Math.trunc(minReps - 6);
        maxY = Math.trunc(maxReps + 6);

        // set highlight color on weight or reps raises
        for (let i = 1; i < chartArray.length; i++)
        {
            if (chartArray[i].sets[0].reps > chartArray[i-1].sets[0].reps)
                bgColor.push('rgb(182, 248, 0)');
            else
                bgColor.push('rgb(230, 230, 230)');
        }

        // calculate offset if possible
        getLimitsForYear();

        // label y axis
        yUnit = " reps";
    }

    console.log(chartArray);

    let chart = new Chart(chartCanvas, {
        type: 'bar',
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
                    beginAtZero: true,
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
                    title: {
                        text: xUnit,
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
                    type: "time",
                    time: {
                        displayFormats: formatX,
                        tooltipFormat: 'dd.MM.yyyy',
                        unit: timeUnit,
                        stepSize: 1,
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
                        font: {
                            size: 14,
                        }
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
            layout: {
                padding: {
                    right: 40
                }
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
                            if (bgColor[tooltipItem.dataIndex] == "rgb(182, 248, 0)")
                                return " PR:  " + tooltipItem.chart.data.datasets[0].data[tooltipItem.dataIndex].y + yUnit;
                            else
                                return "    " + tooltipItem.chart.data.datasets[0].data[tooltipItem.dataIndex].y + yUnit;
                        }),
                    },
                },
                legend: {
                    display: false,
                },
            },
        }
    });

    if (timeUnit === "month")
    {
        chart.options.plugins.tooltip.callbacks.title = (title) => {
            return months[parseInt(title[0].label.substring(3, 5))-1] + ", " + selectedDate.getFullYear();
        };
    }

    
    function getLimitsForMonth() {
        // determine first and last day of selected month
        let lastDay = new Date(chartArray[0].date.year, chartArray[0].date.month, 0).getDate();
        lastDay = (lastDay < 10) ? "0" + lastDay : lastDay;

        minX = chartArray[0].date.year + '-' + chartArray[0].date.month + '-01';
        maxX = chartArray[0].date.year + '-' + chartArray[0].date.month + '-' + lastDay;

        // format selection
        formatX = {"day": 'dd.MM.'};
        timeUnit = "day";
    }
    function getLimitsForYear() {
        // determine first and last month of selected year
        minX = chartArray[0].date.year + '-01-01';
        maxX = chartArray[0].date.year + '-12-31';
        
        // format selection
        formatX = {'month': 'MMMM'};
        timeUnit = "month";
    }
}