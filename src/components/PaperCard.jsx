import React from 'react';
import Radium from 'radium';
import Categories from './Categories';
import DownloadLink from './DownloadLink';
import colors from '../theme/colors';

const styles = {
  card: {
    border: `1px solid ${colors.PrimaryDark}`,
    borderRadius: 4,
    marginTop: 20,
    width: '85%',
    boxShadow: `3px 3px 8px ${colors.NeutralDark}`,
    ':hover': {
      boxShadow: `4px 4px 10px ${colors.PrimaryDark}`
    }
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
  author: {
    fontSize: '1.3em',
    borderBottom: `1px solid ${colors.NeutralDark}`,
    display: 'inline',
    color: colors.PrimaryDark,
    marginRight: 5
  },
  publishedDate: {
    marginTop: 10
  },
  categoryContainer: {},
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
    cursor: 'pointer',
    ':hover': {
      textShadow: `1.5px 1.5px 3px ${colors.PrimaryDark}`
    }
  }
};

const PaperCard = ({
  data: {
    id, published, title, summary,
    author, link,
    primary_category: { _term },
    category
  } }) => {
  const authors = Array.isArray(author) ?
  author.map((a, i) => (i === author.length - 1 ? a.name : `${a.name},`)) :
  [author.name];

  const {
    card, heading, body, foot, icon, mainText, publishedDate
  } = styles;

  return (
    <div
      ref='card'
      key={`card${id}`}
      style={card}
    >
      <div style={heading}>{title}</div>
      <div style={body}>
        {authors.map(name =>
          <div key={name + id} style={styles.author}>{name}</div>
        )}
        <i
          ref='icon'
          key={2}
          style={icon}
          className='fa fa-plus-circle'
        ></i>
        <div style={publishedDate} >{published.slice(0, 10)}</div>
        <Categories
          primary={_term}
          other={category.filter(cat => cat._term !== _term)}
        />
        <div style={mainText} >{summary}</div>
      </div>
      <div style={foot}>
        {link && link.map((l, i) =>
          <DownloadLink
            type={l._type} link={l._href} // eslint-disable-line
            id={i + id}
            key={i + id} />
        )}
      </div>
    </div>
  );
};

export default Radium(PaperCard);
