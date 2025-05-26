// state.js
export const createStore = (initialState) => {
    let state = initialState;
    const listeners = new Set();
  
    const getState = () => state;
  
    const setState = (newState) => {
      state = { ...state, ...newState };
      listeners.forEach(listener => listener(state));
    };
  
    const subscribe = (listener) => {
      listeners.add(listener);
      listener(state); // optional: fire immediately
      return () => listeners.delete(listener); // unsubscribe
    };
  
    return { getState, setState, subscribe };
  };
  