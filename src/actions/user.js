/* eslint-disable import/first */
require('babel-polyfill');

import { put, get } from 'axios';
import X2JS from 'x2js';
import { showSnackBar } from './materialUi';

const x2js = new X2JS();

const url = 'http://export.arxiv.org/api/query';

const addReference = (refId, data) => async (dispatch, getState) => {
  const { user, auth } = getState();
  if (!auth.loggedIn) {
    return dispatch(showSnackBar(
      'You must be logged in to add references.',
      {
        error: true
      }
    ));
  }
  try {
    await put('/user/add', {
      refId,
      userId: user._id
    });
    dispatch({
      type: 'ADD_REFERENCE',
      refId,
      data
    });
    return dispatch(showSnackBar('Reference added to your saved list'));
  } catch (errorMsg) {
    return dispatch(showSnackBar('There was an error, please log in or try again.', { error: true, errorMsg }));
  }
};

const removeReference = refId => async (dispatch, getState) => {
  const { user } = getState();
  try {
    await put('/user/remove', {
      refId,
      userId: user._id
    });
    dispatch({
      type: 'REMOVE_REFERENCE',
      refId
    });
    return dispatch(showSnackBar('Reference removed from your saved list'));
  } catch (errorMsg) {
    return dispatch(showSnackBar('There was an error, please try again.', { error: true, errorMsg }));
  }
};

const searchArxivById = idList => async (dispatch) => {
  const { data } = await get(url, {
    params: {
      id_list: idList.join(','),
      start: 0
    }
  });
  let { feed: { entry } } = x2js.xml2js(data);
  if (!Array.isArray(entry)) entry = [entry];
  return dispatch({
    type: 'RECEIVE_USER_DATA',
    payload: {
      referenceData: entry
    }
  });
};

const receiveUserData = payload => (dispatch) => {
  dispatch(searchArxivById(payload.references));
  dispatch({
    type: 'RECEIVE_USER_DATA',
    payload
  });
};

const filterUserRefs = query => ({
  type: 'FILTER_REFERENCES',
  query: query.toLowerCase()
});

const makeUserRefsVisible = () => ({
  type: 'MAKE_ALL_REFS_VISIBLE'
});

export {
  addReference,
  removeReference,
  receiveUserData,
  filterUserRefs,
  makeUserRefsVisible
};
