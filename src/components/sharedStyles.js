const main = {
  display: 'flex',
  flexDirection: 'column'
};
const searchBox = {
  alignSelf: 'flex-end',
  marginTop: 10,
  marginRight: 20,
  '@media (max-width: 480px)': {
    marginRight: 0,
    alignSelf: 'center'
  }
};

export {
  main,
  searchBox
};
