/* eslint-disable import/first */
require('babel-polyfill');

import { put, get } from 'axios';
import X2JS from 'x2js';

const x2js = new X2JS();

const url = 'http://export.arxiv.org/api/query';

const addReference = (refId, data) => async (dispatch, getState) => {
  const { user } = getState();
  try {
    await put('/user/add', {
      refId,
      userId: user._id
    });
    return dispatch({
      type: 'ADD_REFERENCE',
      refId,
      data
    });
  } catch (errorMsg) {
    return dispatch({
      type: 'ERROR',
      errorMsg
    });
  }
};

const removeReference = refId => async (dispatch, getState) => {
  const { user } = getState();
  try {
    await put('/user/remove', {
      refId,
      userId: user._id
    });
    return dispatch({
      type: 'REMOVE_REFERENCE',
      refId
    });
  } catch (errorMsg) {
    return dispatch({
      type: 'ERROR',
      errorMsg
    });
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
