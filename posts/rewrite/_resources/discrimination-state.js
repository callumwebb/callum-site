// discrimination-state.js
export function createDiscriminationStore(initialState = {}) {
  const state = {
    nodes: [
      { type: 1, value: 0.98 },
      { type: 0, value: 0.87 },
      { type: 1, value: 0.82 },
      { type: 1, value: 0.72 },
      { type: 0, value: 0.66 },
      { type: 0, value: 0.53 },
      { type: 0, value: 0.42 },
      { type: 0, value: 0.30 },
      { type: 1, value: 0.25 },
      { type: 0, value: 0.21 },
      { type: 0, value: 0.10 },
      { type: 0, value: 0.01 }
    ],
    threshold: 0.5,
    ...initialState
  };

  const listeners = new Set();

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const notify = () => {
    listeners.forEach(listener => listener(state));
  };

  const setThreshold = (newThreshold) => {
    state.threshold = newThreshold;
    notify();
  };

  return {
    getState: () => state,
    subscribe,
    setThreshold
  };
} 