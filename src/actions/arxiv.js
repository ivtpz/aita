import { get } from 'axios';
import X2JS from 'x2js';
import dummyData from '../helpers/dummyArxivData';

const x2js = new X2JS();

const url = 'http://export.arxiv.org/api/query';

const setSearchQuery = query => ({
  type: 'SET_ARXIV_QUERY',
  payload: { query }
});

const setSearchCategory = category => ({
  type: 'SET_ARXIV_CATEGORY',
  payload: { category }
});

const setSearchSort = sortBy => ({
  type: 'SET_ARXIV_SORTBY',
  payload: { sortBy }
});

const setSearchResults = ({ feed: { entry, totalResults } }) => ({
  type: 'SET_SEARCH_RESULTS',
  entry,
  totalResults: totalResults.toString()
});

const setSearchPage = page => ({
  type: 'SET_SEARCH_PAGE',
  payload: { page }
});

const searchArxiv = page => async (dispatch, getState) => {
  const { query, category, sortBy, sortOrder } = getState().arxiv;
  let formattedQ;
  if (query && query.includes(',')) {
    formattedQ = query.split(',').join(' ');
  } else if (query) {
    formattedQ = query.split(' ').join(' AND ');
  }
  const start = page ? page * 10 : 0;
  const params = {
    search_query: `${category.arxivValue}:${formattedQ}`,
    start,
    sortBy: sortBy.arxivValue,
    sortOrder,
    max_results: 10
  };
  // TODO: FILTER THE DUMMY DATA
  // console.log(dummyData)
  // return dispatch(setSearchResults(dummyData));
  // TODO: ENV VARS TO RETURN DUMMY OR REAL DATA
  const { data } = await get(url, { params });
  dispatch(setSearchPage(page || 1));
  return dispatch(setSearchResults(x2js.xml2js(data)));
};

export {
  setSearchQuery,
  searchArxiv,
  setSearchPage,
  setSearchCategory,
  setSearchSort
};
