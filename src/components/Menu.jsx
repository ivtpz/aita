import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import Radium from 'radium';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import MenuLink from './MenuLink';
import { colors, theme } from '../theme/colors';
// Actions
import { showAuthLock, logout } from '../actions/auth';
import { closeDrawer, toggleDrawer, setDrawerState } from '../actions/drawer';

const styles = {
  menu: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
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
  titleBase: {
    fontSize: '4em',
    fontWeight: 'bolder',
    flex: '1 1 0px',
    textAlign: 'center',
    textDecoration: 'none',
    color: colors.PrimaryBright,
    opacity: 1,
    transition: 'transform 0.2s ease, opacity 0.2s ease'
  },
  titleFaded: {
    transform: 'scale(0.8)',
    opacity: 0.5
  },
  titleHidden: {
    opacity: 0.2,
    transform: 'scale(0.5)'
  },
  iconBase: {
    opacity: 1,
    width: 40,
    height: 40,
    zIndex: 150,
    transition: 'transform 0.3s ease, opacity 0.3s ease',
    '@media (max-width: 1040px)': {
      marginRight: 20
    }
  },
  iconFaded: {
    opacity: 0.5,
    transform: 'scale(1.3)',
    position: 'absolute',
    top: 10,
    left: '48%',
    '@media (max-width: 1040px)': {
      left: '92%'
    }
  },
  iconHidden: {
    transform: 'scale(1.1)',
    opacity: 0.1,
    position: 'absolute',
    top: 15,
    left: '48%',
    '@media (max-width: 1040px)': {
      left: '92%'
    }
  },
  leftLinkContainer: {
    display: 'flex',
    flex: '1 1 0px',
    '@media (max-width: 1040px)': {
      display: 'none'
    }
  },
  menuIcon: {
    fontSize: '2.4em',
    flex: '1 1 0px',
    alignSelf: 'center',
    paddingRight: 20,
    color: colors.Mint,
    cursor: 'pointer',
    '@media (min-width: 1040px)': {
      display: 'none'
    }
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
    '@media (min-width: 1040px)': {
      display: 'none'
    }
  }
};

styles.rightLinkContainer = {
  ...styles.leftLinkContainer,
  justifyContent: 'flex-end'
};

const menuMovePoint = 25;

// TODO: add a MUI theme

class Menu extends Component {

  handleAction = action => (typeof action === 'string' ?
      browserHistory.push(action) :
      action());

  getTitleBlock = (y, title) => {
    const { titleBase, titleFaded, titleHidden, iconBase, iconFaded, iconHidden } = styles;
    if (y < 10) {
      return (<div style={titleBase}>{title}</div>);
    } else if (y < 18) {
      return (
        <div>
          <div style={[titleBase, titleFaded]}>{title}</div>
          <div id='icon' style={[iconBase, iconHidden]}/>
        </div>
      );
    } else if (y < menuMovePoint) {
      return (
        <div>
          <div style={[titleBase, titleHidden]}>{title}</div>
          <div id='icon' style={[iconBase, iconFaded]}/>
        </div>
      );
    }
    return (<div id='icon' style={iconBase}/>);
  };


  render() {
    const leftLinks = [
      { text: 'My References', action: '/references' },
      { text: 'Recommendations', action: '/' }
    ];
    const title = 'AITA';
    const {
      toggle, open, setDrawer, loggedIn,
      openLock, quit, location, scrollY
    } = this.props;
    const authLink = loggedIn ?
      { text: 'Log out', action: quit } :
      { text: 'Log in', action: openLock };
    const rightLinks = [
      { text: 'Search the Arxiv', action: '/' },
      authLink
    ];
    return (
      <div
        style={scrollY < menuMovePoint ? styles.menu : [styles.menu, styles.stickyMenu]}
        id='menu-container'>
        <div
          ref='leftlinks'
          key={1}
          style={styles.leftLinkContainer}>
          {leftLinks.map((link, i) =>
            <MenuLink {...link}
              key={i}
              last={i === leftLinks.length - 1}
              active={link.action === location}
            />
          )}
        </div>
        <div
          ref='menuIcon'
          key={2}
          className='fa fa-bars'
          style={styles.menuIcon}
          onClick={toggle}
        >
        <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
          <Drawer
            docked={false}
            width={200}
            open={open}
            onRequestChagne={setDrawer}
          >
            <IconButton
              style={styles.closeButton}
              iconStyle={{ fill: colors.Mint }}>
              <NavigationClose />
            </IconButton>
            {leftLinks.concat(rightLinks).map((l, i) =>
              <div>
                <MenuItem
                  onTouchTap={() => this.handleAction(l.action)}
                  key={l.text}>
                  {l.text}</MenuItem>
                {i === 2 && <Divider />}
              </div>
            )}
          </Drawer>
        </MuiThemeProvider>
        </div>
        <Link to='/' style={{ textDecoration: 'none' }}>
          {this.getTitleBlock(scrollY, title)}
        </Link>
        <div style={styles.rightLinkContainer}>
          {rightLinks.map((link, i) =>
            <MenuLink {...link}
              key={i}
              last={i === rightLinks.length - 1}
              active={link.action === location}
            />
          )}
        </div>
        {scrollY < menuMovePoint && <div style={styles.placeHolder} />}
      </div>
    );
  }
}

const mapStateToProps = ({ drawer, windowReducer, auth }) => ({
  ...drawer,
  ...windowReducer,
  loggedIn: auth.loggedIn
});

const mapDispatchToProps = dispatch => ({
  openLock: refId => dispatch(showAuthLock(refId)),
  close: () => dispatch(closeDrawer()),
  toggle: () => dispatch(toggleDrawer()),
  setDrawer: open => dispatch(setDrawerState(open)),
  quit: () => dispatch(logout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Radium(Menu));
