const initialState = {
  searchResults: []
};

const arxiv = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ARXIV_SEARCH':
      return {
        ...state,
        query: action.query
      };
    case 'SET_SEARCH_RESULTS':
      return {
        ...state,
        searchResults: action.entry
      };
    default:
      return state;
  }
};

export default arxiv;
