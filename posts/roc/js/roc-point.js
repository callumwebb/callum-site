function rocPointPlot() {

  var margin = {top:10, right:10, bottom:50, left:60},
      width = 200;
      height = 200;

  var x = d3.scaleLinear().domain([0, 1])
    .range([0, width]);
  var y = d3.scaleLinear().domain([0, 1])
    .range([height, 0])
  var xAxis = d3.axisBottom(x)
    .tickValues([0, 0.25, 0.5, 0.75, 1.0])
    .tickFormat(d3.format(".2f"));
  var yAxis = d3.axisLeft(y)
    .tickValues([0, 0.25, 0.5, 0.75, 1.0])
    .tickFormat(d3.format(".2f"));

  function plot(selection) {
    selection.each(function(data) {
      var localData = data.state
      var svg = d3.select(this).selectAll("svg > g")
      if (svg.empty()) {
        svg = d3.select(this).append("svg")
          .attr("viewBox", 0 + " " + 0 + " " + (width + margin.left + margin.right) + " " + (height + margin.bottom + margin.top))
          .attr("preserveAspectRatio", "xMidYMid meet")
          .append("g")  // this group exists purely to respect the margins
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // add the ROC axes
        svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);
        svg.append("g")
          .call(yAxis);

        // text label for the x axis
        svg.append("text")
          .attr("transform",
                "translate(" + (width/2) + " ," +
                               (height + margin.top + 30) + ")")
            .style("text-anchor", "middle")
            .text("false positive rate");

        // text label for the y axis
        svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left)
          .attr("x",0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("true positive rate");

        // add the X gridlines
        function make_x_gridlines() {
          return d3.axisBottom(x)
            .tickValues([0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1.0])
        }
        // gridlines in y axis function
        function make_y_gridlines() {
          return d3.axisLeft(y)
            .tickValues([0, 0.25, 0.5, 0.75, 1.0])
        }

        // add X gridlines
        svg.append("g")
          .attr("class", "grid")
          .attr("transform", "translate(0," + height + ")")
          .call(make_x_gridlines()
              .tickSize(-height)
              .tickFormat("")
          )

        // add the Y gridlines
        svg.append("g")
          .attr("class", "grid")
          .call(make_y_gridlines()
              .tickSize(-width)
              .tickFormat("")
          )

        // add diagonal line
        svg.append("line")
          .attr("x1", x(0))
          .attr("y1", y(0))
          .attr("x2", x(1))
          .attr("y2", y(1))
          .attr("class", "diagonal")
      }

      var tp = 0;
      var fp = 0;
      var tn = 0;
      var fn = 0;

      for (var i = 0; i < localData.length; i++) {
        if (localData[i].type == 1) {
          localData[i].label == 1 ? tp++ : fn++;
        } else {
          localData[i].label == 1 ? fp++ : tn++;
        }
      }

      var pointData = [{"fpr" : fp / (tn + fp), "tpr": tp / (fn + tp)}]

      var t = d3.transition()
        .duration(200);

      var points = svg.selectAll(".point").data(pointData);

      points.exit()
        .remove()

      points.transition(t)
        .attr("cx", function(d) { return x(d.fpr); })
        .attr("cy", function(d) { return y(d.tpr); });

      points.enter().append("circle")
        .attr("class", "point")
        .attr("r", 3)
        .attr("fill", "black")
        .attr("cx", function(d) { return x(d.fpr); })
        .attr("cy", function(d) { return y(d.tpr); })
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
