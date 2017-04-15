import React, { Component } from 'react';
import { connect } from 'react-redux';
import Radium, { StyleRoot } from 'radium';
// Actions
import { initializeLock } from '../actions/auth';
// Components
import Menu from './Menu';

class App extends Component {

  componentDidMount() {
    this.props.init();
  }

  render() {
    return (
      <StyleRoot>
        <Menu />
        {this.props.children}
      </StyleRoot>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  init: () => dispatch(initializeLock())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Radium(App));
