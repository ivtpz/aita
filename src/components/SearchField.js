import React from 'react';
import colors from '../theme/colors';

const inputStyle = {
  ariaHidden: true,
  padding: '4px 5px 0 5px',
  borderRadius: 4,
  fontSize: 18,
  border: `1px solid ${colors.NeutralDark}`
};

const SearchField = ({ onSearchInput, search, filter }) => (
  <div>
    <input
      style={inputStyle}
      placeholder={filter}
      onChange={onSearchInput}
    />
    <button
      type='submit'
      onClick={search}
    >Search
    </button>
  </div>
);

export default SearchField;
