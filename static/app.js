const stateDropdownJS = d3.select("#stateDropdownJS");
document.addEventListener("DOMContentLoaded", () => {
  const stateDropdownJS = d3.select("#stateDropdownJS");

  function updateChart() {
    const state = stateDropdownJS.property("value");
    console.log("Selected State:", state);

    function createChart(data) {
      // Set up the chart data and options
      const chartData = {
        labels: data.labels,
        datasets: [
          {
            label: "US Vaccination Data",
            data: data.values,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
        ],
      };

      const chartOptions = {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
        },
      };
      // Create the chart using Chart.js
      const ctx = document.getElementById("myChart").getContext("2d");
      var chartInstance = Chart.getChart("myChart");
      // If chart instance exists, destroy it
      if (chartInstance) {
        chartInstance.destroy();
      }
    //   // Get the chart canvas element
    //   var chartCanvas = document.getElementById("myChart");

    //   // Remove the canvas element from the DOM
    //   if (chartCanvas) {
    //     chartCanvas.remove();
    //   }
      const myChart = new Chart(ctx, {
        type: "line",
        data: chartData,
        options: chartOptions,
      });
    }
    function get_state_dataJS(state) {
      fetch(`/dataJS/${state}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched data:", data);
          d3.select("#myChart").select("svg").remove();
          createChart(data);
        });
    }

    get_state_dataJS(state);
  }

  stateDropdownJS.on("change", updateChart);
  updateChart();
});