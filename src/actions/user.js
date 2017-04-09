import { put } from 'axios';

const addReference = refId => (dispatch) => {
  put('/reference');
  return dispatch({
    type: 'ADD_REFERENCE',
    refId
  });
};

const receiveUserData = payload => ({
  type: 'RECEIVE_USER_DATA',
  payload
});

export {
  addReference,
  receiveUserData
};
