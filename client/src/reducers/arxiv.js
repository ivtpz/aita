const initialState = {
  searchResults: [],
  totalResults: 0,
  page: 0,
  query: undefined,
  category: { text: 'All', arxivValue: 'all' },
  sortBy: { text: 'Relevance', arxivValue: 'relevance' },
  sortOrder: 'descending',
  metaData: []
};

const arxiv = (state = initialState, action) => {
  switch (action.type) {
    // NOTE: property on state corresponds to last part of action string
    case 'SET_ARXIV_QUERY':
    case 'SET_ARXIV_CATEGORY':
    case 'SET_SEARCH_PAGE':
    case 'SET_ARXIV_SORTBY':
    case 'RECEIVE_SUBJECT_METADATA':
      return {
        ...state,
        ...action.payload
      };
    case 'SET_SEARCH_RESULTS':
      return {
        ...state,
        searchResults: action.entry,
        totalResults: action.totalResults
      };
    default:
      return state;
  }
};

export default arxiv;
