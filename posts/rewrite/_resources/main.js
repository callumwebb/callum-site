// main.js
import { createStore } from './state.js';
import { renderClusterView } from './cluster-view.js';
import { renderConfusionMatrix } from './confusion-matrix.js';
import { renderRocCurve } from './roc-curve.js';
import { initializeMetricDisplay } from './metric-display.js';
import { createDiscriminationStore } from './discrimination-state.js';
import { renderContinuousOutputPlot } from './continuous-output-plot.js';
import { renderDiscriminationPlot } from './discrimination-plot.js';

// Create shared store for cluster view
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

// Create separate store for discrimination threshold visualizations
export const discriminationStore = createDiscriminationStore();

// Render cluster view visualizations
renderClusterView("#clusters");
renderConfusionMatrix("#confusion");
renderRocCurve("#roc");
renderClusterView("#clusters-small", { scale: 0.8 });
initializeMetricDisplay();

// Render discrimination threshold visualizations
renderContinuousOutputPlot("#continuous-output", discriminationStore);
renderDiscriminationPlot("#discrimination-plot", discriminationStore);
