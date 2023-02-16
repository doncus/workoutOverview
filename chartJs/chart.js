const createProgressChart = () => {
    const selectedMenuDiv = document.querySelector(".selected-menu-div");

    let chartCanvas = document.createElement("canvas");
    chartCanvas.id = "progressChart";
    chartCanvas.style.height = "50px";
    chartCanvas.style.width = "50px";
    chartCanvas.style.marginTop = "20px";
    chartCanvas.style.backgroundColor = "black";
    selectedMenuDiv.append(chartCanvas);

    new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],   // Übung 
            datasets: [{
                label: 'Donc',
                data: [12, 19, 3, 5, 2, 3],                                     // Gewicht
                borderWidth: 3,
                borderColor: 'white',
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    color: "white",
                    ticks: {
                        color: "hsl(60, 25%, 37%)"

                    }
                },
                x: {
                    color: "white",
                    ticks: {
                        color: "hsl(60, 25%, 37%)"
                    }
                },
            }
        }
    });
}