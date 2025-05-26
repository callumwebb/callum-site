/**
 * ROC Point Curve Plot
 * Displays the ROC curve and optionally a point at the current threshold
 */
window.rocPointCurvePlot = function() {
  // Configuration
  let margin = {top: 10, right: 10, bottom: 60, left: 60};
  let width = 200;
  let height = 200;
  let showDot = true;
  
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
        
        // Calculate the ROC curve data points
        const rocData = [...localData].sort((a, b) => a.value - b.value);
        
        // Count positives and negatives in the data
        const np = rocData.reduce((previous, current) => previous + current.type, 0);
        const nn = rocData.length - np;
        
        // Initialize counts for the ROC calculation
        // Start with a high threshold (all predicted negative)
        let tp = 0; // true positive count initially zero
        let tn = nn; // all negatives correctly marked negative
        
        // Calculate TPR and FPR for each threshold
        for (let i = rocData.length - 1; i >= 0; i--) {
          if (rocData[i].type === 1) {
            tp++; // One more true positive
          } else {
            tn--; // One less true negative
          }
          rocData[i].tpr = tp / np;
          rocData[i].fpr = (nn - tn) / nn;
        }
        
        // Add the origin point (0,0)
        rocData.push({tpr: 0, fpr: 0});
        
        // Create the ROC line generator
        const rocLine = d3.line()
          .x(d => x(d.fpr))
          .y(d => y(d.tpr));
        
        // Draw the ROC curve
        svg.append("path")
          .datum(rocData)
          .attr("d", rocLine)
          .attr("class", "rocL");
      }
      
      // Function to update the current threshold point
      function update() {
        if (showDot) {
          // Calculate true/false positives/negatives at current threshold
          let tp = 0;
          let fp = 0;
          let tn = 0;
          let fn = 0;
          
          for (let i = 0; i < localData.length; i++) {
            if (localData[i].type === 1) {
              localData[i].value >= data.threshold ? tp++ : fn++;
            } else {
              localData[i].value >= data.threshold ? fp++ : tn++;
            }
          }
          
          // Calculate the position for the ROC point
          const pointData = [{
            "fpr": fp / (tn + fp), 
            "tpr": tp / (fn + tp)
          }];
          
          // Update or create the point
          const points = svg.selectAll(".point").data(pointData);
          
          // Remove old points
          points.exit().remove();
          
          // Add new points and update existing ones
          const enterPoints = points.enter().append("circle")
            .attr("class", "point")
            .attr("r", 3)
            .attr("fill", "black");
            
          enterPoints.merge(points)
            .attr("cx", d => x(d.fpr))
            .attr("cy", d => y(d.tpr));
        }
      }
      
      // Register the update function with the data
      data.register(update);
      
      // Initial update
      update();
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
  
  // Getter/setter for showDot flag
  plot.showDot = function(value) {
    if (!arguments.length) return showDot;
    showDot = value;
    return plot;
  };
  
  return plot;
}