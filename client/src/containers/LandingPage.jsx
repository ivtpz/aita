import React, { Component } from 'react';
import Radium from 'radium';
import LandingVisual from '../components/LandingVisual';
import ConnectionsVisual from '../components/ConnectionsVisual';
import { colors } from '../theme/colors';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  icon: {
    fontSize: '5em',
    color: colors.PrimaryDark
  },
  disabled: {
    color: colors.NeutralDark
  },
  iconContainer: {
    flexBasis: 200,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  active: {
    ':hover': {
      backgroundColor: colors.NeutralLight,
      cursor: 'pointer'
    }
  }
};

class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeVisualIndex: 1,
      totalVisuals: 2
    };
  }

  moveLeft = () => {
    const activeVisualIndex = Math.max(0, this.state.activeVisualIndex - 1);
    this.setState({ activeVisualIndex });
  };

  moveRight = () => {
    const activeVisualIndex =
      Math.min(this.state.totalVisuals - 1, this.state.activeVisualIndex + 1);
    this.setState({ activeVisualIndex });
  };

  render() {
    const visuals = [<LandingVisual />, <ConnectionsVisual />];
    const canMoveRight = this.state.activeVisualIndex < this.state.totalVisuals - 1;
    const canMoveLeft = this.state.activeVisualIndex > 0;
    const { container, iconContainer, icon, disabled, active } = styles;
    return (
      <div style={container}>
        <div
          style={canMoveLeft ? [iconContainer, active] : iconContainer}
          onClick={this.moveLeft}
          key="left">
          <i
            className="fa fa-caret-left"
            style={canMoveLeft ? icon : [icon, disabled]}></i>
        </div>
        {visuals[this.state.activeVisualIndex]}
        <div
          style={canMoveRight ? [iconContainer, active] : iconContainer}
          onClick={this.moveRight}
          key="right">
          <i
            className="fa fa-caret-right"
            style={canMoveRight ? icon : [icon, disabled]}></i>
        </div>
      </div>
    );
  }
}



export default Radium(LandingPage);
