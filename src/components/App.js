import React, { Component } from 'react';
import { connect } from 'react-redux';
// Actions
import { initializeLock, showAuthLock } from '../actions/auth';
import { setSearchQuery, searchArxiv } from '../actions/arxiv';
// Components
import SearchResultsList from './SearchResultsList';
import SearchField from './SearchField';
import Menu from './Menu';

class App extends Component {

  componentDidMount() {
    this.props.init();
  }

  render() {
    const {
      openLock,
      onSearchInput,
      search,
      params: {
        filter
      }
    } = this.props;
    return (
    <div>
      <Menu
        leftLinks={[
          { text: 'References', action: () => '/saved' },
          { text: 'Recommendations', action: () => '/recommend' }
        ]}
        rightLinks={[{ text: 'Log in', action: openLock }]}
        title='AITA'
      />
      <SearchField
        onSearchInput={onSearchInput}
        search={search}
        filter={filter || 'Search...'}
      />
      <SearchResultsList />
    </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  openLock: refId => dispatch(showAuthLock(refId)),
  onSearchInput: e => dispatch(setSearchQuery(e.target.value)),
  search: () => dispatch(searchArxiv()),
  init: () => dispatch(initializeLock())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
