import React from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';
import { main, searchBox } from './sharedStyles';
// Actions
import { setSearchQuery, searchArxiv, setSearchSort, setSearchCategory } from '../actions/arxiv';
// Components
import SearchResultsList from './SearchResultsList';
import SearchField from './SearchField';
import SearchOptions from './SearchOptions';

const styles = {
  optionsContainer: {
    display: 'flex'
  }
};


const SearchPage = ({
  query,
  searchResults,
  totalResults,
  page,
  category,
  sortBy,
  onSearchInput,
  search,
  setPage,
  setSortOption,
  setSearchBy
}) => (
  <div style={main}>
    <div style={searchBox} >
      <div style={styles.optionsContainer}>
        <SearchOptions
          name='sortBy'
          label='Sort By'
          value={sortBy.text}
          onSelect={setSortOption}
          options={[
            { text: 'Relevance', arxivValue: 'relevance' },
            { text: 'Submitted', arxivValue: 'submittedDate' },
            { text: 'Last Updated', arxivValue: 'lastUpdatedDate' }
          ]}
        />
        <SearchOptions
          name='searchBy'
          label='Search By'
          value={category.text}
          onSelect={setSearchBy}
          last={true}
          options={[
            { text: 'All', arxivValue: 'all' },
            { text: 'Author', arxivValue: 'au' },
            { text: 'Title', arxivValue: 'ti' },
            { text: 'Category', arxivValue: 'cat' },
            { text: 'Abstract', arxivValue: 'abs' }
          ]}
        />
      </div>
      <SearchField
        onSearchInput={onSearchInput}
        search={search}
        filter={query || 'Search...'}
      />
    </div>
    <SearchResultsList
      {...{
        searchResults,
        totalResults,
        page
      }}
      setPage={setPage}
    />
  </div>
);

const mapStateToProps = ({ arxiv }) => ({
  ...arxiv
});

const mapDispatchToProps = dispatch => ({
  onSearchInput: e => dispatch(setSearchQuery(e.target.value)),
  search: () => dispatch(searchArxiv()),
  setPage: page => dispatch(searchArxiv(page)),
  setSortOption: option => dispatch(setSearchSort(option)),
  setSearchBy: option => dispatch(setSearchCategory(option))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Radium(SearchPage));
