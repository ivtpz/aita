import React, { Component } from 'react';
import colors from '../theme/colors';

const linkStyle = {
  color: colors.NeutralDark,
  fontSize: 25,
  display: 'inline',
  margin: '0px 5px 0px 5px',
  cursor: 'pointer'
};

class PaperCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      iconHover: false
    };
  }

  toggleHoverOn = () => this.setState({ hover: true });

  toggleHoverOff = () => this.setState({ hover: false });

  toggleIconHoverOn = () => this.setState({ iconHover: true });

  toggleIconHoverOff = () => this.setState({ iconHover: false });

  /**
   * @param {string} type
   * @param {string} link
   * @return {*} jsx
   */
  linkMaker = (type, link) => {
    let faclass;
    switch (type) {
      case 'application/pdf':
        faclass = 'pdf';
        break;
      case 'text/html':
        faclass = 'text';
        break;
      default:
        break;
    }
    if (faclass) {
      const className = `fa fa-file-${faclass}-o`;
      return (
        <a href={link} target='_blank' >
          <i
            style={linkStyle}
            className={className}
          ></i>
        </a>
      );
    }
    return null;
  }

  render() {
    const { 
      data: {
        id,
        published,
        title,
        summary,
        author,
        link
      }
    } = this.props;
    const authors = Array.isArray(author) ?
    author.map((a, i) => (i === author.length - 1 ? a.name : `${a.name},`)) :
    [author.name];
    const {
      card, heading, body, foot, icon,
      iconHover, mainText, authorStyle, hover
    } = styles;
    return (
      <div
        style={
          this.state.hover ?
            { ...card, ...hover } :
            card
        }
        onMouseEnter={this.toggleHoverOn}
        onMouseLeave={this.toggleHoverOff}
      >
        <div style={heading}>{title}</div>
        <div style={body}>
          {authors.map(name => <div style={authorStyle}>{name}</div>)}
          <i
            style={
              this.state.iconHover ?
                { ...icon, ...iconHover } :
                icon
            }
            className='fa fa-plus-circle'
            onMouseEnter={this.toggleIconHoverOn}
            onMouseLeave={this.toggleIconHoverOff}
          ></i>
          <div style={mainText} >{summary}</div>
        </div>
        <div style={foot}>
          {link && link.map(l =>
            this.linkMaker(l._type, l._href) // eslint-disable-line
          )}
        </div>
      </div>
    );
  }
}

const styles = {
  card: {
    border: `1px solid ${colors.PrimaryDark}`,
    borderRadius: 4,
    marginTop: 20,
    width: '85%',
    boxShadow: `3px 3px 8px ${colors.NeutralDark}`
  },
  hover: {
    boxShadow: `4px 4px 10px ${colors.PrimaryDark}`
  },
  heading: {
    backgroundColor: colors.PrimaryBright,
    borderRadius: '4px 4px 0px 0px',
    color: 'white',
    fontSize: '1.7em',
    padding: 4
  },
  body: {
    backgroundColor: 'white',
    padding: '8px 0 0 8px'
  },
  authorStyle: {
    borderBottom: `1px solid ${colors.NeutralDark}`,
    display: 'inline',
    color: colors.PrimaryDark,
    marginRight: 5
  },
  mainText: {
    padding: '8px 8px 8px 0'
  },
  foot: {
    backgroundColor: colors.Accent,
    // borderTop: `1px solid ${colors.NeutralDark}`,
    borderRadius: '0px 0px 4px 4px',
    padding: '4px'
  },
  icon: {
    color: colors.Mint,
    textShadow: `1px 1px 2px ${colors.NeutralDark}`,
    fontSize: 35,
    display: 'inline',
    float: 'right',
    marginRight: 15,
    cursor: 'pointer'
  },
  iconHover: {
    textShadow: `1px 1px 2px ${colors.PrimaryDark}`
  }
};

export default PaperCard;
