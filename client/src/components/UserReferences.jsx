import React, { Component } from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';
import { main, searchBox, resultsContainer } from './sharedStyles';
// Actions
import { filterUserRefs, makeUserRefsVisible } from '../actions/user';
// Components
import PaperCard from './PaperCard';
import SearchField from './SearchField';


class UserReferences extends Component {

  componentDidMount() {
    this.props.makeVisible();
  }

  render() {
    const { references, filterReferences } = this.props;
    return (
      <div style={main}>
        <div style={searchBox}>
          <SearchField
            onSearchInput={filterReferences}
            filter={'filter...'}
          />
        </div>
        <div style={resultsContainer}>
          {references && references.map(result =>
            <PaperCard key={result.id} data={result} />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  user: { visibleReferences }
}) => ({ references: visibleReferences });

const mapDispatchToProps = dispatch => ({
  filterReferences: e => dispatch(filterUserRefs(e.target.value)),
  makeVisible: () => dispatch(makeUserRefsVisible())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Radium(UserReferences));
