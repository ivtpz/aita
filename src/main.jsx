/* global document */
/* eslint-disable import/first */
require('babel-polyfill');

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';
import store from './store/storeConfig';
import App from './components/App';

const Root = ({ appStore }) => (
  <Provider store={appStore}>
    <Router history={browserHistory}>
      <Route path='/(:filter)' component={App} />
    </Router>
  </Provider>
);

ReactDOM.render(
  <Root appStore={store} />,
  document.getElementById('app')
);