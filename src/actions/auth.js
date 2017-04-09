/* global localStorage */
import { get } from 'axios';
import Auth0Lock from 'auth0-lock';
import { receiveUserData } from './user';
import options from '../authConfig';

const lock = new Auth0Lock(
  '9ktoTjI4KL8e1qLEcTCY1SAd57LCpivK',
  'aita.eu.auth0.com',
  options
);

const displayError = error => ({
  type: 'AUTH_ERROR',
  error
});

const initializeLock = () => (dispatch) => {
  lock.on('authenticated', ({ idToken }) => {
    // dispatch({ type: 'AUTH_LOCK_HIDDEN' });
    lock.getProfile(idToken, async (err, { email }) => {
      if (err) {
        return dispatch(displayError(err));
      }
      localStorage.setItem('login_id_token', idToken);
      const user = await get('/user', {
        params: { email }
      });
      return dispatch(receiveUserData({
        ...user.data,
        idToken
      }));
    });
  });
  lock.on('hide', () => dispatch({ type: 'AUTH_LOCK_HIDDEN' }));
  dispatch({ type: 'AUTH_LOCK_INITIALIZED' });
  lock.on('authorization_error', err => dispatch(displayError(err)));
};

const showAuthLock = () => (dispatch) => {
  lock.show();
  return dispatch({ type: 'AUTH_LOCK_VISIBLE' });
};

export {
  showAuthLock,
  initializeLock
};
