/* global window, document */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Radium, { StyleRoot } from 'radium';
import Snackbar from 'material-ui/Snackbar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
// Actions
import { initializeLock } from '../actions/auth';
import { setScrollLoc } from '../actions/window';
import { hideSnackBar } from '../actions/materialUi';
// Containers
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
      open,
      message,
      closeSnack,
      action,
      onActionTap
    } = this.props;
    return (
      <StyleRoot>
        <MuiThemeProvider muiTheme={getMuiTheme(theme)} key='mainstyle'>
          <div>
            <Menu location={pathname} key='menumain'/>
            {this.props.children}
            <Snackbar
              open={open}
              message={message}
              onRequestClose={closeSnack}
              autoHideDuration={6000}
              action={action}
              onActionTouchTap={onActionTap}
              contentStyle={{ fontSize: '16px' }}
              bodyStyle={{
                background: `radial-gradient(${colors.transDarkGrey}, ${colors.PrimaryDark})`,
                maxWidth: 300
              }} />
            </div>
          </MuiThemeProvider>
      </StyleRoot>
    );
  }
}

const mapStateToProps = state => ({
  ...state.materialUi.snackBar
});

const mapDispatchToProps = dispatch => ({
  init: () => dispatch(initializeLock()),
  setScrollY: pos => dispatch(setScrollLoc(pos)),
  closeSnack: () => dispatch(hideSnackBar())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Radium(App));
