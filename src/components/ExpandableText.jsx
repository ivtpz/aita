import React, { Component } from 'react';
import Radium from 'radium';
import colors from '../theme/colors';

const styles = {
  base: {
    // position: 'relative'
  },
  icon: {
    fontSize: '1.5em',
    margin: '0px 5px 0px 5px'
  },
  msg: {
    display: 'inline-block',
    color: colors.NeutralDark,
    cursor: 'pointer',
    ':hover': {
      color: colors.Mint
    }
  },
  transitionMaker(chars) {
    // WARNING: these need to change if font or size changes
    // and may not work in all browsers
    const charsPerLine = 85;
    const lineHeight = 19;
    const padding = 8 * 2;
    const error = 10;
    const content = (chars / charsPerLine) * lineHeight;
    const height = content + padding + error;
    this.hidden = {
      opacity: 0,
      maxHeight: 0,
      overflow: 'hidden',
      transition: `opacity ${height / 475}s ease-in, max-height ${height / 475}s ease-in`
    };
    this.visible = {
      opacity: 1,
      maxHeight: height,
      overflow: 'hidden',
      transition: `opacity ${height / 475}s ease-out, max-height ${height / 475}s ease-out`
    };
  }
};


class ExpandableText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      display: 'hidden'
    };
  }

  toggleExpansion = () => {
    const state = { ...this.state };
    state.expanded = !state.expanded;
    state.display = state.expanded ? 'visible' : 'hidden';
    this.setState(state);
  };

  render() {
    const { custStyle, text } = this.props;
    styles.transitionMaker(text.length);
    const open = 'fa fa-caret-down';
    const close = 'fa fa-caret-up';
    const openMsg = 'Show abstract';
    const closeMsg = 'Hide abstract';
    return (
      <div style={styles.base}>
        <div
          style={[
            custStyle,
            styles[this.state.display]
          ]}
        >{text}
        </div>
        <div
          style={styles.msg}
          onClick={this.toggleExpansion}
          ref={`expand${text.slice(0, 15)}`}
          key={`expand${text.slice(0, 15)}`}
        >
          <i
            style={styles.icon}
            className={this.state.expanded ? close : open}
          ></i>
          <span>{this.state.expanded ? closeMsg : openMsg}</span>
        </div>
      </div>
    );
  }
}

export default Radium(ExpandableText);
