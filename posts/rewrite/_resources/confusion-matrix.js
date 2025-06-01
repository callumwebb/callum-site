/**
 * Confusion Matrix Visualization
 * Displays a 2x2 matrix showing True/False Positive/Negative counts
 */

import { store } from "./main.js";

export function renderConfusionMatrix(containerId) {
    const margin = { top: 50, right: 10, bottom: 10, left: 80 };
    const width = 150;
    const height = 130;
    
    const container = d3.select(containerId);
    const svg = container.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
    
    // Add the main group with margins
    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Add static elements
    // Matrix outline
    g.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "none")
        .attr("stroke", "black");

    // Dividing lines
    g.append("line")
        .attr("x1", width/2)
        .attr("y1", 0)
        .attr("x2", width/2)
        .attr("y2", height)
        .attr("stroke", "black")
        .attr("stroke-dasharray", "5,5");
    
    g.append("line")
        .attr("x1", 0)
        .attr("y1", height/2)
        .attr("x2", width)
        .attr("y2", height/2)
        .attr("stroke", "black")
        .attr("stroke-dasharray", "5,5");

    // Column headers (predicted)
    g.append("text")
        .attr("x", width/2)
        .attr("y", -3*margin.top/4)
        .attr("text-anchor", "middle")
        .text("predicted");
    
    g.append("text")
        .attr("x", width/4)
        .attr("y", -margin.top/4)
        .attr("text-anchor", "middle")
        .attr("font-weight", "bold")
        .attr("class", "raspberry-text")
        .text("+");
    
    g.append("text")
        .attr("x", 3*width/4)
        .attr("y", -margin.top/4)
        .attr("text-anchor", "middle")
        .attr("font-weight", "bold")
        .attr("class", "blueberry-text")
        .text("−");

    // Row headers (actual)
    g.append("text")
        .attr("x", -2*margin.left/3)
        .attr("y", height/2)
        .attr("text-anchor", "middle")
        .text("actual");
    
    g.append("text")
        .attr("x", -margin.left/4)
        .attr("y", height/4)
        .attr("text-anchor", "middle")
        .attr("font-weight", "bold")
        .attr("class", "raspberry-text")
        .text("+");
    
    g.append("text")
        .attr("x", -margin.left/4)
        .attr("y", 3*height/4)
        .attr("text-anchor", "middle")
        .attr("font-weight", "bold")
        .attr("class", "blueberry-text")
        .text("−");

    // Create containers for the four values
    const cells = g.append("g")
        .attr("class", "matrix-values");
    
    ["tp", "fp", "fn", "tn"].forEach(key => {
        cells.append("text")
            .attr("class", key)
            .attr("text-anchor", "middle");
    });

    // Update function to calculate and display confusion matrix values
    function updateMatrix(state) {
        const counts = state.nodes.reduce((acc, node) => {
            const key = node.type === 1 
                ? (node.label === 1 ? "tp" : "fn")
                : (node.label === 1 ? "fp" : "tn");
            acc[key]++;
            return acc;
        }, { tp: 0, fp: 0, fn: 0, tn: 0 });

        // Position and update the values
        cells.select(".tp")
            .attr("x", width/4)
            .attr("y", height/4)
            .text(counts.tp);
        
        cells.select(".fp")
            .attr("x", width/4)
            .attr("y", 3*height/4)
            .text(counts.fp);
        
        cells.select(".fn")
            .attr("x", 3*width/4)
            .attr("y", height/4)
            .text(counts.fn);
        
        cells.select(".tn")
            .attr("x", 3*width/4)
            .attr("y", 3*height/4)
            .text(counts.tn);
    }

    // Initial render
    updateMatrix(store.getState());

    // Subscribe to state changes
    store.subscribe(updateMatrix);
} 