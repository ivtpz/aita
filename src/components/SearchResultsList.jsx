import React from 'react';
import PaperCard from './PaperCard';
import Pagination from './Pagination';

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
      name={'top'}
    />
    {searchResults.length ?
    searchResults.map(result =>
      <PaperCard key={result.id} data={result} />
    ) : null}
    <Pagination
      total={totalResults}
      page={page}
      setPage={setPage}
      perPage={10}
      name={'bottom'}
    />
  </div>
);

export default SearchResultsList;
