// main.js
import { createStore } from './state.js';
import { renderClusterView } from './cluster-view.js';
import { renderConfusionMatrix } from './confusion-matrix.js';
import { renderRocCurve } from './roc-curve.js';

// Create shared store
export const store = createStore({
  nodes: [
    { type: 0, label: 0 },
    { type: 0, label: 1 },
    { type: 1, label: 1 },
    { type: 1, label: 1 },
    { type: 1, label: 0 },
    { type: 0, label: 0 },
    { type: 0, label: 0 },
    { type: 0, label: 0 },
    { type: 0, label: 1 },
    { type: 1, label: 1 },
    { type: 0, label: 0 },
    { type: 0, label: 1 }
  ]
});

// Render visualizations
renderClusterView("#clusters");
renderConfusionMatrix("#confusion");
renderRocCurve("#roc");
renderClusterView("#clusters-small", { scale: 0.8 });
