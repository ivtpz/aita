const initialState = {
  open: false
};

const drawer = (state = initialState, action) => {
  switch (action.type) {
    case 'CLOSE_DRAWER':
      return {
        ...state,
        open: false
      };
    case 'TOGGLE_DRAWER':
      return {
        ...state,
        open: !state.open
      };
    case 'SET_DRAWER_STATE':
      return {
        ...state,
        ...action
      };
    default:
      return state;
  }
};

export default drawer;
