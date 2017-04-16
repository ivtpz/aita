import React from 'react';
import Radium from 'radium';
import { colors } from '../theme/colors';

const styles = {
  base: {
    color: colors.NeutralDark,
    fontSize: 25,
    display: 'inline',
    margin: '0px 5px 0px 5px',
    cursor: 'pointer',
    ':hover': {
      color: colors.Mint
    }
  }
};

const DownloadLink = ({ type, link, id }) => {
  let faclass;
  switch (type) {
    case 'application/pdf':
      faclass = 'pdf';
      break;
    case 'text/html':
      faclass = 'text';
      break;
    default:
      break;
  }
  if (faclass) {
    const className = `fa fa-file-${faclass}-o`;
    return (
      <a
        href={link}
        target='_blank'
        style={{ textDecoration: 'none' }}>
        <i
          ref={`download${id}`}
          key={`download${id}`}
          style={styles.base}
          className={className}
        ></i>
      </a>
    );
  }
  return null;
};

export default Radium(DownloadLink);
