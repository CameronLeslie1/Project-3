async function fetchData(date) {
    const response = await fetch(`/api/${date}`);
    const data = await response.json();
    return data;
  }
  function createDropdown() {
    const dropdown = d3.select("#date-dropdown");
  
    for (let date = 1; date <= 420; date++) {
      dropdown.append("option").text(date).property("value", date);
    }
  
    dropdown.on("change", updateVisualization);
  }
  
  // Update the updateVisualization function
function updateVisualization() {
    const selectedDate = d3.select("#date-dropdown").property("value");
    Top10StateCases(selectedDate);
  }
  
  // Create the Top10StateCases function
  async function Top10StateCases(date) {
    // Fetch the data for the selected date
    const response = await fetch(`/api/date/${date}`);
    const data = await response.json();
  
    // Sort the data by the number of cases
    data.sort((a, b) => b.cases - a.cases);
  
    // Take the top 10 states
    const top10States = data.slice(0, 10);
  
    // Display the horizontal bar chart
    displayBarChart(top10States);
  }
  
  // Create the displayBarChart function
  function displayBarChart(data) {
    const margin = { top: 20, right: 30, bottom: 40, left: 150 };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
  
    // Remove the existing chart if any
    d3.select("#bar-chart").remove();
  
    // Create the SVG element
    const svg = d3.select("#visualization")
      .append("svg")
      .attr("id", "bar-chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
    // Set the scales
    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleBand().range([height, 0]).padding(0.1);
  
    x.domain([0, d3.max(data, d => d.cases)]);
    y.domain(data.map(d => d.state));
  
    // Add the bars
    svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("height", y.bandwidth())
      .attr("y", d => y(d.state))
      .attr("width", d => x(d.cases));
  
    // Add the x-axis
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));
  
    // Add the y-axis
    svg.append("g")
      .call(d3.axisLeft(y));
  }
  
  // Initialize the dashboard
  initDashboard();
  
  function initDashboard() {
    // Create the date dropdown menu
    createDropdown();
  
    // Update the visualization with the default date
    updateVisualization();
  }
  
  initDashboard();
  
        