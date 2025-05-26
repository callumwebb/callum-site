// graph2.js
import { store } from './main.js';

export function renderGraph2(containerId) {
  const container = d3.select(containerId);
  const info = container.append("div");

  store.subscribe((state) => {
    info.text(state.selectedNode
      ? `You selected node: ${state.selectedNode}`
      : "No node selected");
  });
}
