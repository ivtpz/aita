import { combineReducers } from 'redux';
import auth from './auth';
import user from './user';
import arxiv from './arxiv';

export default combineReducers({
  auth,
  user,
  arxiv
});
