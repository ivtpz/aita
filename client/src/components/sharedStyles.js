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

export {
  main,
  searchBox,
  resultsContainer
};
