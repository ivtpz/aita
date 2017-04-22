/* global window, document */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Radium, { StyleRoot } from 'radium';
import Snackbar from 'material-ui/Snackbar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
// Actions
import { initializeLock, showAuthLock } from '../actions/auth';
import { setScrollLoc } from '../actions/window';
import { hideSnackBar } from '../actions/materialUi';
// Components
import Menu from './Menu';
// Style
import { theme, colors } from '../theme/colors';

class App extends Component {

  componentDidMount() {
    const { init, setScrollY } = this.props;
    init();
    setScrollY(window.scrollY);
    window.addEventListener('scroll', (e) => {
      setScrollY(e.srcElement.body.scrollTop);
    });
  }

  render() {
    const {
      location: { pathname },
      snackOpen,
      snackMsg,
      closeSnack,
      openLogIn
    } = this.props;
    return (
      <StyleRoot>
        <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
          <div>
            <Menu location={pathname}/>
            {this.props.children}
            <Snackbar
              open={snackOpen}
              message={snackMsg}
              onRequestClose={closeSnack}
              autoHideDuration={6000}
              action={'Log In'}
              onActionTouchTap={() => {
                openLogIn();
                closeSnack();
              }}
              contentStyle={{ fontSize: '18px' }}
              bodyStyle={{ background: `radial-gradient(${colors.transDarkGrey}, ${colors.PrimaryDark})` }} />
            </div>
          </MuiThemeProvider>
      </StyleRoot>
    );
  }
}

const mapStateToProps = state => ({
  snackOpen: state.materialUi.snackBar.open,
  snackMsg: state.materialUi.snackBar.message
});

const mapDispatchToProps = dispatch => ({
  init: () => dispatch(initializeLock()),
  setScrollY: pos => dispatch(setScrollLoc(pos)),
  closeSnack: () => dispatch(hideSnackBar()),
  openLogIn: () => dispatch(showAuthLock())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Radium(App));
