import React, { Component } from 'react';
import { connect } from 'react-redux';
import Radium, { StyleRoot } from 'radium';
// Actions
import { initializeLock, showAuthLock } from '../actions/auth';
import { setSearchQuery, searchArxiv } from '../actions/arxiv';
// Components
import SearchResultsList from './SearchResultsList';
import SearchField from './SearchField';
import Menu from './Menu';

const styles = {
  main: {
    display: 'flex',
    flexDirection: 'column'
  },
  search: {
    alignSelf: 'flex-end',
    marginTop: 10
  }
};

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
      <StyleRoot>
        <div style={styles.main}>
          <Menu
            leftLinks={[
              { text: 'References', action: () => '/saved' },
              { text: 'Recommendations', action: () => '/recommend' }
            ]}
            rightLinks={[{ text: 'Log in', action: openLock }]}
            title='AITA'
          />
          <div style={styles.search} >
            <SearchField
              onSearchInput={onSearchInput}
              search={search}
              filter={filter || 'Search...'}
            />
          </div>
          <SearchResultsList />
        </div>
      </StyleRoot>
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
)(Radium(App));
