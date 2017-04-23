import React from 'react';
import { colors } from '../theme/colors';

const inputStyle = {
  ariaHidden: true,
  padding: '4px 5px 0 5px',
  borderRadius: 4,
  fontSize: 18,
  border: `1px solid ${colors.NeutralDark}`
};

const searchIcon = {
  position: 'relative',
  fontSize: '1.2em',
  zIndex: 1,
  left: -25,
  top: -1,
  color: colors.PrimaryDark,
  cursor: 'pointer'
};

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
