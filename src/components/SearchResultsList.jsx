import React from 'react';
import { connect } from 'react-redux';
import PaperCard from './PaperCard';
import Pagination from './Pagination';

// Actions
import { searchArxiv } from '../actions/arxiv';

const styles = {
  base: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start'
  }
};

const SearchResultsList = ({
  searchResults, totalResults, page, setPage
}) => (
  <div style={styles.base}>
    <Pagination
      total={totalResults}
      page={page}
      setPage={setPage}
      perPage={10}
    />
    {searchResults.length ?
    searchResults.map(result =>
      <PaperCard key={result.id} data={result} />
    ) : null}
  </div>
);

const mapStateToProps = ({ arxiv }) => ({
  ...arxiv
});

const mapDispatchToProps = dispatch => ({
  setPage: page => dispatch(searchArxiv(page))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchResultsList);
