const initialState = {
  scrollY: undefined
};

const windowReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SCROLL_LOCATION':
      return {
        ...state,
        ...action
      };
    default:
      return state;
  }
};

export default windowReducer;
