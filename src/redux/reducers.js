import { UPDATE_ARRAY_COMPARISONS, UPDATE_ARRAY_ACCESSES } from './actions';

const initialState = {
  accesses: 0,
  comparisons: 0,
};

const metricsReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_ARRAY_ACCESSES:
        console.log('Accesses: ', state.accesses + action.payload);
      return {
            ...state,
            accesses: state.accesses + action.payload,
      };
    case UPDATE_ARRAY_COMPARISONS:
        console.log('Comparisons: ', state.comparisons + action.payload);
        return {
            ...state,
            comparisons: state.comparisons + action.payload,
        };
    default:
      return state;
  }
};

export default metricsReducer;
