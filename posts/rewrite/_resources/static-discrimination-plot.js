// static-discrimination-plot.js
export function renderStaticDiscriminationPlot(selector) {
  const margin = { top: 10, right: 10, bottom: 50, left: 10 };
  const width = 400;
  const height = 40;  // Changed to match continuous output plot
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

  // Static data
  const berries = [
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

  // Add berries
  svg.selectAll(".berry")
    .data(berries)
    .enter()
    .append("circle")
    .attr("class", d => d.type === 1 ? "raspberry" : "blueberry")
    .attr("r", berrySize)
    .attr("transform", d => `translate(${xScale(d.value)},${height/2})`);
} 