/* global window, document */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Radium, { StyleRoot } from 'radium';
// Actions
import { initializeLock } from '../actions/auth';
import { setScrollLoc } from '../actions/window';
// Components
import Menu from './Menu';

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
    return (
      <StyleRoot>
        <Menu location={this.props.location.pathname}/>
        {this.props.children}
      </StyleRoot>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  init: () => dispatch(initializeLock()),
  setScrollY: pos => dispatch(setScrollLoc(pos))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Radium(App));
