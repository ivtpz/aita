import React from 'react';
import MenuLink from './MenuLink';
import colors from '../theme/colors';

const menuStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  borderBottom: `2px solid lightgrey`,
  paddingBottom: 6
};

const leftLinkContainer = {
  display: 'flex',
  width: '33%'
};

const rightLinkContainer = {
  ...leftLinkContainer,
  justifyContent: 'flex-end'
};

const titleStyle = {
  fontSize: '4em',
  fontWeight: 'bolder',
  width: '33%',
  textAlign: 'center',
  color: colors.PrimaryBright
};

const Menu = ({ leftLinks, title, rightLinks }) => (
  <div style={menuStyle}>
    <div style={leftLinkContainer}>
      {leftLinks.map((link, i) =>
        <MenuLink {...link}
          last={i === leftLinks.length - 1}
        />
      )}
    </div>
    <div style={titleStyle}>{title}</div>
    <div style={rightLinkContainer}>
      {rightLinks.map((link, i) =>
        <MenuLink {...link}
          last={i === rightLinks.length - 1}
        />
      )}
    </div>
  </div>
);

export default Menu;
