const initialState = {
  drawer: {
    open: false
  },
  snackBar: {
    open: false,
    message: ''
  },
  popOver: {}
};

const materialUi = (state = initialState, action) => {
  switch (action.type) {
    case 'CLOSE_DRAWER':
      return {
        ...state,
        drawer: {
          open: false
        }
      };
    case 'TOGGLE_DRAWER':
      return {
        ...state,
        drawer: {
          open: !state.drawer.open
        }
      };
    case 'SET_DRAWER_STATE':
      return {
        ...state,
        drawer: {
          ...state.drawer,
          ...action.payload
        }
      };
    case 'OPEN_POPOVER':
    case 'CLOSE_POPOVER':
      return {
        ...state,
        popOver: {
          ...state.popOver,
          ...action.payload
        }
      };
    case 'SHOW_SNACKBAR':
    case 'HIDE_SNACKBAR':
      return {
        ...state,
        snackBar: {
          ...state.snackBar,
          ...action.payload
        }
      };
    default:
      return state;
  }
};

export default materialUi;
