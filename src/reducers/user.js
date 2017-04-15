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
    case 'REMOVE_REFERENCE': {
      const index = state.references.indexOf(action.refId);
      const references = [...state.references];
      references.splice(index, 1);
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
