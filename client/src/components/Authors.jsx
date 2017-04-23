import React from 'react';
import Radium from 'radium';

import { colors } from '../theme/colors';

const styles = {
  base: {
    fontSize: '1.1em',
    borderBottom: `1px solid ${colors.NeutralDark}`,
    display: 'inline',
    color: colors.PrimaryDark,
    marginRight: 5
  },
  etal: {
    borderBottom: 'none'
  }
};

const Authors = ({ authorData }) => {
  const authors = Array.isArray(authorData) ?
  authorData.slice(0, 10).map((a, i) => (i === authorData.length - 1 ? a.name : `${a.name},`)) :
  [authorData.name];
  if (authorData.length > 10) authors.push('et al.');
  return (
    <div>
      {authors.map((name, i) =>
        <div
        key={name + i}
        style={name !== 'et al.' ?
            styles.base :
            [styles.base, styles.etal]
        }
        >{name}</div>
      )}
    </div>
  );
};

export default Radium(Authors);
