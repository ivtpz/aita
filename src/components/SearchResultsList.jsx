import React, { Component } from 'react';
import { connect } from 'react-redux';
import PaperCard from './PaperCard';

const styles = {
  base: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center'
  }
};

const SearchResultsList = ({ searchResults }) => (
  <div style={styles.base}>
    {searchResults.length ? searchResults.map(result =>
      <PaperCard key={result.id} data={result} />
    ) : null}
  </div>
);

const mapStateToProps = ({ arxiv }) => ({
  ...arxiv
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchResultsList);
