import React from 'react';
import colors from '../theme/colors';

const PaperCard = ({
  data: {
    id,
    published,
    title,
    summary,
    author: { name }
  }
}) => {
  const { card, heading } = styles;
  return (
    <div style={card} >
      <div style={heading}>{title}</div>
      <p>{name}</p>
      <p>{summary}</p>
    </div>
  );
};

const styles = {
  card: {
    border: `1px solid ${colors.PrimaryDark}`,
    borderRadius: '4px',
    marginTop: '20px'
  },
  heading: {
    backgroundColor: colors.PrimaryBright,
    color: 'white',
    fontSize: '1.7em',
    padding: '4px'
  }
};

export default PaperCard;
