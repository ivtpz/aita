import React from 'react';
import { inputStyle, searchIcon } from '../theme/sharedStyles';

const SearchField = ({ onSearchInput, search, filter }) => (
  <div>
    <input
      style={inputStyle}
      placeholder={filter}
      onChange={onSearchInput}
      onKeyPress={({ charCode }) => (charCode === 13) && search()}
    />
    <i
      style={searchIcon}
      className='fa fa-search'
      onTouchTap={search}
    ></i>
  </div>
);

export default SearchField;
