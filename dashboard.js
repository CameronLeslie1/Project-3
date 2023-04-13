async function fetchData(date) {
    const response = await fetch(`/api/${date}`);
    const data = await response.json();
    return data;
  }
  function createDropdown(dates) {
    const dropdown = d3.select("#date-dropdown");
  
    dates.forEach((date) => {
      dropdown.append("option").text(date).property("value", date);
    });
  
    dropdown.on("change", updateVisualization);
  }
  async function updateVisualization() {
    const selectedDate = d3.select("#date-dropdown").property("value");
    const data = await fetchData(selectedDate);
  
    // Clear the previous visualization
    d3.select("#visualization").selectAll("*").remove();
  
    // Create the new visualization
    // You can replace this example code with your own visualization logic
    const svg = d3.select("#visualization").append("svg");
  
    // ...
    // Visualization code goes here
    // ...
  }
  async function initDashboard() {
    // Fetch available dates from the API
    const datesResponse = await fetch("/api/dates");
    const dates = await datesResponse.json();
  
    // Create the date dropdown menu
    createDropdown(dates);
  
    // Update the visualization with the default date
    updateVisualization();
  }
  
  initDashboard();
        