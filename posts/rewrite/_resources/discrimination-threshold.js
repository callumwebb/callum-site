export function renderDiscriminationThreshold(selector) {
  const margin = { top: 0, right: 10, bottom: 50, left: 10 };
  const width = 400;
  const height = 40;

  // Initial data
  const data = [
    { type: 1, value: 0.98 },
    { type: 0, value: 0.87 },
    { type: 1, value: 0.82 },
    { type: 1, value: 0.72 },
    { type: 0, value: 0.66 },
    { type: 0, value: 0.53 },
    { type: 0, value: 0.42 },
    { type: 0, value: 0.30 },
    { type: 1, value: 0.25 },
    { type: 0, value: 0.21 },
    { type: 0, value: 0.10 },
    { type: 0, value: 0.01 }
  ];

  let threshold = 0.5;
  const listeners = [];

  // Create SVG container
  const svg = d3.select(selector)
    .append("svg")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.bottom + margin.top}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Create arrow marker for the axis
  svg.append("defs").append("marker")
    .attr("id", "arrowhead")
    .attr("refX", 5)
    .attr("refY", 2)
    .attr("markerWidth", 6)
    .attr("markerHeight", 4)
    .attr("orient", "auto-start-reverse")
    .append("path")
    .attr("d", "M 0,0 V 4 L6,2 Z");

  // Create x scale
  const x = d3.scaleLinear()
    .domain([0, 1])
    .range([0, width]);

  // Create x axis
  const xAxis = d3.axisBottom(x)
    .tickFormat(d3.format(".2f"));

  // Add x axis
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis);

  // Add x axis label
  svg.append("text")
    .attr("transform", `translate(${width/2},${height + 40})`)
    .style("text-anchor", "middle")
    .text("likelihood of raspberry");

  // Add the line with arrows
  svg.append("line")
    .attr("class", "span")
    .attr("x1", x(0))
    .attr("y1", height / 2)
    .attr("x2", x(1))
    .attr("y2", height / 2)
    .attr("marker-end", "url(#arrowhead)")
    .attr("marker-start", "url(#arrowhead)");

  // Add threshold slider
  const thresholdGroup = svg.append("g")
    .attr("class", "threshold")
    .attr("transform", `translate(${x(threshold)},${height/2})`);

  thresholdGroup.append("line")
    .attr("class", "threshold-line")
    .attr("y1", -height/2)
    .attr("y2", height/2);

  thresholdGroup.append("circle")
    .attr("class", "threshold-handle")
    .attr("r", 8)
    .call(d3.drag()
      .on("drag", function(event) {
        const newX = Math.max(0, Math.min(width, event.x));
        threshold = x.invert(newX);
        thresholdGroup.attr("transform", `translate(${newX},${height/2})`);
        renderDataPoints();
        notifyListeners();
      }));

  // Render data points
  function renderDataPoints() {
    const points = svg.selectAll("circle.data-point")
      .data(data);

    points.enter()
      .append("circle")
      .attr("class", "data-point")
      .merge(points)
      .attr("cx", d => x(d.value))
      .attr("cy", height / 2)
      .attr("r", 4)
      .attr("fill", d => d.type === 1 ? "#e74c3c" : "#3498db");

    points.exit().remove();
  }

  function notifyListeners() {
    const metrics = calculateMetrics();
    listeners.forEach(listener => listener(metrics));
  }

  function calculateMetrics() {
    const totalPos = data.filter(d => d.type === 1).length;
    const totalNeg = data.filter(d => d.type === 0).length;
    const tp = data.filter(d => d.type === 1 && d.value >= threshold).length;
    const fp = data.filter(d => d.type === 0 && d.value >= threshold).length;
    const tn = data.filter(d => d.type === 0 && d.value < threshold).length;
    const fn = data.filter(d => d.type === 1 && d.value < threshold).length;

    return {
      sensitivity: (tp / totalPos).toFixed(2),
      specificity: (tn / totalNeg).toFixed(2),
      fpr: (fp / totalNeg).toFixed(2),
      fnr: (fn / totalPos).toFixed(2),
      precision: (tp / (tp + fp)).toFixed(2)
    };
  }

  // Initial render
  renderDataPoints();

  // Return an API for the visualization
  return {
    onThresholdChange: (callback) => {
      listeners.push(callback);
      callback(calculateMetrics()); // Initial call
    }
  };
} 