const createProgressChart = () => {
    const selectedMenuDiv = document.querySelector(".selected-menu-div");

    let chartCanvas = document.createElement("canvas");
    chartCanvas.id = "progressChart";
    chartCanvas.style.height = "100px";
    chartCanvas.style.width = "100px";
    chartCanvas.style.backgroundColor = "black";
    chartCanvas.style.opacity = 0;
    chartCanvas.style.transition = "opacity 500ms";
    setTimeout(() => chartCanvas.style.opacity = 1, 10);
 
    selectedMenuDiv.insertBefore(chartCanvas, selectedMenuDiv.querySelector(".calendar-month"));

    let xType, yType;
    let chartFilterBtns = document.querySelectorAll(".chart-navbar button");
    chartFilterBtns.forEach(filter => {
        if (filter.classList.contains("active"))
        {
            if (filter.closest(".time-filter-div"))
                xType = filter.value;
            else
                yType = filter.value;
        }
    });

    if (selectedMenuDiv.querySelector(".y-label"))
        selectedMenuDiv.querySelector(".y-label").remove();
    let yLabel = document.createElement("span");
    yLabel.classList.add("y-label");
    yLabel.style.alignSelf = "flex-start";
    yLabel.style.marginTop = "10px";
    yLabel.style.color = "rgb(182, 248, 0)";
    yLabel.style.fontSize = "12px";
    if (yType === "reps")
        yLabel.innerHTML = "reps";
    else
        yLabel.innerHTML = "kg";
    selectedMenuDiv.insertBefore(yLabel, chartCanvas);

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

        for (let i = 0; i < chartArray.length; i++)
        {
            let dateToTime = new Date(chartArray[i].date.ms);
            dateToTime.setDate(1);
            chartArray[i].date.ms = dateToTime.getTime();
        }
    }
    
    let axisData = [];
    let minWeight = 9999;
    let maxWeight = 0;
    let minReps = 9999;
    let maxReps = 0;

    let bgColor = [];
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
        if (chartArray[i].sets[0].reps < minReps)
            minReps = chartArray[i].sets[0].reps;
        if (chartArray[i].sets[0].reps > maxReps)
            maxReps = chartArray[i].sets[0].reps;

        for (let j = 0; j < chartArray[i].sets.length; j++)
        {
            if (chartArray[i].sets[j].weight > maxWeight)
                maxWeight = chartArray[i].sets[j].weight;
        }
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
        let mostWeight = [];
        for (let i = 0; i < chartArray.length; i++)
        {
            let curWeight = 0;
            for (let j = 0; j < chartArray[i].sets.length; j++)
            {
                if (chartArray[i].sets[j].weight > curWeight)
                    curWeight = chartArray[i].sets[j].weight;
            }
            mostWeight.push(curWeight);
        }
        for (let i = 0; i < chartArray.length; i++)
            axisData.push({"x": chartArray[i].date.ms, "y": mostWeight[i]});

        // set minY and maxY
        minY = (minWeight > 6)  ? Math.trunc(minWeight - 6) : 0;
        maxY = Math.trunc(maxWeight + 6);

        // set highlight color on weight or reps raises
        if (!exerciseBeforeMonth)
            bgColor.push('rgb(230, 230, 230)');
        else
        {
            let mostWeightOfBeforeMonth = 0;

            for (let i = 0; i < exerciseBeforeMonth.sets.length; i++)
            {
                if (exerciseBeforeMonth.sets[i].weight > mostWeightOfBeforeMonth)
                    mostWeightOfBeforeMonth = exerciseBeforeMonth.sets[i].weight;
            }

            if (mostWeightOfBeforeMonth < mostWeight[0])
                bgColor.push('rgb(182, 248, 0)');
            else
                bgColor.push('rgb(230, 230, 230)');
        }
        for (let i = 1; i < chartArray.length; i++)
        {
            if (mostWeight[i] > mostWeight[i-1])
                bgColor.push('rgb(182, 248, 0)');
            else
                bgColor.push('rgb(230, 230, 230)');
        }

        // calculate offset if possible
        getMonthSettings();

        // label y axis
        yUnit = " kg";
    }
    else if (xType === "month" && yType === "reps")
    {
        // determine axis data (month/weight)
        for (let i = 0; i < chartArray.length; i++)
            axisData.push({"x": chartArray[i].date.ms, "y": chartArray[i].sets[0].reps});

        // set minY and maxY
        minY = (minReps > 6)  ? Math.trunc(minReps - 6) : 0;
        maxY = Math.trunc(maxReps + 6);

        // set highlight color on weight or reps raises
        if (!exerciseBeforeMonth)
            bgColor.push('rgb(230, 230, 230)');
        else
        {
            if (exerciseBeforeMonth.sets[0].reps < chartArray[0].sets[0].reps)
                bgColor.push('rgb(182, 248, 0)');
            else
                bgColor.push('rgb(230, 230, 230)');
        }
        for (let i = 1; i < chartArray.length; i++)
        {
            if (chartArray[i].sets[0].reps > chartArray[i-1].sets[0].reps)
                bgColor.push('rgb(182, 248, 0)');
            else
                bgColor.push('rgb(230, 230, 230)');
        }

        // calculate offset if possible
        getMonthSettings();

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
        let mostWeight = [];
        for (let i = 0; i < chartArray.length; i++)
        {
            let curWeight = 0;
            for (let j = 0; j < chartArray[i].sets.length; j++)
            {
                if (chartArray[i].sets[j].weight > curWeight)
                    curWeight = chartArray[i].sets[j].weight;
            }
            mostWeight.push(curWeight);
        }
        for (let i = 0; i < chartArray.length; i++)
        {
            let yearData = new Date(chartArray[i].date.year, chartArray[i].date.month-1).getTime();
            axisData.push({"x": yearData, "y": mostWeight[i]});
        }

        // set minY and maxY
        minY = (minWeight > 6)  ? Math.trunc(minWeight - 6) : 0;
        maxY = Math.trunc(maxWeight + 6);

        // set highlight color on weight or reps raises
        if (!exerciseBeforeYear)
            bgColor.push('rgb(230, 230, 230)');
        else
        {
            let mostWeightOfBeforeYear = 0;

            for (let i = 0; i < exerciseBeforeYear.sets.length; i++)
            {
                if (exerciseBeforeYear.sets[i].weight > mostWeightOfBeforeYear)
                    mostWeightOfBeforeYear = exerciseBeforeYear.sets[i].weight;
            }

            if (mostWeightOfBeforeYear < mostWeight[0])
                bgColor.push('rgb(182, 248, 0)');
            else
                bgColor.push('rgb(230, 230, 230)');
        }
        for (let i = 1; i < chartArray.length; i++)
        {
            if (mostWeight[i] > mostWeight[i-1])
                bgColor.push('rgb(182, 248, 0)');
            else
                bgColor.push('rgb(230, 230, 230)');
        }

        // calculate offset if possible
        getYearSettings();

        // label y axis
        yUnit = " kg";
    }
    else if (xType === "year" && yType === "reps")
    {
        // determine axis data (month/reps)
        for (let i = 0; i < chartArray.length; i++)
        {
            let yearData = new Date(chartArray[i].date.year, chartArray[i].date.month-1).getTime();
            axisData.push({"x": yearData, "y": chartArray[i].sets[0].reps});
        }
        
        // set minY and maxY
        minY = (minReps > 6)  ? Math.trunc(minReps - 6) : 0;
        maxY = Math.trunc(maxReps + 6);

        // set highlight color on weight or reps raises
        if (!exerciseBeforeYear)
            bgColor.push('rgb(230, 230, 230)');
        else
        {
            if (exerciseBeforeYear.sets[0].reps < chartArray[0].sets[0].reps)
                bgColor.push('rgb(182, 248, 0)');
            else
                bgColor.push('rgb(230, 230, 230)');
        }
        for (let i = 1; i < chartArray.length; i++)
        {
            if (chartArray[i].sets[0].reps > chartArray[i-1].sets[0].reps)
                bgColor.push('rgb(182, 248, 0)');
            else
                bgColor.push('rgb(230, 230, 230)');
        }

        // calculate offset if possible
        getYearSettings();

        // label y axis
        yUnit = " reps";
    }

    // console.log(chartArray);

    if (userData.chartType === "line")
    {
        bgColor = bgColor.map(c => {
            if (c === 'rgb(230, 230, 230)')
                return 'rgb(0, 0, 0)';
            return c;
        });
    }

    let chart = new Chart(chartCanvas, {
        type: userData.chartType,
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
                        // text: yUnit,
                        display: true,
                        color: "rgb(182, 248, 0)",
                        font: {
                            size: 14,
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
                        font: {
                            size: 14,
                        }
                    },
                },
                x: {
                    title: {
                        // text: xUnit,
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
                        autoSkip: false,
                        maxRotation: 0,
                        minRotation: 0,
                        padding: 4,
                        font: {
                            size: 14,
                        },
                        // callback: (value, index, values) => {
                        //     if (index !== values.length -1)
                        //         return value;
                        // },
                    },
                    // callback: ((value, index, values) => {
                    //     if (index !== values.length -1)
                    //         return value;
                    // })
                },
            },
            layout: {
                padding: {
                    left: -28
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
            let monthIndex = parseInt(title[0].label.substring(3, 5))-1;
            return months[monthIndex] + ", " + selectedDate.getFullYear();
        };
    }

    function getMonthSettings() {
        // determine first and last day of selected month
        let lastDay = new Date(chartArray[0].date.year, chartArray[0].date.month, 0).getDate();
        lastDay = (lastDay < 10) ? "0" + lastDay : lastDay;

        // let offsetDay = parseInt(chartArray[0].date.day) - 1;
        // offsetDay = (offsetDay < 10) ? '0' + offsetDay : offsetDay;

        // if (chartArray[0].date.day > 2)
        //     minX = chartArray[0].date.year + '-' + chartArray[0].date.month + '-' + offsetDay;
        // else
        //     minX = chartArray[0].date.year + '-' + chartArray[0].date.month + '-01';
        // // ------------------------------------------------------------------
        // offsetDay = parseInt(chartArray[chartArray.length-1].date.day) + 1;
        // offsetDay = (offsetDay < 10) ? '0' + offsetDay : offsetDay;

        // if (chartArray[chartArray.length-1].date.day < lastDay-1)
        //     maxX = chartArray[0].date.year + '-' + chartArray[0].date.month + '-' + offsetDay;
        // else
        //     maxX = chartArray[0].date.year + '-' + chartArray[0].date.month + '-' + lastDay;

        minX = chartArray[0].date.year + '-' + chartArray[0].date.month + '-01';
        maxX = chartArray[0].date.year + '-' + chartArray[0].date.month + '-' + lastDay;
        
        // format selection
        formatX = {"day": 'd'};
        timeUnit = "day";
    }
    function getYearSettings() {
        // determine first and last month of selected year
        minX = chartArray[0].date.year + '-01-01';
        maxX = chartArray[0].date.year + '-12-31';
        
        // format selection
        formatX = {'month': 'MMM'};
        timeUnit = "month";
    }
}