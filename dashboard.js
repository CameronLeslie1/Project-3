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
  function initDashboard() {
    // Create the date dropdown menu
    createDropdown();
  
    // Update the visualization with the default date
    updateVisualization();
  }
  
  initDashboard();
  
        