import { combineReducers } from 'redux';
import auth from './auth';
import user from './user';
import arxiv from './arxiv';
import materialUi from './materialUi';
import windowReducer from './window';
import d3 from './d3Reducers';

export default combineReducers({
  auth,
  user,
  arxiv,
  materialUi,
  windowReducer,
  d3
});
