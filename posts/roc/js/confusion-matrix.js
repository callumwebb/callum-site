// Confusion matrix!
function confusionMatrix() {

  // margin around confusion matrix
  var margin = {top:50, right:10, bottom:10, left:60},
      width = 150;
      height = 130;

  function matrix(selection) {
    selection.each(function(data) {
      data = data.state

      // From the data, calculate the matrix contents
      var tp = 0;
      var fp = 0;
      var tn = 0;
      var fn = 0;

      for (var i = 0; i < data.length; i++) {
        if (data[i].type == 1) {
          data[i].label == 1 ? tp++ : fn++;
        } else {
          data[i].label == 1 ? fp++ : tn++;
        }
      }

      data = d3.entries({"tp" : tp, "fp" : fp, "tn" : tn, "fn" : fn})

      // update corresponding sens/spec/prec labels in text
      d3.select("#sensitivity").text(tp + "/" + (tp + fn));
      d3.select("#specificity").text(tn + "/" + (tn + fp));
      d3.select("#fpr").text(fp + "/" + (tn + fp));
      d3.select("#fnr").text(fn + "/" + (fn + tp));
      d3.select("#precision").text(tp + "/" + (tp + fp));

      var svg = d3.select(this).selectAll("svg > g")
      if (svg.empty()) {
        svg = d3.select(this).append("svg")
          .attr("viewBox", 0 + " " + 0 + " " + (width + margin.left + margin.right) + " " + (height + margin.bottom + margin.top))
          .attr("preserveAspectRatio", "xMidYMid meet")
          .append("g")  // this group exists purely to respect the margins
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("rect")
          .attr("width", width)
          .attr("height", height)
          .attr("fill", "none")
          .attr("stroke", "black");

        // quadrant lines
        svg.append("line")
          .attr("x1", width / 2)
          .attr("y1", 0)
          .attr("x2", width / 2)
          .attr("y2", height)
          .attr("stroke", "black")
          .attr("stroke-dasharray", "5, 5")
        svg.append("line")
          .attr("x1", 0)
          .attr("y1", height / 2)
          .attr("x2", width)
          .attr("y2", height / 2)
          .attr("stroke", "black")
          .attr("stroke-dasharray", "5, 5")

        // Predicted labels
        svg.append("text")
          .attr("transform", "translate(" + (width / 2) + " ," + (- 2 * margin.top / 3) + ")")
          .style("text-anchor", "middle")
          .text("predicted");
        svg.append("text")
          .attr("transform", "translate(" + (width / 4) + "," + (- margin.top / 3) + ")")
          .style("text-anchor", "middle")
          .style("alignment-baseline", "middle")
          .style("font-weight", "bold")
          .text("+");
        svg.append("text")
          .attr("transform", "translate(" + (3 * width / 4) + "," + (- margin.top / 3) + ")")
          .style("text-anchor", "middle")
          .style("alignment-baseline", "middle")
          .style("font-weight", "bold")
          .text("−");

        // Actual labels
        svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", - 2.5 * margin.left / 3)
          .attr("x", - height / 2)
          .style("text-anchor", "middle")
          .text("actually");
        svg.append("text")
          .attr("x", 0 - 1.1 * margin.left / 2)
          .attr("y", height / 4)
          .style("text-anchor", "middle")
          .style("alignment-baseline", "middle")
          .style("font-weight", "bold")
          .text("+");
        svg.append("text")
          .attr("x", 0 - 1.1 * margin.left / 2)
          .attr("y", 3 * height / 4)
          .style("text-anchor", "middle")
          .style("alignment-baseline", "middle")
          .style("font-weight", "bold")
          .text("−");

        svg.append("g")
          .attr("class", "labels")
      }

      var label = svg.select("g.labels").selectAll("text").data(data)

      label.exit().remove()

      label.enter().append("text")
        .attr("class", "confusion")
        .attr("x", function(d) {return((d.key == "tp" || d.key == "fp") ? width / 4 : 3 * width / 4);})
        .attr("y", function(d) {return((d.key == "tp" || d.key == "fn") ? height / 4 : 3 * height / 4);})
        .style("text-anchor", "middle")
        .style("alignment-baseline", "middle")
        .merge(label)
        .text(function(d) {return d.value;})
    })
  }

  matrix.width = function(value) {
    if (!arguments.length) return width;
    width = value;
    return matrix;
  };

  matrix.height = function(value) {
    if (!arguments.length) return height;
    height = value;
    return matrix;
  };

  return matrix;
}
