import React, { Component } from 'react';
import colors from '../theme/colors';

const border = `3px solid ${colors.Mint}`;

const linkStyle = {
  color: colors.NeutralDark,
  height: 25,
  borderLeft: border,
  padding: '4px 8px 4px 8px',
  fontSize: '1.2em',
  cursor: 'pointer'
};

const rightBorder = {
  borderRight: border
};

const lastStyle = {
  ...linkStyle,
  ...rightBorder
};

const hover = {
  color: colors.PrimaryDark
};

class MenuLink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false
    };
  }

  toggleHoverOn = () => this.setState({ hover: true });

  toggleHoverOff = () => this.setState({ hover: false });

  render() {
    const { action, text, last } = this.props;
    const style = !last ? linkStyle : lastStyle;
    const hoverStyle = !last ?
      { ...linkStyle, ...hover } :
      { ...lastStyle, ...hover };
    return (
      <div
        style={this.state.hover ? hoverStyle : style}
        onMouseEnter={this.toggleHoverOn}
        onMouseLeave={this.toggleHoverOff}
        onClick={action}
      > {text}
      </div>
    );
  }
}

export default MenuLink;
