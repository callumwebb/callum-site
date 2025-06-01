// graph2.js
import { store } from './main.js';

export function renderGraph2(containerId) {
  const container = d3.select(containerId);
  const info = container.append("div");

  store.subscribe((state) => {
    if (state.selectedNodes.length === 0) {
      info.text("No nodes selected");
    } else {
      const nodeInfo = state.selectedNodes.map(node => 
        `Node(type=${node.type}, label=${node.label})`
      ).join(", ");
      info.text(`Selected: ${nodeInfo}`);
    }
  });
}
