import React from 'react';
import PaperCard from './PaperCard';
import Pagination from './Pagination';
import { resultsContainer } from './sharedStyles';


const SearchResultsList = ({
  searchResults, totalResults, page, setPage
}) => (
  <div style={resultsContainer}>
    <Pagination
      total={totalResults}
      page={page}
      setPage={setPage}
      perPage={10}
      name={'top'}
    />
    {searchResults && searchResults.length ?
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
