import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Radium from 'radium';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import MenuLink from './MenuLink';
import colors from '../theme/colors';

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
  rightLinkContainer: {
    display: 'flex',
    flex: '1 1 0px',
    justifyContent: 'flex-end',
    '@media (max-width: 925px)': {
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

// TODO: add a MUI theme

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  handleToggle = () => this.setState({ open: !this.state.open });

  handleClose = () => this.setState({ open: false });

  render() {
    const { leftLinks, title, rightLinks } = this.props;
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
          onClick={this.handleToggle}
        >
        <MuiThemeProvider>
          <Drawer
            docked={false}
            width={200}
            open={this.state.open}
            onRequestChagne={open => this.setState({ open })}
          >
            {leftLinks.concat(rightLinks).map(l =>
              <MenuItem onClick={this.handleClose}>{l.text}</MenuItem>
            )}
          </Drawer>
        </MuiThemeProvider>
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
        <div style={styles.placeHolder} />
      </div>
    );
  }
}

export default Radium(Menu);
