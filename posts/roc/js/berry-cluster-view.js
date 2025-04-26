
function berryClusterPlot() {

  var  margin = {top: 15, right: 5, bottom: 5, left: 5},  // default margin
       width = 390  ,  // default width
       height = 170;  // default height

  var berrySize = 16 // default berry (outermost) diameter

  var localData = null; // This view's local copy of the underlying data. We need to take a copy because
                        // the force simulation adds properties to the data, which would result in conflicts
                        // if we share state between views

  function plot(selection) {
    selection.each(function(data) {
      // create a local copy of the data
      // var localData = JSON.parse(JSON.stringify(data.state));
      var localData = data.state;

      // Select the svg element, if it exists.
      var svg = d3.select(this).selectAll("svg > g")

      // Otherwise, create the skeletal chart.
      if (svg.empty()) {
        svg = d3.select(this).append("svg")
          .attr("viewBox", 0 + " " + 0 + " " + (width + margin.left + margin.right) + " " + (height + margin.bottom + margin.top))
          .attr("preserveAspectRatio", "xMidYMid meet")
          .append("g")  // this group exists purely to respect the margins
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // text labels
        svg.append("text")
          .attr("x", width / 4)
          .attr("y", 0)
          .style("text-anchor", "middle")
          .style("alignment-baseline", "bottom")
          .text("blueberries");
        svg.append("text")
          .attr("x", 3 * width / 4)
          .attr("y", 0)
          .style("text-anchor", "middle")
          .text("raspberries");

        // placeholder for nodes
        svg.append("g")
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
          .attr("class", "nodes")

        // create the cluster centroids
        clusters = [{x: (-width / 4.0), y: 0}, {x: (width / 4.0), y : 0}];
      }

      // force functions for layout of berries
      var forceX = d3.forceX((d) => clusters[d.label == 1 ? 1 : 0].x).strength(0.06);
      var forceY = d3.forceY((d) => clusters[d.label == 1 ? 1 : 0].y).strength(0.06);

      // set up force simulation
      var simulation = d3.forceSimulation(localData)
        .velocityDecay(0.07)
        .alphaDecay(0.02)
        .alphaTarget(0.001)
        .force("collide", d3.forceCollide(berrySize + 3).iterations(3))
        .force('x', forceX)
        .force('y', forceY)
        .on("tick", ticked)

      // simulation interaction functions
      function dragstarted(d) {
        if (!d3.event.active) {
          data.dragStart()
        } 
        d.fx = d3.event.x;
        d.fy = d.y;
        d.label = d.label == 1 ? 0 : 1;
        data.updateViews();
      }
      function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }
      function dragended(d) {
        d.fx = null;
        d.fy = null;
        if (!d3.event.active) data.dragEnd();
      }
      function dragsubject() {
        return simulation.find(d3.event.x, d3.event.y);
      }

      // simulation tick function
      function ticked() {
        svg.select("g.nodes").selectAll(".node").attr("transform", function(d) {return "translate(" + d.x + "," + d.y + ")"});
      }

      // apply general update pattern to nodes
      function update() {
        var node = svg.select("g.nodes").selectAll(".node").data(localData);

        node.exit().remove();
        
        node.selectAll("circle.nodeLabel").attr("class", function(d) {return d.label == 1 ? "nodeLabel pos" : "nodeLabel neg"})

        var nodeEnter = node.enter().append("g")
          .attr("class", "node")
          .call(d3.drag()
            .subject(dragsubject)
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))

        nodeEnter.append("circle").attr("r",  berrySize).attr("class", function(d) {return d.label == 1 ? "nodeLabel pos" : "nodeLabel neg"})
        nodeEnter.append("circle").attr("r",  berrySize - 7).attr("class", function(d) {return d.type == 1 ? "raspberry" : "blueberry"});

        simulation.nodes(localData);
        simulation.restart();
      }

      function reheat() {
        simulation.alphaDecay(0.1).alphaTarget(0.7).restart();
      }

      function cool() {
        simulation.alphaDecay(0.02).alphaTarget(0.001);
      }

      update();
      data.register(update);
      data.registerDragStart(reheat);
      data.registerDragEnd(cool);
    })
  }

  plot.width = function(value) {
    if (!arguments.length) return width;
    width = value;
    return plot;
  };

  plot.height = function(value) {
    if (!arguments.length) return height;
    height = value;
    return plot;
  };

  plot.berrySize = function(value) {
    if (!arguments.length) return berrySize;
    berrySize = value;
    return plot;
  }

  return plot;
}
