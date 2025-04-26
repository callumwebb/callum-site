function discrimPlot() {

  var margin = {top: 0, right: 10, bottom: 20, left: 10},
      width = 400,
      height = 70;

  berrySize = 6;

  function plot(selection) {
    selection.each(function(data) {
      // var threshold = 0.5 // starting threshold
      var x = d3.scaleLinear().domain([0, 1])
        .range([0, width])
        .clamp(true);
      var xAxis = d3.axisBottom(x)
        .tickFormat(d3.format(".2f"));

      var svg = d3.select(this).selectAll("svg > g")
      if (svg.empty()) {
        svg = d3.select(this).append("svg")
          .attr("viewBox", 0 + " " + 0 + " " + (width + margin.left + margin.right) + " " + (height + margin.bottom + margin.top))
          .attr("preserveAspectRatio", "xMidYMid meet")
          .append("g")  // this group exists purely to respect the margins
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("g")
          .attr("transform", "translate(0," + height / 2.0 + ")")
          .call(xAxis);

        // add a slider!
        var slider = svg.append("g")
          .attr("class", "slider")
          .attr("transform", "translate(0," + height + ")");

        slider.append("line")
          .attr("class", "track")
          .attr("x1", x.range()[0])
          .attr("x2", x.range()[1])
          .select(function() {return this.parentNode.appendChild(this.cloneNode(true));})
            .attr("class", "track-inset")
          .select(function() {return this.parentNode.appendChild(this.cloneNode(true));})
            .attr("class", "track-overlay")
            .call(d3.drag()
              .on("start.interrupt", function() {slider.interrupt();})
              .on("end drag", function() {slide(x.invert(d3.event.x));}))

        var handle = slider.insert("circle", ".track-overlay")
            .attr("class", "handle")
            .attr("r", 8)
            .attr("cx", x(0.5));
      }

      function slide(threshold) {
        // this.threshold = threshold;
        handle.attr("cx", x(threshold));
        data.threshold = [threshold];
        data.updateViews();
        update();
      }

      // Provide an update function to draw the threshold and resulting labels, as these will
      // change when we slide
      function update() {
        handle.attr("cx", x(data.threshold));
        var thresholdLine = svg.selectAll(".thresholdLine").data(data.threshold)
        thresholdLine.exit().remove()
        thresholdLine.enter().append("line")
          .attr("class", "thresholdLine")
          .merge(thresholdLine)
          .attr("x1", function(d) { return x(d) })
          .attr("x2", function(d) { return x(d) })
          .attr("y1", 0)
          .attr("y2", height / 2)
          .attr("stroke", "black")

        var nodeLabels = svg.selectAll(".nodeLabel").data(data.state)
        nodeLabels.exit().remove;
        nodeLabels.enter().append("circle").merge(nodeLabels)
          .attr("class", function(d) { return d.value >= data.threshold ? "nodeLabel pos" : "nodeLabel neg";} )
          .attr("r", 12)
          .attr("cx", function(d) { return x(d.value); })
          .attr("cy", height / 2 - 20);

        var nodes = svg.selectAll(".node").data(data.state);
        nodes.exit().remove()
        var node = nodes.enter().append("circle")
          // .attr("class", ("node " + function(d) {return d.type == 1 ? "raspberry" : "blueberry";}))
          .attr("class", function(d) { return d.type == 1 ? "node raspberry" : "node blueberry";} )
          .attr("r", 5)
          .attr("cx", function(d) { return x(d.value); })
          .attr("cy", height / 2 - 20);
      }
      data.register(update);
      update();
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
