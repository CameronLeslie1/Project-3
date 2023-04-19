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
    d3.json(`/data/${selectedState}`).then(data => {
      console.log("Fetched data:", data);
      // Prepare the data for the line chart
      const chartData = data.map(d => {
        return {
          date: d.date,
          cases: d.cases,
          hospitalizations: d.hospitalizations,
          deaths: d.deaths
        };
      });

      // Create the cases line chart
      const casesSvgWidth = 600;
      const casesSvgHeight = 400;
      const casesMargin = { top: 30, right: 30, bottom: 50, left: 100 };
      const casesWidth = casesSvgWidth - casesMargin.left - casesMargin.right;
      const casesHeight = casesSvgHeight - casesMargin.top - casesMargin.bottom;

      // Remove the existing SVG if any
      d3.select("#casesChart").select("svg").remove();

      // Create a new SVG
      const casesSvg = d3.select("#casesChart")
                        .append("svg")
                        .attr("width", casesSvgWidth)
                        .attr("height", casesSvgHeight);

      const casesG = casesSvg.append("g")
                            .attr("transform", `translate(${casesMargin.left}, ${casesMargin.top})`);

      // Set up scales and axes
      const casesX = d3.scaleLinear().range([0, casesWidth]);
      const casesY = d3.scaleLinear().range([casesHeight, 0]);

      const casesXAxis = d3.axisBottom(casesX);
      const casesYAxis = d3.axisLeft(casesY);

      casesX.domain(d3.extent(chartData, d => d.date));
      casesY.domain([0, d3.max(chartData, d => d.cases)]);

      // Create the line
      const casesLine = d3.line()
                          .x(d => casesX(d.date))
                          .y(d => casesY(d.cases));

      // Append the line to the chart
      casesG.append("path")
            .datum(chartData)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1.5)
            .attr("d", casesLine);

      // Append the x-axis
      casesG.append("g")
            .attr("transform", `translate(0, ${casesHeight})`)
            .call(casesXAxis);

      // Append the y-axis
      casesG.append("g")
            .call(casesYAxis);

      // Append the chart title
      casesSvg.append("text")
        .attr("x", casesSvgWidth / 2)
        .attr("y", casesMargin.top / 2)
        .attr("class", "chart-title")
        .text("Daily Cases");

      // Append the x-axis label
      casesSvg.append("text")
        .attr("x", casesMargin.left + casesWidth / 2)
        .attr("y", casesHeight + casesMargin.bottom / 2 + 40)
        .attr("class", "axis-label")
        .text("Days");

      // Append the y-axis label
      casesSvg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", casesMargin.left / 2 - 10)
        .attr("x", -casesSvgHeight / 2)
        .attr("class", "axis-label")
        .text("Number of Cases");


      // Create the deaths line chart
      const svgWidth2 = 600;
      const svgHeight2 = 400;
      const margin2 = { top: 30, right: 30, bottom: 50, left: 100 };
      const width2 = svgWidth2 - margin2.left - margin2.right;
      const height2 = svgHeight2 - margin2.top - margin2.bottom;
      
      // Remove the existing SVG if any
      d3.select("#deathsChart").select("svg").remove();
      
      // Create a new SVG
      const svg2 = d3.select("#deathsChart")
                    .append("svg")
                    .attr("width", svgWidth2)
                    .attr("height", svgHeight2);
      
      const g2 = svg2.append("g")
                     .attr("transform", `translate(${margin2.left}, ${margin2.top})`);
      
      // Set up scales and axes
      const x2 = d3.scaleLinear().range([0, width2]);
      const y2 = d3.scaleLinear().range([height2, 0]);
      
      const xAxis2 = d3.axisBottom(x2);
      const yAxis2 = d3.axisLeft(y2);
      
      x2.domain(d3.extent(chartData, d => d.date));
      y2.domain([0, d3.max(chartData, d => d.deaths)]);
      
      // Create the line
      const deathsLine = d3.line()
                           .x(d => x2(d.date))
                           .y(d => y2(d.deaths));
      
      // Append the line to the chart
      g2.append("path")
        .datum(chartData)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", deathsLine);
      
      // Append the x-axis
      g2.append("g")
        .attr("transform", `translate(0, ${height2})`)
        .call(xAxis2);
      
      // Append the y-axis
      g2.append("g")
        .call(yAxis2);

      // Append the chart title
      svg2.append("text")
      .attr("x", svgWidth2 / 2)
      .attr("y", margin2.top / 2)
      .attr("class", "chart-title")
      .text("Daily Deaths");

      // Append the x-axis label
      svg2.append("text")
        .attr("x", margin2.left + width2 / 2)
        .attr("y", height2 + margin2.bottom / 2 + 40)
        .attr("class", "axis-label")
        .text("Days");

      // Append the y-axis label
      svg2.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", margin2.left / 2 - 10)
        .attr("x", -svgHeight2 / 2)
        .attr("text-anchor", "middle")
        .attr("class", "axis-label")
        .text("Number of Deaths");

      // Create the hospitalizations line chart
      const svgWidth3 = 600;
      const svgHeight3 = 400;
      const margin3 = { top: 30, right: 30, bottom: 50, left: 100 };
      const width3 = svgWidth3 - margin3.left - margin3.right;
      const height3 = svgHeight3 - margin3.top - margin3.bottom;
      
      // Remove the existing SVG if any
      d3.select("#hospitalizationChart").select("svg").remove();
      
      // Create a new SVG
      const svg3 = d3.select("#hospitalizationChart")
                    .append("svg")
                    .attr("width", svgWidth3)
                    .attr("height", svgHeight3);
      
      const g3 = svg3.append("g")
                     .attr("transform", `translate(${margin3.left}, ${margin3.top})`);
      
      // Set up scales and axes
      const x3 = d3.scaleLinear().range([0, width3]);
      const y3 = d3.scaleLinear().range([height3, 0]);
      
      const xAxis3 = d3.axisBottom(x3);
      const yAxis3 = d3.axisLeft(y3);
      
      x3.domain(d3.extent(chartData, d => d.date));
      y3.domain([0, d3.max(chartData, d => d.hospitalizations)]);
      
      // Create the line
      const hospitalizationLine = d3.line()
                           .x(d => x3(d.date))
                           .y(d => y3(d.hospitalizations));
      
      // Append the line to the chart
      g3.append("path")
        .datum(chartData)
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", hospitalizationLine);
      
      // Append the x-axis
      g3.append("g")
        .attr("transform", `translate(0, ${height3})`)
        .call(xAxis3);
      
      // Append the y-axis
      g3.append("g")
        .call(yAxis3);

      // Append the chart title
      svg3.append("text")
      .attr("x", svgWidth3 / 2)
      .attr("y", margin3.top / 2)
      .attr("class", "chart-title")
      .text("Daily Hospitalizations");

      // Append the x-axis label
      svg3.append("text")
        .attr("x", margin3.left + width3 / 2)
        .attr("y", height3 + margin3.bottom / 2 + 40)
        .attr("class", "axis-label")
        .text("Days");

      // Append the y-axis label
      svg3.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", margin3.left / 2 - 10)
        .attr("x", -svgHeight3 / 2)
        .attr("text-anchor", "middle")
        .attr("class", "axis-label")
        .text("Number of Hospitlaizations");

      });
    }
    
    // Add an event listener to the dropdown menu
    stateDropdown.on("change", updateChart);
    
    // Initialize the chart with the default state
    updateChart();
    });
