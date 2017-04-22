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
  payload: { message: '', open: false }
});

export {
  closeDrawer,
  toggleDrawer,
  setDrawerState,
  openPopover,
  closePopover,
  showSnackBar,
  hideSnackBar
};
