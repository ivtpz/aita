/* eslint-disable import/first */
require('babel-polyfill');

import { put, get } from 'axios';
import { showSnackBar } from './materialUi';
import { showAuthLock } from './auth';


const addReference = (refId, data) => async (dispatch, getState) => {
  const { user, auth } = getState();
  if (!auth.loggedIn) {
    return dispatch(showSnackBar(
      'Log in to add references.',
      { error: true, action: 'Log In', onActionTap: () => dispatch(showAuthLock()) }
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
    return dispatch(showSnackBar('Reference added'));
  } catch (errorMsg) {
    return dispatch(showSnackBar(
      'There was an error',
      { error: true, errorMsg, action: 'Log In', onActionTap: () => dispatch(showAuthLock()) }
  ));
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
    return dispatch(showSnackBar('Reference removed'));
  } catch (errorMsg) {
    return dispatch(showSnackBar('There was an error, please try again.', { error: true, errorMsg }));
  }
};

const searchArxivById = idList => async (dispatch) => {
  const { data } = await get('/arxiv/byid', {
    params: {
      ids: idList
    }
  });
  return dispatch({
    type: 'RECEIVE_USER_DATA',
    payload: {
      referenceData: data
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
