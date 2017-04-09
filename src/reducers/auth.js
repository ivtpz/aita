const initialState = {
  lockInitialized: false,
  lockVisible: false
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case 'AUTH_LOCK_INITIALIZED':
      return {
        ...state,
        lockInitialized: true
      };
    case 'AUTH_LOCK_HIDDEN':
      return {
        ...state,
        lockVisible: false
      };
    case 'AUTH_LOCK_VISIBLE':
      return {
        ...state,
        lockVisible: true
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        error: action.error
      };
    default:
      return state;
  }
};

export default auth;
