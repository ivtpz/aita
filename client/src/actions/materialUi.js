const closeDrawer = () => ({ type: 'CLOSE_DRAWER' });

const toggleDrawer = () => ({ type: 'TOGGLE_DRAWER' });

const openPopover = (popoverName, anchor) => ({
  type: 'OPEN_POPOVER',
  payload: {
    [popoverName]: true,
    anchor
  }
});

const closePopover = popoverName => ({
  type: 'CLOSE_POPOVER',
  payload: {
    [popoverName]: false,
    anchor: null
  }
});

const setDrawerState = open => ({
  type: 'SET_DRAWER_STATE',
  payload: { open }
});

const showSnackBar = (message, options) => ({
  type: 'SHOW_SNACKBAR',
  payload: { message, open: true, ...options }
});

const hideSnackBar = () => ({
  type: 'HIDE_SNACKBAR',
  payload: { message: '', open: false, action: null, onActionTap: null }
});

const updateD3YearSlider = value => ({
  type: 'UPDATE_D3_YEAR_SLIDER',
  payload: { value }
});

const setSliderDrag = dragging => ({
  type: 'SET_SLIDER_DRAG',
  payload: { dragging }
});

export {
  closeDrawer,
  toggleDrawer,
  setDrawerState,
  openPopover,
  closePopover,
  showSnackBar,
  hideSnackBar,
  updateD3YearSlider,
  setSliderDrag
};
