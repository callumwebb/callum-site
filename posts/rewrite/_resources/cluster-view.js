/**
 * Berry Cluster Visualization
 * Interactive visualization of berries that can be labeled
 */

import { store } from "./main.js";

export function renderClusterView(containerId, options = {}) {
    const scale = options.scale || 1;
    const baseWidth = 400;
    const baseHeight = 190;
    
    const container = d3.select(containerId);
    const svg = container.append("svg")
        .attr("width", baseWidth * scale)
        .attr("height", baseHeight * scale)
        .attr("viewBox", `0 0 ${baseWidth} ${baseHeight}`)
        .attr("preserveAspectRatio", "xMidYMid meet");
    
    // Define cluster centers
    const clusterCenters = [
        {x: 100, y: 100},  // Left center for label 0
        {x: 300, y: 100}   // Right center for label 1
    ];

    const berrySize = 16; // default berry (outermost circle) size
    const forceClusterStrength = 0.03;  // Reduced from 0.05

    // Custom force to attract nodes to their label's cluster center
    function forceCluster(alpha) {
        for (let i = 0; i < state.nodes.length; i++) {
            const d = state.nodes[i];
            const center = clusterCenters[d.label];
            d.vx += (center.x - d.x) * alpha * 0.05;  // Reduced from 0.1
            d.vy += (center.y - d.y) * alpha * 0.05;
        }
    }

    // Initialize simulation outside the subscribe callback
    const simulation = d3.forceSimulation()
        .force("cluster", forceCluster)
        .force("collide", d3.forceCollide().radius(berrySize + 3).strength(0.7))
        .alphaDecay(0.02)
        .alphaTarget(0.001)
        .velocityDecay(0.07);

    // Define drag behavior
    const drag = d3.drag()
        .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        })
        .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
        })
        .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        });

    let state = store.getState();
    simulation.nodes(state.nodes);

    store.subscribe((newState) => {
        state = newState;
        
        const nodes = svg.selectAll(".node")
            .data(state.nodes, (d, i) => i);

        // Create/update nodes
        const nodeGroups = nodes.join(
            enter => {
                const g = enter.append("g")
                    .attr("class", "node")
                    .attr("transform", d => `translate(${d.x},${d.y})`)
                    .style("cursor", "pointer")
                    .call(drag)  // Enable dragging
                    .on("click", (event, d) => {  // Add click handler
                        // Toggle the label
                        const updatedNodes = state.nodes.map(node => 
                            node === d ? { ...node, label: 1 - node.label } : node
                        );
                        store.setState({ nodes: updatedNodes });
                    });
                
                g.append("circle")
                    .attr("r", berrySize - 7)
                    .attr("class", d => d.type === 1 ? "raspberry" : "blueberry");

                g.append("circle")
                    .attr("r", berrySize)
                    .attr("class", d => d.label === 1 ? "nodeLabel pos" : "nodeLabel neg");

                return g;
            },
            update => {
                update.select(".nodeLabel")
                    .attr("class", d => d.label === 1 ? "nodeLabel pos" : "nodeLabel neg");
                return update;
            }
        );

        // Update simulation with new data
        simulation.nodes(state.nodes);
        simulation.alpha(0.3).restart();

        // Update node positions on each tick
        simulation.on("tick", () => {
            svg.selectAll(".node")
                .attr("transform", d => `translate(${d.x},${d.y})`);
        });
    });

    // Add cluster labels
    svg.append("text")
        .attr("x", clusterCenters[0].x)
        .attr("y", clusterCenters[0].y - 85)
        .attr("text-anchor", "middle")
        .text("blueberries");

    svg.append("text")
        .attr("x", clusterCenters[1].x)
        .attr("y", clusterCenters[1].y - 85)
        .attr("text-anchor", "middle")
        .text("raspberries");
}
