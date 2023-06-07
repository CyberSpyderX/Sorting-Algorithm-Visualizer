import { UPDATE_ARRAY_COMPARISONS, UPDATE_ARRAY_ACCESSES, RESET } from './actions';

const initialState = {
  accesses: 0,
  comparisons: 0,
};

const metricsReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_ARRAY_ACCESSES:
      return {
            ...state,
            accesses: state.accesses + action.payload,
      };
    case UPDATE_ARRAY_COMPARISONS:
        return {
            ...state,
            comparisons: state.comparisons + action.payload,
        };
    case RESET:
      return {
        ...initialState
      }
    default:
      return state;
  }
};

export default metricsReducer;
