const initialState = {
  initialized: false
};

const d3Reducers = (state = initialState, action) => {
  switch (action.type) {
    case 'D3_INITIALIZED':
      return {
        ...state,
        initialized: true
      };
    case 'D3_DESTROYED':
      return {
        ...state,
        initialized: false
      };
    default:
      return state;
  }
};

export default d3Reducers;
