/**
 * ROC Point Plot
 * Displays a single point on the ROC curve space
 */
window.rocPointPlot = function() {
  // Configuration
  let margin = {top: 10, right: 10, bottom: 50, left: 60};
  let width = 200;
  let height = 200;
  
  // Create scales for the axes
  const x = d3.scaleLinear().domain([0, 1])
    .range([0, width]);
  const y = d3.scaleLinear().domain([0, 1])
    .range([height, 0]);
  
  // Create axes
  const xAxis = d3.axisBottom(x)
    .tickValues([0, 0.25, 0.5, 0.75, 1.0])
    .tickFormat(d3.format(".2f"));
  const yAxis = d3.axisLeft(y)
    .tickValues([0, 0.25, 0.5, 0.75, 1.0])
    .tickFormat(d3.format(".2f"));
  
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
        
        // Add axes
        svg.append("g")
          .attr("transform", `translate(0,${height})`)
          .call(xAxis);
        svg.append("g")
          .call(yAxis);
        
        // Add x-axis label
        svg.append("text")
          .attr("transform", `translate(${width/2},${height + margin.top + 30})`)
          .style("text-anchor", "middle")
          .text("false positive rate");
        
        // Add y-axis label
        svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left)
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("true positive rate");
        
        // Create grid functions
        function makeXGridlines() {
          return d3.axisBottom(x)
            .tickValues([0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1.0]);
        }
        
        function makeYGridlines() {
          return d3.axisLeft(y)
            .tickValues([0, 0.25, 0.5, 0.75, 1.0]);
        }
        
        // Add x-axis gridlines
        svg.append("g")
          .attr("class", "grid")
          .attr("transform", `translate(0,${height})`)
          .call(makeXGridlines()
            .tickSize(-height)
            .tickFormat("")
          );
        
        // Add y-axis gridlines
        svg.append("g")
          .attr("class", "grid")
          .call(makeYGridlines()
            .tickSize(-width)
            .tickFormat("")
          );
        
        // Add diagonal reference line
        svg.append("line")
          .attr("x1", x(0))
          .attr("y1", y(0))
          .attr("x2", x(1))
          .attr("y2", y(1))
          .attr("class", "diagonal");
      }
      
      // Calculate true/false positives/negatives
      let tp = 0;
      let fp = 0;
      let tn = 0;
      let fn = 0;
      
      for (let i = 0; i < localData.length; i++) {
        if (localData[i].type === 1) {
          localData[i].label === 1 ? tp++ : fn++;
        } else {
          localData[i].label === 1 ? fp++ : tn++;
        }
      }
      
      // Calculate the position for the ROC point
      const pointData = [{
        "fpr": fp / (tn + fp), 
        "tpr": tp / (fn + tp)
      }];
      
      // Set up transition
      const t = d3.transition()
        .duration(200);
      
      // Update the point
      const points = svg.selectAll(".point").data(pointData);
      
      // Remove old points
      points.exit().remove();
      
      // Update existing points
      points.transition(t)
        .attr("cx", d => x(d.fpr))
        .attr("cy", d => y(d.tpr));
      
      // Add new points
      points.enter().append("circle")
        .attr("class", "point")
        .attr("r", 3)
        .attr("fill", "black")
        .attr("cx", d => x(d.fpr))
        .attr("cy", d => y(d.tpr));
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
  
  return plot;
}