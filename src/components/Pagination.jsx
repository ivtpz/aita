import React from 'react';
import Radium from 'radium';
import colors from '../theme/colors';

const range = function (start, end) {
  const a = [];
  for (let i = start; i <= end; i++) {
    a.push(i);
  }
  return a;
};

const styles = {
  container: {
    paddingTop: 30,
    display: 'flex',
    justifyContent: 'center',
    flex: '1 0 100%'
  },
  button: {
    padding: 4,
    color: colors.NeutralDark,
    textAlign: 'center',
    border: `2px solid ${colors.Mint}`,
    cursor: 'pointer',
    flex: '1 1 30px',
    ':hover': {
      color: colors.PrimaryBright
    }
  },
  notFirst: {
    borderLeft: 'none'
  },
  selected: {
    color: colors.PrimaryBright,
    backgroundColor: colors.Accent
  }
};

const Pagination = ({ total, page, setPage, perPage }) => {
  const totalPages = Math.ceil(total / perPage) - 1;
  let pageNums;
  if (totalPages <= 10) {
    pageNums = range(1, totalPages);
  } else if (page < 6) {
    pageNums = range(1, 8).concat([{
      text: '...',
      num: Math.floor((totalPages + 8) / 2)
    }, totalPages]);
  } else if (page < totalPages - 7) {
    pageNums = [1, {
      text: '...',
      num: Math.floor((1 + page) / 2)
    }].concat(range(page - 2, page + 3))
      .concat({
        text: '...',
        num: Math.floor((page + totalPages) / 2)
      }, totalPages);
  } else {
    pageNums = [1, {
      text: '...',
      num: Math.floor((1 + page) / 2)
    }].concat(range(totalPages - 7, totalPages));
  }
  const { button, notFirst, selected, container } = styles;
  return (
    <div style={container}>
      {pageNums.map((p, i) => {
        const num = typeof p === 'object' ? p.num : p;
        const bStyle = i ? { ...button, ...notFirst } : button;
        return (
          <div
            style={num === page ? [bStyle, selected] : bStyle}
            onTouchTap={() => setPage(num)}
            key={num}
          >{p.text || p}</div>
        );
      })}
    </div>
  );
};

export default Radium(Pagination);
