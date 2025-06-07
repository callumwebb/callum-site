// continuous-output-plot.js
export function renderContinuousOutputPlot(selector, store) {
  const margin = { top: 10, right: 10, bottom: 50, left: 10 };
  const width = 400;
  const height = 40;
  const berrySize = 9;

  // Create SVG container
  const svg = d3.select(selector)
    .append("svg")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.bottom + margin.top}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Create scales
  const xScale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, width]);

  // Create axis
  const xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.format(".2f"));

  // Add axis to SVG
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis);

  // Add axis label
  svg.append("text")
    .attr("transform", `translate(${width/2},${height + 40})`)
    .style("text-anchor", "middle")
    .text("likelihood of raspberry");

  // Add arrow markers with matching color
  svg.append("defs").append("marker")
    .attr("id", "arrowhead-cont")  // Changed ID to be specific to this visualization
    .attr("refX", 5)
    .attr("refY", 2)
    .attr("markerWidth", 6)
    .attr("markerHeight", 4)
    .attr("orient", "auto-start-reverse")
    .append("path")
    .attr("d", "M 0,0 V 4 L6,2 Z")
    .style("fill", "#868e96");  // Match the line color

  // Add line with arrows
  svg.append("line")
    .attr("class", "span")
    .attr("x1", xScale(0))
    .attr("y1", height / 2)
    .attr("x2", xScale(1))
    .attr("y2", height / 2)
    .attr("marker-end", "url(#arrowhead-cont)")
    .attr("marker-start", "url(#arrowhead-cont)")
    .style("stroke-dasharray", "4,4");  // Make line dashed

  // Add single blueberry
  svg.append("circle")
    .attr("class", "blueberry")
    .attr("r", berrySize)
    .attr("transform", `translate(${xScale(0.32)},${height/2})`);

  // No need for update function or store subscription since we're showing a static berry
} 