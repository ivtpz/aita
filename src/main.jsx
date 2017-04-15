/* global document */
/* eslint-disable import/first */
require('babel-polyfill');

import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import store from './store/storeConfig';
import App from './components/App';
import SearchPage from './components/SearchPage';
import UserReferences from './components/UserReferences';

injectTapEventPlugin();

const Root = ({ appStore }) => (
  <Provider store={appStore}>
    <Router history={browserHistory}>
      <Route path='/' component={App}>
        <IndexRoute component={SearchPage} />
        <Route path='/references' component={UserReferences} />
      </Route>
    </Router>
  </Provider>
);

ReactDOM.render(
  <Root appStore={store} />,
  document.getElementById('app')
);
