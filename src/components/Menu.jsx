import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Radium from 'radium';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import MenuLink from './MenuLink';
import colors from '../theme/colors';

import { showAuthLock } from '../actions/auth';
import { closeDrawer, toggleDrawer, setDrawerState } from '../actions/drawer';

const styles = {
  menu: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderBottom: '2px solid lightgrey',
    paddingBottom: 6
  },
  title: {
    fontSize: '4em',
    fontWeight: 'bolder',
    flex: '1 1 0px',
    textAlign: 'center',
    textDecoration: 'none',
    color: colors.PrimaryBright
  },
  leftLinkContainer: {
    display: 'flex',
    flex: '1 1 0px',
    '@media (max-width: 925px)': {
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
    '@media (min-width: 925px)': {
      display: 'none'
    }
  },
  placeHolder: {
    flex: '1 1 0px',
    '@media (min-width: 925px)': {
      display: 'none'
    }
  }
};

styles.rightLinkContainer = {
  ...styles.leftLinkContainer,
  justifyContent: 'flex-end'
};

// TODO: add a MUI theme

class Menu extends Component {

  handleAction = action => (typeof action === 'string' ?
      browserHistory.push(action) :
      action());

  render() {
    const leftLinks = [
      { text: 'References', action: '/references' },
      { text: 'Recommendations', action: '/' }
    ];
    const rightLinks = [{ text: 'Log in', action: this.props.openLock }];
    const title = 'AITA';
    const { toggle, open, setDrawer } = this.props;
    return (
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
          ref='menuIcon'
          key={2}
          className='fa fa-bars'
          style={styles.menuIcon}
          onClick={toggle}
        >
        <MuiThemeProvider>
          <Drawer
            docked={false}
            width={200}
            open={open}
            onRequestChagne={setDrawer}
          >
            {leftLinks.concat(rightLinks).map(l =>
              <MenuItem
                onTouchTap={() => this.handleAction(l.action)}
                key={l.text}>
                {l.text}</MenuItem>
            )}
          </Drawer>
        </MuiThemeProvider>
        </div>
        <Link to='/' style={styles.title}>
          {title}
        </Link>
        <div style={styles.rightLinkContainer}>
          {rightLinks.map((link, i) =>
            <MenuLink {...link}
              key={i}
              last={i === rightLinks.length - 1}
            />
          )}
        </div>
        <div style={styles.placeHolder} />
      </div>
    );
  }
}

const mapStateToProps = ({ drawer }) => ({ ...drawer });

const mapDispatchToProps = dispatch => ({
  openLock: refId => dispatch(showAuthLock(refId)),
  close: () => dispatch(closeDrawer()),
  toggle: () => dispatch(toggleDrawer()),
  setDrawer: open => dispatch(setDrawerState(open))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Radium(Menu));
