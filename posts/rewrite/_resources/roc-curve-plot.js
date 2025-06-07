// roc-curve-plot.js
export function renderRocCurvePlot(selector, store) {
  const margin = { top: 10, right: 10, bottom: 60, left: 60 };
  const width = 200;
  const height = 200;
  const totalWidth = width + margin.left + margin.right;
  const totalHeight = height + margin.top + margin.bottom;

  // Create SVG container for ROC curve
  const svg = d3.select(selector)
    .append("svg")
    .attr("width", totalWidth)
    .attr("height", totalHeight)
    .style("max-width", "100%")
    .style("height", "auto")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Create scales for ROC curve
  const xScale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, width]);
  
  const yScale = d3.scaleLinear()
    .domain([0, 1])
    .range([height, 0]);

  // Add axes
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale)
      .tickValues([0, 0.25, 0.5, 0.75, 1.0])
      .tickFormat(d3.format(".2f")));
  
  svg.append("g")
    .call(d3.axisLeft(yScale)
      .tickValues([0, 0.25, 0.5, 0.75, 1.0])
      .tickFormat(d3.format(".2f")));

  // Add axis labels
  svg.append("text")
    .attr("transform", `translate(${width/2},${height + 40})`)
    .attr("text-anchor", "middle")
    .text("false positive rate");

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -40)
    .attr("x", -height/2)
    .attr("text-anchor", "middle")
    .text("true positive rate");

  // Add diagonal reference line
  svg.append("line")
    .attr("x1", xScale(0))
    .attr("y1", yScale(0))
    .attr("x2", xScale(1))
    .attr("y2", yScale(1))
    .attr("class", "reference-line");

  // Add container for the current point
  const point = svg.append("circle")
    .attr("class", "current-point")
    .attr("r", 4);

  // Add container for the ROC curve
  const rocLine = d3.line()
    .x(d => xScale(d.fpr))
    .y(d => yScale(d.tpr));

  function generateRocPoints(nodes) {
    // Sort nodes by value in ascending order (lowest confidence first)
    const rocData = nodes.slice().sort((a, b) => a.value - b.value);
    
    // Count total positives and negatives
    const np = rocData.reduce((previous, current) => previous + current.type, 0);
    const nn = rocData.length - np;
    
    // Start with all predictions negative
    let tp = 0;  // true positives start at 0
    let tn = nn; // true negatives start at total negatives
    
    // Move threshold down through each value
    for (let i = rocData.length - 1; i >= 0; i--) {
      if (rocData[i].type === 1) {
        tp++; // Found a new true positive
      } else {
        tn--; // Lost a true negative
      }
      rocData[i].tpr = tp / np;
      rocData[i].fpr = (nn - tn) / nn;
    }
    
    // Add origin point at the end
    rocData.push({tpr: 0, fpr: 0});
    
    return rocData;
  }

  function calculateRates(nodes, threshold) {
    const counts = nodes.reduce((acc, n) => {
      if (n.type === 1) {
        n.value >= threshold ? acc.tp++ : acc.fn++;
      } else {
        n.value >= threshold ? acc.fp++ : acc.tn++;
      }
      return acc;
    }, { tp: 0, fp: 0, tn: 0, fn: 0 });

    const tpr = counts.tp / (counts.tp + counts.fn);
    const fpr = counts.fp / (counts.fp + counts.tn);
    return { tpr, fpr };
  }

  function update(state) {
    // Generate ROC points
    const rocPoints = generateRocPoints(state.nodes);
    
    // Update ROC curve using same pattern as working implementation
    const rocPath = svg.selectAll(".rocL")
      .data([rocPoints]);
    
    // Handle enter case
    rocPath.enter()
      .append("path")
      .attr("class", "rocL")
      .attr("d", rocLine);
    
    // Handle update case
    rocPath
      .attr("d", rocLine);
    
    // Handle exit case
    rocPath.exit().remove();

    // Update current point on ROC curve
    const currentRates = calculateRates(state.nodes, state.threshold);
    point
      .attr("cx", xScale(currentRates.fpr))
      .attr("cy", yScale(currentRates.tpr));
  }

  // Initial render
  update(store.getState());

  // Subscribe to state changes
  store.subscribe(update);
} 