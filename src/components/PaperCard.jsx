import React from 'react';
import { connect } from 'react-redux';

import Radium from 'radium';
import Categories from './Categories';
import ExpandableText from './ExpandableText';
import DownloadLink from './DownloadLink';
import colors from '../theme/colors';

// Actions
import { addReference, removeReference } from '../actions/user';

const styles = {
  card: {
    border: `1px solid ${colors.PrimaryDark}`,
    borderRadius: 4,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    margin: '20px 30px',
    boxShadow: `3px 3px 8px ${colors.NeutralDark}`,
    ':hover': {
      boxShadow: `4px 4px 10px ${colors.PrimaryDark}`
    },
    '@media (min-width: 480px)': {
      margin: '20px 30px',
      flex: '1 1 420px'
    },
    '@media (max-width: 480px)': {
      width: 310,
      margin: '20px 0px 20px 0px'
    }
  },
  heading: {
    backgroundColor: colors.PrimaryBright,
    borderRadius: '4px 4px 0px 0px',
    color: 'white',
    fontSize: '1.4em',
    padding: 4
  },
  body: {
    backgroundColor: 'white',
    padding: 8
  },
  author: {
    fontSize: '1.1em',
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
  },
  minus: {
    color: 'red'
  }
};

const PaperCard = ({
  data: {
    id, published, title, summary,
    author, link, category,
    primary_category: { _term }
  },
  addToUser,
  removeFromUser,
  references
}) => {
  const authors = Array.isArray(author) ?
  author.slice(0, 10).map((a, i) => (i === author.length - 1 ? a.name : `${a.name},`)) :
  [author.name];
  if (author.length > 10) authors.push('et al.');

  const refId = id.split('/').pop();
  const added = Array.isArray(references) ?
    references.includes(refId) :
    false;

  const {
    card, heading, body, foot, icon,
    mainText, publishedDate, minus
  } = styles;

  return (
    <div
      ref='card'
      key={`card${refId}`}
      style={card}
    >
      <div style={heading}>{title}</div>
      <div style={body}>
        {authors.map(name =>
          <div
            key={name + refId}
            style={name !== 'et al.' ?
              styles.author :
              [styles.author, { borderBottom: 'none' }]
            }
          >{name}</div>
        )}
        <i
          ref='plusIcon'
          key={`plusIcon${refId}`}
          style={added ? [icon, minus] : icon}
          className={added ? 'fa fa-minus-circle' : 'fa fa-plus-circle'}
          onTouchTap={added ? () => removeFromUser(refId) : () => addToUser(refId)}
        ></i>
        <div style={publishedDate} >{published.slice(0, 10)}</div>
        <Categories
          primary={_term}
          other={
            category.length &&
            category.filter(cat => cat._term !== _term)}
          total={category.length || 1}
        />
        <ExpandableText custStyle={mainText} text={summary} />
      </div>
      <div style={foot}>
        {link && link.map((l, i) =>
          <DownloadLink
            type={l._type} link={l._href} // eslint-disable-line
            id={i + refId}
            key={i + refId} />
        )}
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  references: state.user.references
});

const mapDispatchToProps = dispatch => ({
  addToUser: id => dispatch(addReference(id)),
  removeFromUser: id => dispatch(removeReference(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Radium(PaperCard));

