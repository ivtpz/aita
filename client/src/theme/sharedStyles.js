import { colors } from './colors';

const main = {
  display: 'flex',
  flexDirection: 'column',
  paddingTop: 100
};

const searchBox = {
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'center',
  '@media (max-width: 480px)': {
    marginRight: 0,
    alignSelf: 'center'
  }
};

const resultsContainer = {
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'flex-start'
};

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

export {
  main,
  inputStyle,
  searchBox,
  searchIcon,
  resultsContainer
};
