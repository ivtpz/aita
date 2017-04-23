import React from 'react';
import { connect } from 'react-redux';
import IconButton from 'material-ui/IconButton';
import Radium from 'radium';

import Authors from './Authors';
import Categories from './Categories';
import ExpandableText from './ExpandableText';
import DownloadLink from './DownloadLink';
import { colors } from '../theme/colors';

// Actions
import { addReference, removeReference } from '../actions/user';

const styles = {
  card: {
    border: `1px solid ${colors.NeutralDark}`,
    borderRadius: 4,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    margin: '20px 20px',
    maxWidth: 750,
    boxShadow: `3px 3px 8px ${colors.NeutralDark}`,
    ':hover': {
      boxShadow: `4px 4px 10px ${colors.PrimaryDark}`,
      border: `1px solid ${colors.PrimaryDark}`
    },
    '@media (min-width: 480px)': {
      margin: '20px 30px',
      flex: '1 1 420px'
    },
    '@media (max-width: 480px)': {
      width: '85%',
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
  publishedDate: {
    marginTop: 10
  },
  categoryContainer: {},
  mainText: {
    padding: '8px 8px 8px 0'
  },
  foot: {
    backgroundColor: colors.Accent,
    borderRadius: '0px 0px 4px 4px',
    padding: 6
  },
  iconContainer: {
    float: 'right'
  },
  icon: {
    color: colors.Mint,
    textShadow: `1px 1px 2px ${colors.NeutralDark}`,
    fontSize: 35,
    display: 'inline',
    cursor: 'pointer',
    ':hover': {
      textShadow: `2px 2px 4px ${colors.NeutralDark}`
    }
  },
  tooltip: {
    fontSize: '16px'
  },
  minus: {
    color: 'crimson'
  }
};

const PaperCard = ({
  data,
  addToUser,
  removeFromUser,
  references,
  width
}) => {
  const {
    id, published, title, summary,
    author, link, category,
    primary_category: { _term }
  } = data;

  const refId = id.split('abs/').pop();
  const added = Array.isArray(references) ?
    references.includes(refId) : false;

  const {
    card, heading, body, foot, icon, tooltip,
    mainText, publishedDate, minus, iconContainer
  } = styles;

  return (
    <div
      ref='card'
      key={`card${refId}`}
      style={card}
    >
      <div style={heading}>{title}</div>
      <div style={body}>
        <Authors authorData={author} />
        <IconButton
          key={`plusIcon${refId}`}
          style={iconContainer}
          tooltip={added ? 'Remove Reference' : 'Save Reference'}
          tooltipStyles={tooltip}
          tooltipPosition='top-center'
          hoveredStyle={{ top: '-2px' }}
          iconStyle={added ? { ...icon, ...minus } : icon}
          iconClassName={added ? 'fa fa-minus-circle' : 'fa fa-plus-circle'}
          onTouchTap={() => (added ? removeFromUser(refId) : addToUser(refId, data))}
        />
        <div style={publishedDate} >{published.slice(0, 10)}</div>
        <Categories
          primary={_term}
          other={
            category.length &&
            category.filter(cat => cat._term !== _term)}
          total={category.length || 1}
        />
        <ExpandableText
          custStyle={mainText}
          text={summary}
          width={width} />
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
  addToUser: (id, data) => dispatch(addReference(id, data)),
  removeFromUser: id => dispatch(removeReference(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Radium(PaperCard));

