import React from 'react';
import Radium from 'radium';
import colors from '../theme/colors';

const border = `3px solid ${colors.Mint}`;

const styles = {

  link: {
    color: colors.NeutralDark,
    height: 25,
    borderLeft: border,
    padding: '4px 8px 4px 8px',
    fontSize: '1.2em',
    cursor: 'pointer',
    ':hover': {
      color: colors.PrimaryDark
    }
  },

  last: {
    borderRight: border
  }

};

const MenuLink = ({ action, text, last }) => (
  <div
    style={!last ? styles.link : [styles.link, styles.last]}
    onTouchTap={action}>
    {text}
  </div>
);

export default Radium(MenuLink);
