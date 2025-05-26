/**
 * Confusion Matrix Visualization
 * Displays a 2x2 matrix showing TP, FP, TN, FN values
 */
window.confusionMatrix = function() {
  // Margin around confusion matrix
  let margin = {top: 50, right: 10, bottom: 10, left: 60};
  let width = 150;
  let height = 130;

  function matrix(selection) {
    selection.each(function(data) {
      const berryData = data.state;

      // Calculate confusion matrix values
      let tp = 0;
      let fp = 0;
      let tn = 0;
      let fn = 0;

      for (let i = 0; i < berryData.length; i++) {
        if (berryData[i].type === 1) {
          berryData[i].label === 1 ? tp++ : fn++;
        } else {
          berryData[i].label === 1 ? fp++ : tn++;
        }
      }

      // Format for d3 - Create array of key-value pairs (d3.entries replacement for v7)
      const matrixData = Object.entries({
        "tp": tp, "fp": fp, "tn": tn, "fn": fn
      }).map(([key, value]) => ({ key, value }));

      // Update corresponding statistics labels in the document
      d3.select("#sensitivity").text(`${tp}/${tp + fn}`);
      d3.select("#specificity").text(`${tn}/${tn + fp}`);
      d3.select("#fpr").text(`${fp}/${tn + fp}`);
      d3.select("#fnr").text(`${fn}/${fn + tp}`);
      d3.select("#precision").text(`${tp}/${tp + fp}`);

      // Create or update the visualization
      let svg = d3.select(this).selectAll("svg > g");
      
      if (svg.empty()) {
        svg = d3.select(this).append("svg")
          .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.bottom + margin.top}`)
          .attr("preserveAspectRatio", "xMidYMid meet")
          .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Matrix outline
        svg.append("rect")
          .attr("width", width)
          .attr("height", height)
          .attr("fill", "none")
          .attr("stroke", "black");

        // Dividing lines for quadrants
        svg.append("line")
          .attr("x1", width / 2)
          .attr("y1", 0)
          .attr("x2", width / 2)
          .attr("y2", height)
          .attr("stroke", "black")
          .attr("stroke-dasharray", "5, 5");
        
        svg.append("line")
          .attr("x1", 0)
          .attr("y1", height / 2)
          .attr("x2", width)
          .attr("y2", height / 2)
          .attr("stroke", "black")
          .attr("stroke-dasharray", "5, 5");

        // Predicted labels (column headers)
        svg.append("text")
          .attr("transform", `translate(${width / 2},${-2 * margin.top / 3})`)
          .style("text-anchor", "middle")
          .text("predicted");
        
        svg.append("text")
          .attr("transform", `translate(${width / 4},${-margin.top / 3})`)
          .style("text-anchor", "middle")
          .style("alignment-baseline", "middle")
          .style("font-weight", "bold")
          .text("+");
        
        svg.append("text")
          .attr("transform", `translate(${3 * width / 4},${-margin.top / 3})`)
          .style("text-anchor", "middle")
          .style("alignment-baseline", "middle")
          .style("font-weight", "bold")
          .text("−");

        // Actual labels (row headers)
        svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", -2.5 * margin.left / 3)
          .attr("x", -height / 2)
          .style("text-anchor", "middle")
          .text("actually");
        
        svg.append("text")
          .attr("x", -1.1 * margin.left / 2)
          .attr("y", height / 4)
          .style("text-anchor", "middle")
          .style("alignment-baseline", "middle")
          .style("font-weight", "bold")
          .text("+");
        
        svg.append("text")
          .attr("x", -1.1 * margin.left / 2)
          .attr("y", 3 * height / 4)
          .style("text-anchor", "middle")
          .style("alignment-baseline", "middle")
          .style("font-weight", "bold")
          .text("−");

        // Container for matrix values
        svg.append("g")
          .attr("class", "labels");
      }

      // Update cell values
      const label = svg.select("g.labels").selectAll("text")
        .data(matrixData);

      // Remove old labels
      label.exit().remove();

      // Update existing and add new labels
      label.enter().append("text")
        .attr("class", "confusion")
        .attr("x", d => ((d.key === "tp" || d.key === "fp") ? width / 4 : 3 * width / 4))
        .attr("y", d => ((d.key === "tp" || d.key === "fn") ? height / 4 : 3 * height / 4))
        .style("text-anchor", "middle")
        .style("alignment-baseline", "middle")
        .merge(label)
        .text(d => d.value);
    });
  }

  // Getter/setter for width
  matrix.width = function(value) {
    if (!arguments.length) return width;
    width = value;
    return matrix;
  };

  // Getter/setter for height
  matrix.height = function(value) {
    if (!arguments.length) return height;
    height = value;
    return matrix;
  };

  return matrix;
}