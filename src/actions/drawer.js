const closeDrawer = () => ({ type: 'CLOSE_DRAWER' });

const toggleDrawer = () => ({ type: 'TOGGLE_DRAWER' });

const setDrawerState = open => ({
  type: 'SET_DRAWER_STATE',
  open
});

export {
  closeDrawer,
  toggleDrawer,
  setDrawerState
};
