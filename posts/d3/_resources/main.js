// main.js
import { createStore } from './state.js';
import { renderGraph1 } from './graph1.js';
import { renderGraph2 } from './graph2.js';

// Create shared store
export const store = createStore({
  nodes: [{ id: "A" }, { id: "B" }, { id: "C" }],
  selectedNodes: []  // Start with no selected nodes
});

// Render graphs
renderGraph1("#viz1");
renderGraph2("#viz2");
