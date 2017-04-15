import React, { Component } from 'react';
import Measure from 'react-measure';
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
    margin: '30px 34px 0 34px',
    display: 'flex',
    justifyContent: 'center',
    flex: '1 0 85%'
  },
  button: {
    padding: 4,
    color: colors.NeutralDark,
    textAlign: 'center',
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: colors.Mint,
    cursor: 'pointer',
    flex: '1 1 30px',
    ':hover': {
      color: colors.PrimaryBright
    }
  },
  notFirst: {
    borderWidth: '2px 2px 2px 0px'
  },
  selected: {
    color: colors.PrimaryBright,
    backgroundColor: colors.Accent
  }
};

class Pagination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0
    };
  }

  setPageOptions = () => {
    const { total, page, perPage } = this.props;
    const { width } = this.state;
    let numOptions;
    if (width < 480) {
      numOptions = 7;
    } else if (width < 680) {
      numOptions = 10;
    } else if (width < 880) {
      numOptions = 14;
    } else if (width < 1260) {
      numOptions = 20;
    } else {
      numOptions = 26;
    }
    const totalPages = Math.ceil(total / perPage) - 1;
    if (totalPages <= numOptions) {
      return range(1, totalPages);
    } else if (page < (numOptions / 2) + 1) {
      return range(1, numOptions - 2).concat([{
        text: '...',
        num: Math.floor((totalPages + 8) / 2)
      }, totalPages]);
    } else if (page < totalPages - (numOptions - 3)) {
      return [1, {
        text: '...',
        num: Math.floor((1 + ((numOptions - 4) / 2)) / 2)
      }].concat(range(
        page - Math.floor((numOptions - 4) / 2),
        page + Math.floor((numOptions - 4) / 2)
      )).concat({
        text: '...',
        num: Math.floor((((numOptions - 4) / 2) + totalPages) / 2)
      }, totalPages);
    }
    return [1, {
      text: '...',
      num: Math.floor((1 + page) / 2)
    }].concat(range(totalPages - (numOptions - 3), totalPages));
  };

  render() {
    const { button, notFirst, selected, container } = styles;
    const { setPage, page, name } = this.props;
    const pageNums = this.setPageOptions();
    return (
      <Measure
        onMeasure={({ width }) => this.setState({ width })}
      >
        <div style={container}>
          {pageNums.map((p, i) => {
            const num = typeof p === 'object' ? p.num : p;
            const bStyle = i ? { ...button, ...notFirst } : button;
            return (
              <div
                style={num === page ? [bStyle, selected] : bStyle}
                onTouchTap={() => setPage(num)}
                key={num + name + Math.floor(Math.random() * 1000)}
              >{p.text || p}</div>
            );
          })}
        </div>
      </Measure>
    );
  }
}

export default Radium(Pagination);
