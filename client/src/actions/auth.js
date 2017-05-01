/* global localStorage */
import { get } from 'axios';
import Auth0Lock from 'auth0-lock';
import { browserHistory } from 'react-router';
import { receiveUserData } from './user';
import options from '../authConfig';

const lock = new Auth0Lock(
  '9ktoTjI4KL8e1qLEcTCY1SAd57LCpivK',
  'aita.eu.auth0.com',
  options
);

const redirectKey = 'redirect_after_login';
const authKey = 'login_id_token';

const removeNextLoc = () => localStorage.removeItem(redirectKey);

const displayError = error => ({
  type: 'AUTH_ERROR',
  error
});

const login = () => ({ type: 'LOG_IN' });

const logout = () => {
  localStorage.removeItem(authKey);
  return { type: 'LOG_OUT' };
};

const loadUserInfo = (dispatch, idToken, setToken = false) => {
  lock.getProfile(idToken, async (err, { email }) => {
    if (err) {
      return dispatch(displayError(err));
    }
    if (setToken) localStorage.setItem(authKey, idToken);
    const user = await get('/user', {
      params: { email }
    });
    dispatch(login());
    return dispatch(receiveUserData({
      ...user.data,
      idToken
    }));
  });
};

const initializeLock = () => (dispatch) => {
  lock.on('authenticated', ({ idToken }) => {
    const nextLoc = localStorage.getItem(redirectKey);
    loadUserInfo(dispatch, idToken, true);
    if (nextLoc) {
      removeNextLoc();
      browserHistory.push(nextLoc);
    }
  });

  lock.on('hide', () => {
    removeNextLoc();
    return dispatch({ type: 'AUTH_LOCK_HIDDEN' });
  });

  lock.on('authorization_error', err => dispatch(displayError(err)));

  const id = localStorage.getItem(authKey);
  if (id) {
    loadUserInfo(dispatch, id);
  }

  dispatch({ type: 'AUTH_LOCK_INITIALIZED' });
};

const showAuthLock = nextLoc => (dispatch) => {
  if (nextLoc) localStorage.setItem(redirectKey, nextLoc);
  lock.show();
  return dispatch({ type: 'AUTH_LOCK_VISIBLE', nextLoc });
};

export {
  showAuthLock,
  initializeLock,
  logout
};
