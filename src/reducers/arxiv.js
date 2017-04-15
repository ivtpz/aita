const initialState = {
  searchResults: [],
  totalResults: 0,
  page: 0
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
        searchResults: action.entry,
        totalResults: action.totalResults
      };
    case 'SET_SEARCH_PAGE':
      return {
        ...state,
        page: action.page
      };
    default:
      return state;
  }
};

export default arxiv;
