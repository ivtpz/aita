import { put } from 'axios';

const addReference = refId => async (dispatch, getState) => {
  const { user } = getState();
  try {
    await put('/user/add', {
      refId,
      userId: user._id
    });
    return dispatch({
      type: 'ADD_REFERENCE',
      refId
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

const receiveUserData = payload => ({
  type: 'RECEIVE_USER_DATA',
  payload
});

export {
  addReference,
  removeReference,
  receiveUserData
};
