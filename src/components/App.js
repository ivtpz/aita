import React, { Component } from 'react';
import { connect } from 'react-redux';
// Actions
import { initializeLock, showAuthLock } from '../actions/auth';
import { setSearchQuery, searchArxiv } from '../actions/arxiv';
// Components
import SearchResultsList from './SearchResultsList';

class App extends Component {

  componentDidMount() {
    this.props.init();
  }

  render() {
    const {
      onClick,
      onSearchInput,
      search
    } = this.props;
    return (
    <div>
      <input
        placeholder='Search...'
        onChange={onSearchInput}
      />
      <button
        type='submit'
        onClick={search}
      >Search
      </button>
      <button
        type='submit'
        onClick={onClick}
      >Sign In
      </button>
      <SearchResultsList />
    </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  onClick: refId => dispatch(showAuthLock(refId)),
  onSearchInput: e => dispatch(setSearchQuery(e.target.value)),
  search: () => dispatch(searchArxiv()),
  init: () => dispatch(initializeLock())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
