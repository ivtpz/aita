import React from 'react';
import Radium from 'radium';
// import categories from '../helpers/arxivCategories';

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    paddingTop: 5
  },
  primary: {
    fontWeight: 'bolder',
    paddingRight: 5
  },
  other: {
    paddingRight: 5
  }
};


// TODO: map to category names
// const mapToCat = (code) => {
//   const [subj, area] = code.split('.');
//   return categories[subj][area];
// };
const Categories = ({ primary, other, total }) => (
  <div style={styles.container}>
    <div
      style={styles.primary}>
        {total === 1 ? primary : `${primary}, `}
      </div>
    {other && other.length && other.map((cat, i) => (
      <div style={styles.other}>
        {i === other.length - 1 ? cat._term : `${cat._term}, `}
      </div>
    ))}
  </div>
);

export default Radium(Categories);

