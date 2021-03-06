import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import Radium from 'radium';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import MenuLink from '../components/MenuLink';
import { colors } from '../theme/colors';
// Actions
import { showAuthLock, logout } from '../actions/auth';
import { closeDrawer, toggleDrawer, setDrawerState } from '../actions/materialUi';

const icon = {
  opacity: 1,
  width: 40,
  height: 40,
  zIndex: 150,
  visibility: 'visible',
  transition: 'visibility 0.3s, opacity 0.2s linear'
};

const tablet = {
  '@media (min-width: 1040px)': {
    display: 'none'
  }
};

const desktop = {
  '@media (max-width: 1040px)': {
    display: 'none'
  }
};

const styles = {
  menu: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottom: '2px solid lightgrey',
    position: 'fixed',
    width: '100%',
    zIndex: 100,
    padding: 6,
    background: `linear-gradient(0deg, ${colors.transAccent}, ${colors.transWhite}), url('./assets/wavegrid.png') repeat left top`
  },
  stickyMenu: {
    boxShadow: '0px 1px 5px 2px darkgrey'
  },
  titleBlock: {
    height: 76,
    transition: 'height 0.2s ease-out'
  },
  titleBlockSmall: {
    height: 50
  },
  titleBase: {
    fontSize: '4em',
    fontWeight: 'bolder',
    flex: '1 1 0px',
    textAlign: 'center',
    textDecoration: 'none',
    color: colors.PrimaryBright,
    opacity: 1,
    visibility: 'visible',
    transition: 'visibility 0.3s, transform 0.3s ease, opacity 0.3s ease'
  },
  titleHidden: {
    opacity: 0,
    visibility: 'hidden',
    transform: 'scale(0.5)'
  },
  iconBase: {
    ...icon,
    top: 10,
    left: '49%',
    position: 'absolute',
    ...desktop
  },
  iconHidden: {
    visibility: 'hidden',
    opacity: 0
  },
  leftLinkContainer: {
    display: 'flex',
    flex: '1 1 0px',
    marginLeft: 6,
    ...desktop
  },
  menuIcon: {
    fontSize: '2.4em',
    flex: '1 1 0px',
    alignSelf: 'center',
    color: colors.Mint,
    cursor: 'pointer',
    ...tablet
  },
  closeButton: {
    float: 'right',
    zIndex: 9000,
    backgroundColor: 'white',
    ':hover': {
      backgroundColor: colors.transMint
    }
  },
  placeHolder: {
    flex: '1 1 0px',
    alignSelf: 'center',
    marginRight: 12,
    ...tablet
  },
  rightIcon: {
    ...icon,
    float: 'right',
    marginRight: 4,
    marginBottom: 4,
    ...tablet
  }
};

styles.rightLinkContainer = {
  ...styles.leftLinkContainer,
  justifyContent: 'flex-end',
  marginRight: 6
};

const menuMovePoint = 15;

// TODO: add a MUI theme

class Menu extends Component {

  handleAction = action => (typeof action === 'string' ?
      browserHistory.push(action) :
      action());

  getTitleBlock = (y, title) => {
    const { titleBlock, titleBlockSmall, titleBase, titleHidden, iconBase, iconHidden } = styles;
    if (!y) {
      return (
        <div style={titleBlock}>
          <div style={titleBase}>{title}</div>
        </div>
      );
    }
    if (y < menuMovePoint) {
      return (
        <div style={titleBlock}>
          <div style={titleBase}>{title}</div>
          <div id='icon' style={[iconBase, iconHidden]}/>
        </div>
      );
    }
    return (
      <div style={[titleBlock, titleBlockSmall]}>
        <div style={[titleBase, titleHidden]}>{title}</div>
        <div id='icon' style={iconBase}/>
      </div>
    );
  };

  render() {
    const {
      toggle, open, setDrawer, loggedIn,
      openLock, quit, location, scrollY
    } = this.props;
    const leftLinks = [
      { text: 'My References', action: loggedIn ? '/references' : () => openLock('/references') },
      { text: 'Recommendations', action: '/' }
    ];
    const title = 'AITA';
    const authLink = loggedIn ?
      { text: 'Log out', action: quit } :
      { text: 'Log in', action: () => openLock(location) };
    const rightLinks = [
      { text: 'Search the Arxiv', action: '/search' },
      authLink
    ];
    return (
      <div
        style={scrollY < menuMovePoint ? styles.menu : [styles.menu, styles.stickyMenu]}
        id='menu-container'>
        <div
          ref='1.leftlinks'
          style={styles.leftLinkContainer}>
          {leftLinks.map((link, i) =>
            <MenuLink {...link}
              key={`${i}${link.text}expandedleft`}
              last={i === leftLinks.length - 1}
              active={link.action === location}
            />
          )}
        </div>
        <div
          ref='2.menuIcon'
          className='fa fa-bars'
          style={styles.menuIcon}
          onClick={toggle}
        >
        <Drawer
          docked={false}
          width={200}
          open={open}
          onRequestChagne={setDrawer}
        >
          <IconButton
            style={styles.closeButton}
            iconStyle={{ fill: colors.NeutralDark }}>
            <NavigationClose />
          </IconButton>
          {leftLinks.concat(rightLinks).map((l, i) =>
            <div key = {`${i}${l.text}itemcontainer`}>
              <MenuItem
                onTouchTap={() => this.handleAction(l.action)}
                key={`${i}${l.text}drawer`}>
                {l.text}</MenuItem>
              {i === 2 && <Divider />}
            </div>
          )}
        </Drawer>
        </div>
        <Link to='/' style={{ textDecoration: 'none' }} >
          {this.getTitleBlock(scrollY, title)}
        </Link>
        <div style={styles.rightLinkContainer} >
          {rightLinks.map((link, i) =>
            <MenuLink {...link}
              key={`${i}${link.text}expandedright`}
              last={i === rightLinks.length - 1}
              active={link.action === location}
            />
          )}
        </div>
        <div style={styles.placeHolder} >
          <div id='iconRight' style={scrollY > menuMovePoint ? styles.rightIcon : [styles.rightIcon, styles.iconHidden]} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ materialUi, windowReducer, auth }) => ({
  ...materialUi.drawer,
  ...windowReducer,
  loggedIn: auth.loggedIn
});

const mapDispatchToProps = dispatch => ({
  openLock: nextLoc => dispatch(showAuthLock(nextLoc)),
  close: () => dispatch(closeDrawer()),
  toggle: () => dispatch(toggleDrawer()),
  setDrawer: open => dispatch(setDrawerState(open)),
  quit: () => dispatch(logout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Radium(Menu));
