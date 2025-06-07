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
    const forceClusterStrength = 0.03;
    const alphaActive = 1;
    const alphaInactive = 0.01;
    const alphaDecay = 0.02;
    const velocityDecay = 0.2;

    // Custom force to attract nodes to their label's cluster center
    function forceCluster(alpha) {
        for (let i = 0; i < state.nodes.length; i++) {
            const d = state.nodes[i];
            const center = clusterCenters[d.label];
            d.vx += (center.x - d.x) * alpha * forceClusterStrength;
            d.vy += (center.y - d.y) * alpha * forceClusterStrength;
        }
    }

    // Initialize simulation outside the subscribe callback
    const simulation = d3.forceSimulation()
        .force("cluster", forceCluster)
        .force("collide", d3.forceCollide().radius(berrySize + 3).strength(0.7))
        .alphaDecay(alphaDecay)
        .alphaTarget(alphaInactive)
        .velocityDecay(velocityDecay);
    
    // console.log('Initial simulation alpha:', simulation.alpha());

    // Helper function to reheat simulation
    function reheatSimulation() {
        simulation
            .alpha(1)           // Reset alpha to 1
            .alphaTarget(alphaInactive)
            .restart();
        // console.log('Reheated - alpha:', simulation.alpha());
    }

    // Define drag behavior
    const drag = d3.drag()
        .on("start", (event, d) => {
            if (!event.active) {
                reheatSimulation();
            }
            d.fx = d.x;
            d.fy = d.y;
            // Set global interaction state
            store.setState({ isInteracting: true });
        })
        .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
        })
        .on("end", (event, d) => {
            if (!event.active) {
                simulation.alphaTarget(alphaInactive);
                // console.log('Drag end - alpha:', simulation.alpha());
            }
            d.fx = null;
            d.fy = null;
            // Clear global interaction state
            store.setState({ isInteracting: false });
        });

    let state = store.getState();
    simulation.nodes(state.nodes);

    store.subscribe((newState) => {
        const oldState = state;
        state = newState;
        
        // Check if any labels changed
        const labelsChanged = state.nodes.some((node, i) => 
            oldState.nodes[i] && node.label !== oldState.nodes[i].label
        );

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
                        reheatSimulation();
                        // console.log('Label change - alpha:', simulation.alpha());
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
        
        // Keep simulation active if any instance is being interacted with
        if (state.isInteracting) {
            simulation.alphaTarget(alphaActive);
            // console.log('Interaction - alpha:', simulation.alpha());
        } else if (labelsChanged) {
            reheatSimulation();
        } else {
            simulation.alphaTarget(alphaInactive);
            // console.log('No interaction - alpha:', simulation.alpha());
        }

        // Update node positions on each tick
        simulation.on("tick", () => {
            svg.selectAll(".node")
                .attr("transform", d => `translate(${d.x},${d.y})`);
            
            // Log alpha value every 10 ticks to avoid console spam
            if (Math.random() < 0.1) {  // Log roughly 10% of ticks
                // console.log('Tick - alpha:', simulation.alpha().toFixed(4), 
                //           'target:', simulation.alphaTarget().toFixed(4));
            }
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
