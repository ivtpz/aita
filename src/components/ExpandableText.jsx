import React, { Component } from 'react';
import Measure from 'react-measure';
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
  transitionMaker(chars, width) {
    // WARNING: these need to change if font or size changes
    const charsPerLine = width / 7.2;
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
      display: 'hidden',
      width: 0
    };
  }

  toggleExpansion = () => {
    const state = { ...this.state };
    state.expanded = !state.expanded;
    state.display = state.expanded ? 'visible' : 'hidden';
    this.setState(state);
  };

  render() {
    const { display, expanded } = this.state;
    const { custStyle, text } = this.props;
    styles.transitionMaker(text.length, this.state.width);
    const open = 'fa fa-caret-down';
    const close = 'fa fa-caret-up';
    const openMsg = 'Show abstract';
    const closeMsg = 'Hide abstract';
    return (
      <Measure
        onMeasure={({ width }) => this.setState({ width })}
      >
        <div style={styles.base}>
          <div
            style={[
              custStyle,
              styles[display]
            ]}
          >{text}
          </div>
          <div
            style={styles.msg}
            onTouchTap={this.toggleExpansion}
            ref={`expand${text.slice(0, 15)}`}
            key={`expand${text.slice(0, 15)}`}
          >
            <i
              style={styles.icon}
              className={expanded ? close : open}
            ></i>
            <span>{expanded ? closeMsg : openMsg}</span>
          </div>
        </div>
      </Measure>
    );
  }
}

export default Radium(ExpandableText);
