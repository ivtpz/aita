const initialState = {
  email: null,
  recommendations: [],
  visibleReferences: [],
  references: []
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case 'RECEIVE_USER_DATA':
      return {
        ...state,
        ...action.payload,
        visibleReferences: action.payload.referenceData || []
      };
    case 'ADD_REFERENCE': {
      const references = [...state.references, action.refId];
      const referenceData = [...state.referenceData, action.data];
      return {
        ...state,
        references,
        referenceData
      };
    }
    case 'REMOVE_REFERENCE': {
      const index = state.references.indexOf(action.refId);
      const references = [...state.references];
      const referenceData = [...state.referenceData];
      references.splice(index, 1);
      referenceData.splice(index, 1);
      return {
        ...state,
        references,
        referenceData
      };
    }
    case 'FILTER_REFERENCES':
      return {
        ...state,
        visibleReferences: state.referenceData.filter(r =>
          r.title.toLowerCase().includes(action.query) ||
          (Array.isArray(r.author) && r.author.filter(a => a.name.toLowerCase().includes(action.query)).length) ||
          (!Array.isArray(r.author) && r.author.name.toLowerCase().includes(action.query))
        )
      };
    case 'MAKE_ALL_REFS_VISIBLE':
      return {
        ...state,
        visibleReferences: state.referenceData
      };
    default:
      return state;
  }
};

export default user;
