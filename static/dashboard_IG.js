// Define the endpoint for fetching the data
const dataUrl = '/dataIG';

// Define the margins, width, and height of the chart
const margin = { top: 10, right: 30, bottom: 30, left: 60 };
const width = 1500 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Define the SVG element to which we will append the chart
const svg = d3.select("#casesChartIG")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Define the initial value of the selected option
let selectedOption = "death";

// Fetch the data from the Flask endpoint
d3.json(dataUrl).then(function(data) {
  console.log(data); // Log the data to the console to check if it was loaded correctly

  data.forEach(d => {
    d.date = new Date(d.date);
  });  

    // Reverse the order of the data
    data = data.reverse();

// Define the x scale
const x = d3.scaleBand()
  .domain(data.map(d => d.date))
  .range([0, width])
  .padding(0.2);


  // Define the y scale
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d[selectedOption])])
    .range([height, 0]);

  

// Define the x axis and append it to the SVG element
const xAxis = d3.axisBottom(x)
  .tickValues(data.map(d => d.date).filter((d, i, dates) => {
    if (i === 0) return true; // always show the first tick
    const quarter = Math.floor(d.getMonth() / 3) + 1; // get the quarter (1-4) of the current date
    const prevQuarter = Math.floor(new Date(dates[i-1]).getMonth() / 3) + 1; // get the quarter (1-4) of the previous date
    return quarter !== prevQuarter; // show tick only if quarter has changed from previous date
  }));
  
svg.append("g")
  .attr("transform", `translate(0,${height})`)
  .call(xAxis.tickFormat(d3.timeFormat("%Y Q%q")));

  // Define the y axis and append it to the SVG element
  const yAxis = d3.axisLeft(y);
  svg.append("g")
    .call(yAxis);
    

  // Append the bars to the SVG element
  svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", d => x(d.date))
    .attr("y", d => y(d[selectedOption]))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d[selectedOption]));

  // Handle the dropdown change event
  d3.select("#GeneralStatus")
    .on("change", function() {
      selectedOption = d3.select(this).property("value");
      updateChart(data, selectedOption);
    }); 

}).catch(function(error) {
  console.log(error); // Log any errors to the console
});

// Define the updateChart function
function updateChart(data, selectedOption) {

    // Define the y scale with the new selected option
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[selectedOption])])
      .range([height, 0]);
  
    // Select all the bars and bind the data
    const bars = svg.selectAll("rect")
      .data(data);
  
    // Update the bars with the new data
    bars.attr("y", d => y(d[selectedOption]))
      .attr("height", d => height - y(d[selectedOption]));
  
    // Update the y axis
    const yAxis = d3.axisLeft(y);
    svg.select(".y-axis")
      .transition()
      .duration(1000)
      .call(yAxis);

      svg.selectAll("rect")
     .attr("fill", "red");  
  }