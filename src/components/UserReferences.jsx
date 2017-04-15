import React, { Component } from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';
import { main, searchBox } from './sharedStyles';
// Actions
import filterUserRefs from '../actions/user';
// Components
import PaperCard from './PaperCard';
import SearchField from './SearchField';

const styles = {
  base: {}
};

// TODO: load in references from IDs

class UserReferences extends Component {

  render() {
    const { references, filterReferences } = this.props;
    return (
      <div style={main}>
        <div style={searchBox}>
          <SearchField
            onSearchInput={filterReferences}
          />
        </div>
        {references && references.length && references.map(r => <div>{r}</div>)}
      </div>
    );
  }
}

const mapStateToProps = ({
  user: { visibleReferences }
}) => ({ references: visibleReferences });

const mapDispatchToProps = dispatch => ({
  filterReferences: q => dispatch(filterUserRefs(q))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Radium(UserReferences));
