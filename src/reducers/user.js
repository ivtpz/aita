const initialState = {};

const user = (state = initialState, action) => {
  switch (action.type) {
    case 'RECEIVE_USER_DATA':
      return {
        ...state,
        ...action.payload
      };
    case 'ADD_REFERENCE': {
      const references = state.references.concat(action.refId);
      return {
        ...state,
        references
      };
    }
    default:
      return state;
  }
};

export default user;
