// discrimination-plot.js
export function renderDiscriminationPlot(selector, store) {
  const margin = { top: 10, right: 10, bottom: 50, left: 10 };
  const width = 400;
  const height = 40;
  const berrySize = 5;

  // Create container div and add slider
  const container = d3.select(selector);
  
  // Create SVG container
  const svg = container
    .append("svg")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.bottom + margin.top}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Create scales
  const xScale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, width])
    .clamp(true);

  // Create axis
  const xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.format(".2f"));

  // Add axis to SVG
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis);

  // Add threshold line
  const thresholdLine = svg.append("line")
    .attr("class", "threshold")
    .attr("y1", 0)
    .attr("y2", height)
    .style("stroke", "#e03131")
    .style("stroke-width", 2)
    .style("stroke-dasharray", "4,4");

  // Add slider
  const sliderContainer = container
    .append("div")
    .style("width", "100%")
    .style("padding", "0 10px")
    .style("margin-top", "-30px");  // Move slider up closer to the plot

  const slider = sliderContainer
    .append("input")
    .attr("type", "range")
    .attr("min", 0)
    .attr("max", 100)  // Use 0-100 for better precision than 0-1
    .attr("value", store.getState().threshold * 100)
    .style("width", "100%");

  // Update threshold when slider moves
  slider.on("input", function() {
    const threshold = +this.value / 100;  // Convert back to 0-1 range
    store.setThreshold(threshold);
  });

  function update(state) {
    // Update threshold line
    const x = xScale(state.threshold);
    thresholdLine
      .attr("x1", x)
      .attr("x2", x);

    // Update slider value if it was changed programmatically
    if (+slider.node().value !== state.threshold * 100) {
      slider.node().value = state.threshold * 100;
    }

    // Update label circles (outer)
    const labelCircles = svg.selectAll(".nodeLabel")
      .data(state.nodes);

    labelCircles.exit().remove();

    labelCircles.enter()
      .append("circle")
      .merge(labelCircles)
      .attr("class", d => d.value >= state.threshold ? "nodeLabel pos" : "nodeLabel neg")
      .attr("r", 12)
      .attr("cx", d => xScale(d.value))
      .attr("cy", height/2);

    // Update berry circles (inner)
    const berryCircles = svg.selectAll(".berry")
      .data(state.nodes);

    berryCircles.exit().remove();

    berryCircles.enter()
      .append("circle")
      .merge(berryCircles)
      .attr("class", d => d.type === 1 ? "berry raspberry" : "berry blueberry")
      .attr("r", berrySize)
      .attr("cx", d => xScale(d.value))
      .attr("cy", height/2);
  }

  // Initial render
  update(store.getState());

  // Subscribe to state changes
  store.subscribe(update);
} 