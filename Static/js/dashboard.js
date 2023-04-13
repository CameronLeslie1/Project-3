// Get the reference to the dropdown menu
const stateDropdown = d3.select("#stateDropdown");

// Wrap the entire code in a DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", () => {
  // Get the reference to the dropdown menu
  const stateDropdown = d3.select("#stateDropdown");

// Function to update the chart based on the selected state
function updateChart() {
  // Get the currently selected state abbreviation
  const selectedState = stateDropdown.property("value");
  console.log(`Selected state: ${selectedState}`);

  // Get the data for the selected state from the Flask API
  d3.json(`/state_data/${selectedState}`).then(data => {
    console.log("Fetched data:", data);
    // Prepare the data for the line chart
    const chartData = data.map(d => {
      return {
        date: d.date,
        cases: d.cumulative_cases
      };
    });

    // Create the line chart
    const svgWidth = 600;
    const svgHeight = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    // Remove the existing SVG if any
    d3.select("#lineChart").select("svg").remove();

    // Create a new SVG
    const svg = d3.select("#lineChart")
                  .append("svg")
                  .attr("width", svgWidth)
                  .attr("height", svgHeight);

    const g = svg.append("g")
                 .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Set up scales and axes
    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    x.domain(d3.extent(chartData, d => d.date));
    y.domain([0, d3.max(chartData, d => d.cases)]);

    // Create the line
    const line = d3.line()
                   .x(d => x(d.date))
                   .y(d => y(d.cases));

    // Append the line to the chart
    g.append("path")
     .datum(chartData)
     .attr("fill", "none")
     .attr("stroke", "steelblue")
     .attr("stroke-linejoin", "round")
     .attr("stroke-linecap", "round")
     .attr("stroke-width", 1.5)
     .attr("d", line);

    // Append the x-axis
    g.append("g")
     .attr("transform", `translate(0, ${height})`)
     .call(xAxis);

    // Append the y-axis
    g.append("g")
     .call(yAxis);
  });
}

// Add an event listener to the dropdown menu
stateDropdown.on("change", updateChart);

// Initialize the chart with the default state
updateChart();
});