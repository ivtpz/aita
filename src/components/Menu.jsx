import React from 'react';
import Radium from 'radium';
import MenuLink from './MenuLink';
import colors from '../theme/colors';

const styles = {
  menu: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderBottom: `2px solid lightgrey`,
    paddingBottom: 6
  },
  title: {
    fontSize: '4em',
    fontWeight: 'bolder',
    flex: '1 1 0',
    textAlign: 'center',
    color: colors.PrimaryBright
  },
  leftLinkContainer: {
    display: 'flex',
    flex: '1 1 0px',
    '@media (max-width: 925px)': {
      display: 'none'
    }
  },
  smallLinks: {
    fontSize: '2.4em',
    flex: '1 1 0px',
    color: colors.Mint,
    '@media (min-width: 925px)': {
      display: 'none'
    }
  },
  rightLinkContainer: {
    display: 'flex',
    flex: '1 1 0px',
    justifyContent: 'flex-end'
  }
};



const Menu = ({ leftLinks, title, rightLinks }) => (
  <div style={styles.menu}>
    <div
      ref='leftlinks'
      key={1}
      style={styles.leftLinkContainer}>
      {leftLinks.map((link, i) =>
        <MenuLink {...link}
          key={i}
          last={i === leftLinks.length - 1}
        />
      )}
    </div>
    <div
      ref='smalllinks'
      key={2}
      className='fa fa-bars'
      style={styles.smallLinks}>
    </div>
    <div style={styles.title}>{title}</div>
    <div style={styles.rightLinkContainer}>
      {rightLinks.map((link, i) =>
        <MenuLink {...link}
          key={i}
          last={i === rightLinks.length - 1}
        />
      )}
    </div>
  </div>
);

export default Radium(Menu);
