import React from 'react';
import { Link } from 'react-router';
import Radium from 'radium';
import { colors } from '../theme/colors';

const border = `3px solid ${colors.Mint}`;

const highlighted = {
  color: colors.PrimaryDark,
  background: colors.transAccent
};

const styles = {

  link: {
    color: colors.NeutralDark,
    height: 25,
    borderLeft: border,
    padding: '4px 8px 4px 8px',
    fontSize: '1.2em',
    cursor: 'pointer',
    ':hover': highlighted
  },
  active: {
    ...highlighted,
    cursor: 'default'
  },
  last: {
    borderRight: border,
    marginRight: 8
  }

};

const MenuLink = ({ action, text, last, active }) => {
  const style = [styles.link];
  if (last) style.push(styles.last);
  if (active) style.push(styles.active);
  return (typeof action === 'string' ?
    (<Link
      style={{ textDecoration: 'none' }}
      to={action}>
      <div style={style}>
        {text}
      </div>
    </Link>) :
    (<div
      style={style}
      onTouchTap={action}>
      {text}
    </div>)
  );
};

export default Radium(MenuLink);
