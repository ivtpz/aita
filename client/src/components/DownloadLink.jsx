import React from 'react';
import Radium from 'radium';
import IconButton from 'material-ui/IconButton';
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
  },
  container: {
    padding: 1,
    width: 35,
    height: 35,
    borderRadius: '50%'
  },
  hovered: {
    backgroundColor: colors.transMint
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
        <IconButton
          ref={`download${id}`}
          key={`download${id}`}
          tooltip={faclass === 'pdf' ? 'View PDF' : 'Open Arxiv page'}
          tooltipStyles={{ fontSize: '16px' }}
          style={styles.container}
          hoveredStyle={styles.hovered}
          iconStyle={styles.base}
          iconClassName={className}
        ></IconButton>
      </a>
    );
  }
  return null;
};

export default Radium(DownloadLink);
