import { get } from 'axios';
import X2JS from 'x2js';
import { createHierarchy, formatConnections } from '../helpers/arxivDataFormatting';
// import dummyData from '../helpers/dummyArxivData';

const x2js = new X2JS();

const url = 'http://export.arxiv.org/api/query';

const setSearchQuery = query => ({
  type: 'SET_ARXIV_QUERY',
  payload: { query }
});

const setAuthorQuery = authorQuery => ({
  type: 'SET_ARXIV_AUTHOR_QUERY',
  payload: { authorQuery }
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

const setArxivFetching = fetching => ({
  type: 'SET_ARXIV_FETCHING',
  payload: { fetching }
});

const setLastYearRetreived = metaDataYear => ({
  type: 'SET_LAST_YEAR_RETREIVED',
  payload: { metaDataYear }
});

const receiveSubjectCountData = metaData => ({
  type: 'RECEIVE_SUBJECT_METADATA',
  payload: { metaData }
});

const addSearchedAuthor = name => ({
  type: 'ADD_SEARCHED_AUTHOR',
  name
});

const getSubjectCountData = metaDataYear => async (dispatch) => {
  dispatch(setArxivFetching(true));
  const apiUrl = '/arxiv/subject';
  const params = {};
  if (metaDataYear && parseInt(metaDataYear, 10) !== new Date().getFullYear()) {
    params.year = metaDataYear;
  }
  const { data } = await get(apiUrl, { params });
  dispatch(setArxivFetching(false));
  dispatch(setLastYearRetreived(metaDataYear));
  dispatch(receiveSubjectCountData(createHierarchy(data)));
};

const ensureAuthorWrotePaper = (author, paper) => {
  const data = paper.author;
  if (Array.isArray(data)) {
    return !!data.find(l => l.name === author);
  }
  return author === data.name;
};

const getConnectionDataByAuthor = (query, replaceCoAuthors) =>
async (dispatch, getState) => { // eslint-disable-line
  const arxivState = getState().arxiv;
  const authorName = query || arxivState.authorQuery.trim();
  const name = authorName.split(' ').map(n => n[0].toUpperCase() + n.slice(1)).join(' ');
  const { searchedAuthors } = arxivState;
  if (!searchedAuthors.has(name)) {
    dispatch(addSearchedAuthor(name));
    const formattedName = name.split(' ').join(' AND ');

    const params = {
      search_query: `au:${formattedName}`,
      max_results: 30
    };
    const { data } = await get(url, { params });
    const { feed: { entry } } = x2js.xml2js(data);

    const state = getState();
    const prevData = state.arxiv.authorConnectionData;
    const alreadySearched = state.arxiv.searchedAuthors;
    let coAuthors = replaceCoAuthors ? [] : state.arxiv.coAuthors;
    const paperData = entry
      .filter(ensureAuthorWrotePaper.bind(null, name))
      .map(({ author, id, primary_category }) => {
        if (Array.isArray(author)) {
          author.forEach((a) => {
            // TODO: replace with regex
            if (!authorName.toLowerCase().includes(a.name.toLowerCase())
            && !alreadySearched.has(a.name)) {
              coAuthors = [...coAuthors, a.name];
            }
          });
        }
        return { id, category: primary_category };
      });
    dispatch({
      type: 'SET_NEXT_COAUTHORS',
      payload: { coAuthors }
    });
    return dispatch({
      type: 'RECEIVE_NEW_AUTHOR_CONNECTION_DATA',
      payload: {
        authorConnectionData: formatConnections(prevData, { id: name, paperData })
      }
    });
  }
};

const getCoAuthorData = () => (dispatch, getState) => {
  const { coAuthors, searchedAuthors } = getState().arxiv;
  const copy = [...coAuthors];
  const nextSearch = [];
  while (nextSearch.length < 10 && copy.length) {
    const next = copy.shift();
    if (!searchedAuthors.has(next)) nextSearch.push(next);
  }
  nextSearch.forEach((a, i) => {
    setTimeout(() =>
      dispatch(getConnectionDataByAuthor(a, i === 0)), i * 500);
  });
};

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
  setAuthorQuery,
  searchArxiv,
  setSearchPage,
  setSearchCategory,
  setSearchSort,
  getSubjectCountData,
  setArxivFetching,
  getConnectionDataByAuthor,
  getCoAuthorData
};
