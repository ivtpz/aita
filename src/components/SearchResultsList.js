import React, { Component } from 'react';
import { connect } from 'react-redux';
import PaperCard from './PaperCard';

class SearchResultsList extends Component {
  render() {
    const { results } = this.props;
    return (
      <div>
        {results.length ? results.map(result =>
          <PaperCard key={result.id} data={result} />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  results: state.arxiv.searchResults
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchResultsList);
