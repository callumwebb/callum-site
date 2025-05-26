// graph1.js
import { store } from './main.js';

export function renderGraph1(containerId) {
  const container = d3.select(containerId);
  const svg = container.append("svg").attr("width", 300).attr("height", 200);

  // Subscribe to state updates
  store.subscribe((state) => {
    const selectedNodes = state.selectedNodes;  // An array of selected nodes

    // Bind nodes
    const circles = svg.selectAll("circle")
      .data(state.nodes, d => d.id);

    // Enter + update
    circles.join("circle")
      .attr("r", 10)
      .attr("cx", (d, i) => 30 + i * 50)
      .attr("cy", 100)
      .attr("fill", d => selectedNodes.includes(d.id) ? "yellow" : "steelblue")
      .on("click", (event, d) => {
        // Toggle the selected node
        const isSelected = selectedNodes.includes(d.id);
        const newSelectedNodes = isSelected
          ? selectedNodes.filter(id => id !== d.id)  // Remove from the selection
          : [...selectedNodes, d.id];                // Add to the selection
        store.setState({ selectedNodes: newSelectedNodes });
      });
  });
}
