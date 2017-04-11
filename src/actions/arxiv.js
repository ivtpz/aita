import { get } from 'axios';
import X2JS from 'x2js';
import dummyData from '../helpers/dummyArxivData';

const x2js = new X2JS();

const url = 'http://export.arxiv.org/api/query';

const setSearchQuery = search => ({
  type: 'SET_ARXIV_SEARCH',
  query: search
});

const setSearchResults = ({ feed: { entry } }) => ({
  type: 'SET_SEARCH_RESULTS',
  entry
});

const searchArxiv = () => async (dispatch, getState) => {
  const { query } = getState().arxiv;
  // TODO: FILTER THE DUMMY DATA
  // console.log(dummyData)
  // return dispatch(setSearchResults(dummyData));
  // TODO: ENV VARS TO RETURN DUMMY OR REAL DATA
  const { data } = await get(url, {
    params: {
      search_query: `all:${query}`
    }
  });
  return dispatch(setSearchResults(x2js.xml2js(data)));
};

export {
  setSearchQuery,
  searchArxiv
};
