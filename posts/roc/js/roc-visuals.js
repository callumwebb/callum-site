
// There will be several visualisations on our page that share the same underlying
// data. This state will be managed by a "berryModel"
var berryModel =  {
  state : [{"type" : 0, "label" : 0},
           {"type" : 0, "label" : 1},
           {"type" : 1, "label" : 1},
           {"type" : 1, "label" : 1},
           {"type" : 1, "label" : 0},
           {"type" : 0, "label" : 0},
           {"type" : 0, "label" : 0},
           {"type" : 0, "label" : 0},
           {"type" : 0, "label" : 1},
           {"type" : 1, "label" : 1},
           {"type" : 0, "label" : 0},
           {"type" : 0, "label" : 1}],
  views: [],
  dragStartFuns: [],
  dragEndFuns: [],
  register : function(callback) {
    this.views.push(callback);
  },
  registerDragStart : function(callback) {
    this.dragStartFuns.push(callback);
  },
  registerDragEnd : function(callback) {
    this.dragEndFuns.push(callback);
  },
  updateViews : function() {
    for (i = 0; i < this.views.length; i++) {
      this.views[i]();
    }
  },
  dragStart : function() {
    for (i = 0; i < this.dragStartFuns.length; i++) {
      this.dragStartFuns[i]();
    }
  },
  dragEnd : function() {
    for (i = 0; i < this.dragEndFuns.length; i++) {
      this.dragEndFuns[i]();
    }
  }
}

// Static dummy output of a classification algorithm before the predicted
// probabilities are made dichotomous
var exampleOutput = {
  state : [{"type" : 1, "value" : 0.98},
           {"type" : 0, "value" : 0.87},
           {"type" : 1, "value" : 0.82},
           {"type" : 1, "value" : 0.72},
           {"type" : 0, "value" : 0.66},
           {"type" : 0, "value" : 0.53},
           {"type" : 0, "value" : 0.42},
           {"type" : 0, "value" : 0.30},
           {"type" : 1, "value" : 0.25},
           {"type" : 0, "value" : 0.21},
           {"type" : 0, "value" : 0.1},
           {"type" : 0, "value" : 0.01}],
  threshold : [0.5],
  views: [],
  register : function(callback) {
    this.views.push(callback)
  },
  updateViews : function() {
    for (i = 0; i < this.views.length; i++) {
      this.views[i]();
    }
  }
}

// Example ROC plot at top of page
var exampleROCPlot = rocPointCurvePlot().showDot(false);
d3.select("figure.rocExample")
  .datum(exampleOutput)
  .call(exampleROCPlot);

var berryPlot = berryClusterPlot(); // Interactive berry plot

// Place our iteractive plot wherever we have berryClasses figures
d3.selectAll("figure.berryClasses")
  .datum(berryModel)
  .call(berryPlot);

// Place our confusion matrix at the berryMatrix figure, and provide a
// callback for the berry model to keep it updated
var confusionMatrix = confusionMatrix(); // Confusion matrix visual
function updateMatrix() {
  d3.select("figure.berryMatrix")
    .datum(berryModel)
    .call(confusionMatrix);
}
berryModel.register(updateMatrix);
updateMatrix();

// The ROC single point plot corresponds to the rocPoint figure
var rocPointPlot = rocPointPlot();
function updateROCPoint() {
  d3.select("figure.rocPoint")
    .datum(berryModel)
    .call(rocPointPlot);
}
berryModel.register(updateROCPoint);
updateROCPoint();

// Example of continuous output plot
var continuousOutputPlot = continuousOutputPlot();
d3.select("figure.berryContPop")
  .datum(exampleOutput)
  .call(continuousOutputPlot);

// discrimination threshold interactive plot
var discrimPlot = discrimPlot();
d3.selectAll("figure.discrimPlot")
  .datum(exampleOutput)
  .call(discrimPlot)

// the ROC plot controlled by discrimPlot
var rocPointCurvePlot = rocPointCurvePlot();
function updateRocPointCurvePlot() {
  d3.select("figure.rocPointCurvePlot")
    .datum(exampleOutput)
    .call(rocPointCurvePlot)
}
exampleOutput.register(updateRocPointCurvePlot);
updateRocPointCurvePlot();

// Static berries, draw once with d3
var berrySize = 16;
var berryMargin = {top: 10, right: 5, bottom: 5, left: 5},
    berryWidth = 200  ,
    berryHeight = 50;
var berryStatic = d3.select("figure.berries")
  .append("svg")
  .attr("viewBox", 0 + " " + 0 + " " + (berryWidth + berryMargin.left + berryMargin.right) +
        " " + (berryHeight + berryMargin.bottom + berryMargin.top))
  .attr("preserveAspectRatio", "xMidYMid meet")
  .append("g")
    .attr("transform", "translate(" + berryMargin.left + "," + berryMargin.top + ")");
berryStatic.append("circle")
  .attr("transform", "translate(" + berryWidth / 4 + "," + berryHeight / 2 + ")")
  .attr("r",  berrySize - 7)
  .attr("class", "raspberry")
berryStatic.append("circle")
  .attr("transform", "translate(" + 3 * berryWidth / 4 + "," + berryHeight / 2 + ")")
  .attr("r",  berrySize - 7)
  .attr("class", "blueberry")
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

// Static berry label examples
var margin = {top: 0, right: 5, bottom: 5, left: 5},
    width = 120,
    height = 120;
var berryStatic = d3.select("figure.berryLabels")
  .append("svg")
  .attr("viewBox", 0 + " " + 0 + " " + (width + margin.left + margin.right) +
        " " + (height + margin.bottom + margin.top))
  .attr("preserveAspectRatio", "xMidYMid meet")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// top left
berryStatic.append("circle")
  .attr("transform", "translate(" + width / 4 + "," + height / 4 + ")")
  .attr("r",  berrySize - 7)
  .attr("class", "raspberry")
berryStatic.append("circle")
  .attr("transform", "translate(" + width / 4 + "," + height / 4 + ")")
  .attr("r",  berrySize).attr("class", "nodeLabel pos");
// top right
berryStatic.append("circle")
  .attr("transform", "translate(" + 3 * width / 4 + "," + height / 4 + ")")
  .attr("r",  berrySize - 7)
  .attr("class", "raspberry")
berryStatic.append("circle")
  .attr("transform", "translate(" + 3 * width / 4 + "," + height / 4 + ")")
  .attr("r",  berrySize).attr("class", "nodeLabel neg");
// bottom left
berryStatic.append("circle")
  .attr("transform", "translate(" + width / 4 + "," + 3 * height / 4 + ")")
  .attr("r",  berrySize - 7)
  .attr("class", "blueberry")
berryStatic.append("circle")
  .attr("transform", "translate(" + width / 4 + "," + 3 * height / 4 + ")")
  .attr("r",  berrySize).attr("class", "nodeLabel pos");
// bottom right
berryStatic.append("circle")
  .attr("transform", "translate(" + 3 * width / 4 + "," + 3 * height / 4 + ")")
  .attr("r",  berrySize - 7)
  .attr("class", "blueberry")
berryStatic.append("circle")
  .attr("transform", "translate(" + 3 * width / 4 + "," + 3 * height / 4 + ")")
  .attr("r",  berrySize).attr("class", "nodeLabel neg");


// Static continuous berry figure 1 of 2
// Static berry label examples
var margin = {top: 0, right: 10, bottom: 50, left: 10},
    width = 400,
    height = 40;
var berryCont = d3.select("figure.berryCont")
  .append("svg")
  .attr("viewBox", 0 + " " + 0 + " " + (width + margin.left + margin.right) +
        " " + (height + margin.bottom + margin.top))
  .attr("preserveAspectRatio", "xMidYMid meet")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// make available arrowhead markers
berryCont.append("defs").append("marker")
  .attr("id", "arrowhead")
  .attr("refX", 5) /*must be smarter way to calculate shift*/
  .attr("refY", 2)
  .attr("markerWidth", 6)
  .attr("markerHeight", 4)
  .attr("orient", "auto-start-reverse")
  .append("path")
      .attr("d", "M 0,0 V 4 L6,2 Z");

var berryContX = d3.scaleLinear().domain([0, 1])
  .range([0, width]);
var berryContXAxis = d3.axisBottom(berryContX)
  // .tickValues([0, 0.25, 0.5, 0.75, 1.0])
  .tickFormat(d3.format(".2f"));
berryCont.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(berryContXAxis);
// text label for the x axis
berryCont.append("text")
  .attr("transform",
        "translate(" + (width/2) + " ," +
                       (height + 40) + ")")
    .style("text-anchor", "middle")
    .text("likelihood of raspberry");
berryCont.append("line")
  .attr("class", "span")
  .attr("x1", berryContX(0))
  .attr("y1", height / 2)
  .attr("x2", berryContX(1))
  .attr("y2", height / 2)
  .attr("marker-end","url(#arrowhead)")
  .attr("marker-start","url(#arrowhead)");
berryCont.append("circle")
  .attr("transform", "translate(" + berryContX(0.32) + "," + height / 2 + ")")
  .attr("r",  berrySize - 7)
  // .attr("class", "unlabelled")
  .attr("class", "blueberry")
