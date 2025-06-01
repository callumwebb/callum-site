/**
 * ROC Curve Visualization
 * Displays True Positive Rate vs False Positive Rate
 */

import { store } from "./main.js";

export function renderRocCurve(containerId) {
    const margin = { top: 10, right: 10, bottom: 60, left: 60 };
    const width = 200;
    const height = 200;
    
    const container = d3.select(containerId);
    const svg = container.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
    
    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Create scales
    const x = d3.scaleLinear()
        .domain([0, 1])
        .range([0, width]);
    
    const y = d3.scaleLinear()
        .domain([0, 1])
        .range([height, 0]);
    
    // Add axes
    g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x)
            .tickValues([0, 0.25, 0.5, 0.75, 1.0])
            .tickFormat(d3.format(".2f")));
    
    g.append("g")
        .call(d3.axisLeft(y)
            .tickValues([0, 0.25, 0.5, 0.75, 1.0])
            .tickFormat(d3.format(".2f")));
    
    // Add axis labels
    g.append("text")
        .attr("transform", `translate(${width/2},${height + 40})`)
        .attr("text-anchor", "middle")
        .text("false positive rate");
    
    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -height/2)
        .attr("text-anchor", "middle")
        .text("true positive rate");
    
    // Add diagonal reference line
    g.append("line")
        .attr("x1", x(0))
        .attr("y1", y(0))
        .attr("x2", x(1))
        .attr("y2", y(1))
        .attr("class", "reference-line");
    
    // Add container for the current point
    const point = g.append("circle")
        .attr("class", "current-point")
        .attr("r", 4);
    
    function updateRocCurve(state) {
        // Calculate current rates
        const currentRates = state.nodes.reduce((acc, n) => {
            if (n.type === 1) {
                n.label === 1 ? acc.tp++ : acc.fn++;
            } else {
                n.label === 1 ? acc.fp++ : acc.tn++;
            }
            return acc;
        }, { tp: 0, fp: 0, tn: 0, fn: 0 });
        
        const tpr = currentRates.tp / (currentRates.tp + currentRates.fn);
        const fpr = currentRates.fp / (currentRates.fp + currentRates.tn);
        
        point
            .transition()
            .duration(200)
            .ease(d3.easeQuadInOut)  // Smooth acceleration and deceleration
            .attr("cx", x(fpr))
            .attr("cy", y(tpr));
    }
    
    // Initial render
    updateRocCurve(store.getState());
    
    // Subscribe to state changes
    store.subscribe(updateRocCurve);
} 