/**
 * Continuous Output Plot
 * Shows berries arranged horizontally by their predicted values
 */
window.continuousOutputPlot = function() {
  // Configuration
  let margin = {top: 0, right: 10, bottom: 50, left: 10};
  let width = 400;
  let height = 60;
  let berryRadius = 9;
  
  function plot(selection) {
    selection.each(function(data) {
      const localData = data.state;
      
      // Create or select SVG
      let svg = d3.select(this).selectAll("svg > g");
      
      if (svg.empty()) {
        // Create new SVG if it doesn't exist
        svg = d3.select(this).append("svg")
          .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.bottom + margin.top}`)
          .attr("preserveAspectRatio", "xMidYMid meet")
          .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
        
        // Create arrowhead marker for the axis
        svg.append("defs").append("marker")
          .attr("id", "arrowhead-cont")
          .attr("refX", 5)
          .attr("refY", 2)
          .attr("markerWidth", 6)
          .attr("markerHeight", 4)
          .attr("orient", "auto-start-reverse")
          .append("path")
            .attr("d", "M 0,0 V 4 L6,2 Z");
        
        // Create scale for the x-axis
        const x = d3.scaleLinear()
          .domain([0, 1])
          .range([0, width]);
        
        // Create x-axis
        const xAxis = d3.axisBottom(x)
          .tickFormat(d3.format(".2f"));
        
        // Add x-axis
        svg.append("g")
          .attr("transform", `translate(0,${height})`)
          .call(xAxis);
        
        // Add x-axis label
        svg.append("text")
          .attr("transform", `translate(${width/2},${height + 40})`)
          .style("text-anchor", "middle")
          .text("likelihood of raspberry");
        
        // Add horizontal line with arrows
        svg.append("line")
          .attr("class", "span")
          .attr("x1", x(0))
          .attr("y1", height / 2)
          .attr("x2", x(1))
          .attr("y2", height / 2)
          .attr("stroke", "#999")
          .attr("marker-end", "url(#arrowhead-cont)")
          .attr("marker-start", "url(#arrowhead-cont)");
        
        // Create group for berries
        svg.append("g")
          .attr("class", "berries");
      }
      
      // Get berry group and scale
      const berryGroup = svg.select(".berries");
      const x = d3.scaleLinear()
        .domain([0, 1])
        .range([0, width]);
      
      // Bind data to berries
      const berries = berryGroup.selectAll(".berry")
        .data(localData);
      
      // Remove old berries
      berries.exit().remove();
      
      // Create new berries
      berries.enter().append("circle")
        .attr("class", "berry")
        .attr("r", berryRadius)
        .attr("fill", d => d.type === 1 ? "#e63946" : "#457b9d")
        .attr("cx", d => x(d.value))
        .attr("cy", height / 2)
        .attr("stroke", "none");
    });
  }
  
  // Getter/setter for width
  plot.width = function(value) {
    if (!arguments.length) return width;
    width = value;
    return plot;
  };
  
  // Getter/setter for height
  plot.height = function(value) {
    if (!arguments.length) return height;
    height = value;
    return plot;
  };
  
  // Getter/setter for berry radius
  plot.berryRadius = function(value) {
    if (!arguments.length) return berryRadius;
    berryRadius = value;
    return plot;
  };
  
  return plot;
}