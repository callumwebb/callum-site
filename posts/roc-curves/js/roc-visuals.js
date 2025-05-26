/**
 * ROC Visualization - Main Module
 * Handles the shared state and initializes visualizations
 */

// Berry model to handle shared state between visualizations
const berryModel = {
  state: [
    {"type": 0, "label": 0},
    {"type": 0, "label": 1},
    {"type": 1, "label": 1},
    {"type": 1, "label": 1},
    {"type": 1, "label": 0},
    {"type": 0, "label": 0},
    {"type": 0, "label": 0},
    {"type": 0, "label": 0},
    {"type": 0, "label": 1},
    {"type": 1, "label": 1},
    {"type": 0, "label": 0},
    {"type": 0, "label": 1}
  ],
  views: [],
  dragStartFuns: [],
  dragEndFuns: [],
  
  // Register callbacks for view updates
  register(callback) {
    this.views.push(callback);
  },
  
  // Register callbacks for drag start events
  registerDragStart(callback) {
    this.dragStartFuns.push(callback);
  },
  
  // Register callbacks for drag end events
  registerDragEnd(callback) {
    this.dragEndFuns.push(callback);
  },
  
  // Update all registered views
  updateViews() {
    this.views.forEach(callback => callback());
  },
  
  // Notify drag start
  dragStart() {
    this.dragStartFuns.forEach(callback => callback());
  },
  
  // Notify drag end
  dragEnd() {
    this.dragEndFuns.forEach(callback => callback());
  }
};

// Example classification algorithm output
const exampleOutput = {
  state: [
    {"type": 1, "value": 0.98},
    {"type": 0, "value": 0.87},
    {"type": 1, "value": 0.82},
    {"type": 1, "value": 0.72},
    {"type": 0, "value": 0.66},
    {"type": 0, "value": 0.53},
    {"type": 0, "value": 0.42},
    {"type": 0, "value": 0.30},
    {"type": 1, "value": 0.25},
    {"type": 0, "value": 0.21},
    {"type": 0, "value": 0.10},
    {"type": 0, "value": 0.01}
  ],
  threshold: [0.5],
  views: [],
  
  // Register callbacks
  register(callback) {
    this.views.push(callback);
  },
  
  // Update all registered views
  updateViews() {
    this.views.forEach(callback => callback());
  }
};

// Initialize visualizations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // First ensure all functions are accessible
  // Use the globally exposed functions
  const rocPointCurvePlotFunc = window.rocPointCurvePlot;
  const berryClusterPlotFunc = window.berryClusterPlot;
  const confusionMatrixFunc = window.confusionMatrix;
  const rocPointPlotFunc = window.rocPointPlot;
  const continuousOutputPlotFunc = window.continuousOutputPlot;
  const discrimPlotFunc = window.discrimPlot;
  
  if (!rocPointCurvePlotFunc || !berryClusterPlotFunc || !confusionMatrixFunc || 
      !rocPointPlotFunc || !continuousOutputPlotFunc || !discrimPlotFunc) {
    console.error("Some D3 visualization functions are not available. Check script loading order.");
    return;
  }
  
  // Example ROC plot at top of page
  const exampleROCPlot = rocPointCurvePlotFunc().showDot(false);
  d3.select("figure.rocExample")
    .datum(exampleOutput)
    .call(exampleROCPlot);

  // Interactive berry plot
  const berryPlot = berryClusterPlotFunc();
  d3.selectAll("figure.berryClasses")
    .datum(berryModel)
    .call(berryPlot);

  // Confusion matrix visualization
  const confusionMatrix = confusionMatrixFunc();
  function updateMatrix() {
    d3.select("figure.berryMatrix")
      .datum(berryModel)
      .call(confusionMatrix);
  }
  berryModel.register(updateMatrix);
  updateMatrix();

  // ROC single point plot
  const rocPointPlot = rocPointPlotFunc();
  function updateROCPoint() {
    d3.select("figure.rocPoint")
      .datum(berryModel)
      .call(rocPointPlot);
  }
  berryModel.register(updateROCPoint);
  updateROCPoint();

  // Example of continuous output plot
  const continuousOutputPlot = continuousOutputPlotFunc();
  d3.select("figure.berryContPop")
    .datum(exampleOutput)
    .call(continuousOutputPlot);

  // Discrimination threshold interactive plot
  const discrimPlot = discrimPlotFunc();
  d3.selectAll("figure.discrimPlot")
    .datum(exampleOutput)
    .call(discrimPlot);

  // ROC curve plot controlled by discrimination threshold
  const rocPointCurvePlot = rocPointCurvePlotFunc();
  function updateRocPointCurvePlot() {
    d3.select("figure.rocPointCurvePlot")
      .datum(exampleOutput)
      .call(rocPointCurvePlot);
  }
  exampleOutput.register(updateRocPointCurvePlot);
  updateRocPointCurvePlot();

  // Static berries visualization
  const berrySize = 16;
  const berryMargin = {top: 10, right: 5, bottom: 5, left: 5};
  const berryWidth = 200;
  const berryHeight = 50;
  
  const berryStatic = d3.select("figure.berries")
    .append("svg")
    .attr("viewBox", `0 0 ${berryWidth + berryMargin.left + berryMargin.right} ${berryHeight + berryMargin.bottom + berryMargin.top}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
      .attr("transform", `translate(${berryMargin.left},${berryMargin.top})`);
  
  berryStatic.append("circle")
    .attr("transform", `translate(${berryWidth / 4},${berryHeight / 2})`)
    .attr("r", berrySize - 7)
    .attr("class", "raspberry");
  
  berryStatic.append("circle")
    .attr("transform", `translate(${3 * berryWidth / 4},${berryHeight / 2})`)
    .attr("r", berrySize - 7)
    .attr("class", "blueberry");
  
  berryStatic.append("text")
    .attr("x", berryWidth / 4)
    .attr("y", 5)
    .style("font-weight", "bold")
    .style("text-anchor", "middle")
    .style("alignment-baseline", "bottom")
    .text("+");
  
  berryStatic.append("text")
    .attr("x", 3 * berryWidth / 4)
    .attr("y", 5)
    .style("font-weight", "bold")
    .style("text-anchor", "middle")
    .style("alignment-baseline", "bottom")
    .text("−");

  // Static berry labels example
  const margin = {top: 0, right: 5, bottom: 5, left: 5};
  const width = 120;
  const height = 120;
  
  const berryLabelsStatic = d3.select("figure.berryLabels")
    .append("svg")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.bottom + margin.top}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  // Top left - true positive
  berryLabelsStatic.append("circle")
    .attr("transform", `translate(${width / 4},${height / 4})`)
    .attr("r", berrySize - 7)
    .attr("class", "raspberry");
  
  berryLabelsStatic.append("circle")
    .attr("transform", `translate(${width / 4},${height / 4})`)
    .attr("r", berrySize)
    .attr("class", "nodeLabel pos");
  
  // Top right - false negative
  berryLabelsStatic.append("circle")
    .attr("transform", `translate(${3 * width / 4},${height / 4})`)
    .attr("r", berrySize - 7)
    .attr("class", "raspberry");
  
  berryLabelsStatic.append("circle")
    .attr("transform", `translate(${3 * width / 4},${height / 4})`)
    .attr("r", berrySize)
    .attr("class", "nodeLabel neg");
  
  // Bottom left - false positive
  berryLabelsStatic.append("circle")
    .attr("transform", `translate(${width / 4},${3 * height / 4})`)
    .attr("r", berrySize - 7)
    .attr("class", "blueberry");
  
  berryLabelsStatic.append("circle")
    .attr("transform", `translate(${width / 4},${3 * height / 4})`)
    .attr("r", berrySize)
    .attr("class", "nodeLabel pos");
  
  // Bottom right - true negative
  berryLabelsStatic.append("circle")
    .attr("transform", `translate(${3 * width / 4},${3 * height / 4})`)
    .attr("r", berrySize - 7)
    .attr("class", "blueberry");
  
  berryLabelsStatic.append("circle")
    .attr("transform", `translate(${3 * width / 4},${3 * height / 4})`)
    .attr("r", berrySize)
    .attr("class", "nodeLabel neg");

  // Static continuous berry figure
  const contMargin = {top: 0, right: 10, bottom: 50, left: 10};
  const contWidth = 400;
  const contHeight = 40;
  
  const berryCont = d3.select("figure.berryCont")
    .append("svg")
    .attr("viewBox", `0 0 ${contWidth + contMargin.left + contMargin.right} ${contHeight + contMargin.bottom + contMargin.top}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
      .attr("transform", `translate(${contMargin.left},${contMargin.top})`);

  // Create arrowhead marker
  berryCont.append("defs").append("marker")
    .attr("id", "arrowhead")
    .attr("refX", 5)
    .attr("refY", 2)
    .attr("markerWidth", 6)
    .attr("markerHeight", 4)
    .attr("orient", "auto-start-reverse")
    .append("path")
      .attr("d", "M 0,0 V 4 L6,2 Z");

  // Scale for continuum
  const berryContX = d3.scaleLinear()
    .domain([0, 1])
    .range([0, contWidth]);
  
  const berryContXAxis = d3.axisBottom(berryContX)
    .tickFormat(d3.format(".2f"));
  
  berryCont.append("g")
    .attr("transform", `translate(0,${contHeight})`)
    .call(berryContXAxis);
  
  // X-axis label
  berryCont.append("text")
    .attr("transform", `translate(${contWidth/2},${contHeight + 40})`)
    .style("text-anchor", "middle")
    .text("likelihood of raspberry");
  
  // Horizontal line with arrows
  berryCont.append("line")
    .attr("class", "span")
    .attr("x1", berryContX(0))
    .attr("y1", contHeight / 2)
    .attr("x2", berryContX(1))
    .attr("y2", contHeight / 2)
    .attr("marker-end", "url(#arrowhead)")
    .attr("marker-start", "url(#arrowhead)");
  
  // Example berry
  berryCont.append("circle")
    .attr("transform", `translate(${berryContX(0.32)},${contHeight / 2})`)
    .attr("r", berrySize - 7)
    .attr("class", "blueberry");
});