import { combineReducers } from 'redux';
import auth from './auth';
import user from './user';
import arxiv from './arxiv';
import drawer from './drawer';
import windowReducer from './window';

export default combineReducers({
  auth,
  user,
  arxiv,
  drawer,
  windowReducer
});
