// discrimination-plot.js
export function renderDiscriminationPlot(selector, store) {
  const margin = { top: 10, right: 10, bottom: 50, left: 10 };
  const width = 400;
  const height = 100;
  const berrySize = 5;

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
    .text("threshold");

  // Add threshold line
  const thresholdLine = svg.append("line")
    .attr("class", "threshold")
    .attr("y1", 0)
    .attr("y2", height)
    .style("stroke", "red")
    .style("stroke-width", 2)
    .style("stroke-dasharray", "4,4");

  // Add threshold handle
  const handle = svg.append("circle")
    .attr("class", "handle")
    .attr("r", 8)
    .attr("cy", height)
    .style("fill", "red")
    .style("cursor", "pointer");

  // Add drag behavior
  const drag = d3.drag()
    .on("drag", function(event) {
      const x = Math.max(0, Math.min(width, event.x));
      const threshold = xScale.invert(x);
      store.setThreshold(threshold);
    });

  handle.call(drag);

  function update(state) {
    // Update threshold line and handle
    const x = xScale(state.threshold);
    thresholdLine.attr("x1", x).attr("x2", x);
    handle.attr("cx", x);

    // Update berries
    const berries = svg.selectAll(".berry")
      .data(state.nodes);

    // Remove old berries
    berries.exit().remove();

    // Add new berries
    berries.enter()
      .append("circle")
      .attr("class", "berry")
      .merge(berries)
      .attr("r", berrySize)
      .attr("transform", d => `translate(${xScale(d.value)},${height/2})`)
      .attr("class", d => {
        const isPositive = d.value >= state.threshold;
        const isRaspberry = d.type === 1;
        if (isRaspberry) {
          return isPositive ? "raspberry" : "raspberry misclassified";
        } else {
          return isPositive ? "blueberry misclassified" : "blueberry";
        }
      });
  }

  // Initial render
  update(store.getState());

  // Subscribe to state changes
  store.subscribe(update);
} 