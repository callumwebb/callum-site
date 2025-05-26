/**
 * Berry Cluster Visualization
 * Interactive visualization of berries that can be labeled
 */
window.berryClusterPlot = function() {
  // Configuration
  let margin = {top: 10, right: 10, bottom: 10, left: 10};
  let width = 400;
  let height = 70;
  let nodeRadius = 16;
  
  // Force simulation reference
  let simulation = null;
  
  function plot(selection) {
    selection.each(function(data) {
      const localData = data.state;
      
      // Create or select the SVG container
      let svg = d3.select(this).selectAll("svg > g");
      
      if (svg.empty()) {
        // Create new SVG if it doesn't exist
        svg = d3.select(this).append("svg")
          .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.bottom + margin.top}`)
          .attr("preserveAspectRatio", "xMidYMid meet")
          .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
        
        // Create berry group for all berries
        svg.append("g")
          .attr("class", "berry-plot");
      }
      
      // Define drag behavior
      const drag = d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
      
      // Force simulation drag event handlers
      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
        data.dragStart();
      }
      
      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }
      
      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
        data.dragEnd();
      }
      
      // Update berry visualization
      function updateVisualization() {
        const berryGroup = svg.select(".berry-plot");
        
        // Create or update node groups
        const nodeGroups = berryGroup.selectAll(".node")
          .data(localData)
          .join(
            enter => {
              // Create new node groups
              const nodeGroup = enter.append("g")
                .attr("class", "node")
                .style("cursor", "pointer")
                .call(drag);
              
              // Add berry circles
              nodeGroup.append("circle")
                .attr("r", nodeRadius - 7)
                .attr("class", d => d.type === 1 ? "raspberry" : "blueberry");
              
              // Add label circles
              nodeGroup.append("circle")
                .attr("r", nodeRadius)
                .attr("class", d => d.label === 1 ? "nodeLabel pos" : "nodeLabel neg");
              
              // Handle click events to toggle labels
              nodeGroup.on("click", function(event, d) {
                // Toggle the label
                d.label = 1 - d.label;
                
                // Update the label circle class
                d3.select(this).select(".nodeLabel")
                  .attr("class", d.label === 1 ? "nodeLabel pos" : "nodeLabel neg");
                
                // Update all views that depend on this data
                data.updateViews();
              });
              
              return nodeGroup;
            },
            update => {
              // Update existing node properties
              update.select(".nodeLabel")
                .attr("class", d => d.label === 1 ? "nodeLabel pos" : "nodeLabel neg");
              
              return update;
            }
          );
        
        // Create or update force simulation
        if (!simulation) {
          // Create cluster center forces
          const clusterCenters = [
            { x: width * 0.7, y: height / 2 }, // for blueberries (type 0)
            { x: width * 0.3, y: height / 2 }  // for raspberries (type 1)
          ];
          
          // Create cluster force
          function forceCluster(alpha) {
            for (let i = 0; i < localData.length; i++) {
              const d = localData[i];
              const center = clusterCenters[d.type];
              d.vx += (center.x - d.x) * alpha * 0.1;
              d.vy += (center.y - d.y) * alpha * 0.1;
            }
          }
          
          // Create force simulation
          simulation = d3.forceSimulation(localData)
            .alphaDecay(0.02)  // slower decay for more activity
            .velocityDecay(0.3)
            .force("cluster", forceCluster)
            .force("collide", d3.forceCollide().radius(nodeRadius + 1).strength(0.7))
            .force("x", d3.forceX(width / 2).strength(0.05))
            .force("y", d3.forceY(height / 2).strength(0.05))
            .on("tick", ticked);
        } else {
          // Update simulation with new data
          simulation.nodes(localData);
          simulation.alpha(0.3).restart();
        }
        
        // Tick function to update positions
        function ticked() {
          nodeGroups.attr("transform", d => `translate(${d.x},${d.y})`);
        }
      }
      
      // Initial render
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
  
  // Getter/setter for node radius
  plot.nodeRadius = function(value) {
    if (!arguments.length) return nodeRadius;
    nodeRadius = value;
    return plot;
  };
  
  return plot;
}