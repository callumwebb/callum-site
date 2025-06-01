// graph1.js
import { store } from './main.js';

export function renderGraph1(containerId) {
  const container = d3.select(containerId);
  const svg = container.append("svg").attr("width", 800).attr("height", 200);

  // Subscribe to state updates
  store.subscribe((state) => {
    const selectedNodes = state.selectedNodes;

    // Bind nodes
    const circles = svg.selectAll("circle")
      .data(state.nodes, (d, i) => i); // Use index as key since we don't have IDs anymore

    // Enter + update
    circles.join("circle")
      .attr("r", 10)
      .attr("cx", (d, i) => 30 + i * 50)
      .attr("cy", 100)
      .attr("fill", d => {
        if (selectedNodes.includes(d)) return "yellow";
        return d.type === 1 ? "salmon" : "steelblue";
      })
      .on("click", (event, d) => {
        // Toggle the selected node
        const isSelected = selectedNodes.includes(d);
        const newSelectedNodes = isSelected
          ? selectedNodes.filter(node => node !== d)  // Remove from selection
          : [...selectedNodes, d];                    // Add to selection
        store.setState({ selectedNodes: newSelectedNodes });
      });

    // Add labels showing type and label
    const labels = svg.selectAll("text")
      .data(state.nodes, (d, i) => i);

    labels.join("text")
      .attr("x", (d, i) => 30 + i * 50)
      .attr("y", 130)
      .attr("text-anchor", "middle")
      .text(d => `${d.type},${d.label}`);
  });
}
