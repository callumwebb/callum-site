function continuousOutputPlot() {

  var margin = {top: 0, right: 10, bottom: 30, left: 10},
      width = 400,
      height = 30;

  berrySize = 6;

  function plot(selection) {
    selection.each(function(data) {
      var x = d3.scaleLinear().domain([0, 1])
        .range([0, width]);
      var xAxis = d3.axisBottom(x)
        // .tickValues([0, 0.25, 0.5, 0.75, 1.0])
        .tickFormat(d3.format(".2f"));

      var svg = d3.select(this).selectAll("svg > g")
      if (svg.empty()) {
        svg = d3.select(this).append("svg")
          .attr("viewBox", 0 + " " + 0 + " " + (width + margin.left + margin.right) + " " + (height + margin.bottom + margin.top))
          .attr("preserveAspectRatio", "xMidYMid meet")
          .append("g")  // this group exists purely to respect the margins
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);
      }

      var nodes = svg.selectAll(".node").data(data.state);

      nodes.exit()
        .remove()

      var node = nodes.enter().append("circle")
        // .attr("class", ("node " + function(d) {return d.type == 1 ? "raspberry" : "blueberry";}))
        .attr("class", function(d) { return d.type == 1 ? "raspberry" : "blueberry";} )
        .attr("r", 5)
        .attr("cx", function(d) { return x(d.value); })
        // .attr("cy", function(d) { return d.type == 1 ? height / 2 + 6: height / 2 - 7 }) ;
        .attr("cy", height - 20);
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

  return plot;
}
