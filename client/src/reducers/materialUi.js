const initialState = {
  drawer: {
    open: false
  },
  snackBar: {
    open: false,
    message: ''
  },
  popOver: {},
  slider: {
    value: new Date().getFullYear(),
    dragging: false
  }
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
    case 'UPDATE_D3_YEAR_SLIDER':
    case 'SET_SLIDER_DRAG':
      return {
        ...state,
        slider: {
          ...state.slider,
          ...action.payload
        }
      };
    default:
      return state;
  }
};

export default materialUi;
