export const updateAlgorithmMetrics = (type, newValue) => {
  return {
    type,
    payload: newValue,
  };
};