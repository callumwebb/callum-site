/**
 * Discrimination Plot
 * Shows berries with a slider to control the classification threshold
 */
window.discrimPlot = function() {
  // Configuration
  let margin = {top: 20, right: 10, bottom: 30, left: 10};
  let width = 400;
  let height = 60;
  let berryRadius = 9;
  
  function plot(selection) {
    selection.each(function(data) {
      const localData = data.state;
      
      // Create container div if it doesn't exist
      let container = d3.select(this).selectAll(".discrim-container");
      
      if (container.empty()) {
        container = d3.select(this).append("div")
          .attr("class", "discrim-container");
        
        // Create SVG element
        const svg = container.append("svg")
          .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.bottom + margin.top}`)
          .attr("preserveAspectRatio", "xMidYMid meet")
          .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
        
        // Create x scale
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
        
        // Create vertical line for threshold
        svg.append("line")
          .attr("class", "threshold-line")
          .attr("y1", 0)
          .attr("y2", height)
          .attr("stroke", "#000")
          .attr("stroke-width", 2)
          .attr("stroke-dasharray", "4,4");
        
        // Create group for berries
        svg.append("g")
          .attr("class", "berries");
        
        // Add range input (slider)
        container.append("div")
          .style("margin-top", "10px")
          .append("input")
            .attr("type", "range")
            .attr("min", 0)
            .attr("max", 1)
            .attr("step", 0.01)
            .attr("value", data.threshold)
            .style("width", "100%")
            .style("max-width", `${width}px`)
            .on("input", function() {
              // Update threshold
              data.threshold[0] = +this.value;
              
              // Update visualization
              updateVisualization();
              
              // Notify other views
              data.updateViews();
            });
      }
      
      function updateVisualization() {
        // Get SVG and scales
        const svg = container.select("svg g");
        const x = d3.scaleLinear()
          .domain([0, 1])
          .range([0, width]);
        
        // Update threshold line position
        svg.select(".threshold-line")
          .attr("x1", x(data.threshold[0]))
          .attr("x2", x(data.threshold[0]));
        
        // Get berry group
        const berryGroup = svg.select(".berries");
        
        // Bind data to berries
        const berries = berryGroup.selectAll(".berry")
          .data(localData);
        
        // Remove old berries
        berries.exit().remove();
        
        // Add new berries
        berries.enter().append("circle")
          .attr("class", "berry")
          .attr("r", berryRadius)
          .attr("cx", d => x(d.value))
          .attr("cy", height / 2)
          .merge(berries)
          .attr("fill", d => d.type === 1 ? "#e63946" : "#457b9d")
          .attr("stroke", d => d.value >= data.threshold[0] 
            ? "#e63946" : "#457b9d")
          .attr("stroke-width", 2)
          .attr("stroke-dasharray", "2,1");
      }
      
      // Initial visualization
      updateVisualization();
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