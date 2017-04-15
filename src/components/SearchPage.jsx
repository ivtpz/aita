import React from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';
import { main, searchBox } from './sharedStyles';
// Actions
import { setSearchQuery, searchArxiv } from '../actions/arxiv';
// Components
import SearchResultsList from './SearchResultsList';
import SearchField from './SearchField';

const SearchPage = ({
  onSearchInput,
  search,
  arxiv,
  setPage,
  params: { filter }
}) => (
  <div style={main}>
    <div style={searchBox} >
      <SearchField
        onSearchInput={onSearchInput}
        search={search}
        filter={filter || 'Search...'}
      />
    </div>
    <SearchResultsList
      {...arxiv}
      setPage={setPage}
    />
  </div>
);

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  onSearchInput: e => dispatch(setSearchQuery(e.target.value)),
  search: () => dispatch(searchArxiv()),
  setPage: page => dispatch(searchArxiv(page))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Radium(SearchPage));
