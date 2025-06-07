import { store } from "./main.js";

export function initializeMetricDisplay() {
    function updateMetrics(state) {
        // Calculate confusion matrix values
        const counts = state.nodes.reduce((acc, node) => {
            const key = node.type === 1 
                ? (node.label === 1 ? "tp" : "fn")
                : (node.label === 1 ? "fp" : "tn");
            acc[key]++;
            return acc;
        }, { tp: 0, fp: 0, fn: 0, tn: 0 });

        // Helper function to format metric as "fraction (decimal)"
        function formatMetric(numerator, denominator) {
            const decimal = denominator === 0 ? 0 : numerator / denominator;
            return `${numerator}/${denominator} (${decimal.toFixed(2)})`;
        }

        // Calculate and format metrics
        const sensitivity = formatMetric(counts.tp, counts.tp + counts.fn);
        const specificity = formatMetric(counts.tn, counts.tn + counts.fp);
        const fpr = formatMetric(counts.fp, counts.fp + counts.tn);
        const fnr = formatMetric(counts.fn, counts.tp + counts.fn);
        const precision = formatMetric(counts.tp, counts.tp + counts.fp);

        // Update the display
        document.getElementById("sensitivity").textContent = sensitivity;
        document.getElementById("specificity").textContent = specificity;
        document.getElementById("fpr").textContent = fpr;
        document.getElementById("fnr").textContent = fnr;
        document.getElementById("precision").textContent = precision;
    }

    // Initial render
    updateMetrics(store.getState());

    // Subscribe to state changes
    store.subscribe(updateMetrics);
} 