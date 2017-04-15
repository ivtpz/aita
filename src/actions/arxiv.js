import { get } from 'axios';
import X2JS from 'x2js';
import dummyData from '../helpers/dummyArxivData';

const x2js = new X2JS();

const url = 'http://export.arxiv.org/api/query';

const setSearchQuery = search => ({
  type: 'SET_ARXIV_SEARCH',
  query: search
});

const setSearchResults = ({ feed: { entry, totalResults } }) => ({
  type: 'SET_SEARCH_RESULTS',
  entry,
  totalResults: totalResults.toString()
});

const setSearchPage = page => ({
  type: 'SET_SEARCH_PAGE',
  page
});

const searchArxiv = page => async (dispatch, getState) => {
  const { query } = getState().arxiv;
  const start = page ? page * 10 : 0;
  // TODO: FILTER THE DUMMY DATA
  // console.log(dummyData)
  // return dispatch(setSearchResults(dummyData));
  // TODO: ENV VARS TO RETURN DUMMY OR REAL DATA
  const { data } = await get(url, {
    params: {
      search_query: `all:${query}`,
      start,
      max_results: 10
    }
  });
  dispatch(setSearchPage(page || 1));
  return dispatch(setSearchResults(x2js.xml2js(data)));
};

export {
  setSearchQuery,
  searchArxiv,
  setSearchPage
};
