import React, { Component } from 'react';
import { connect } from 'react-redux';
import LandingVisual from '../components/LandingVisual';

import { getSubjectCountData } from '../actions/arxiv';
import { initialize, destroy } from '../actions/d3Actions';

class LandingPage extends Component {

  componentDidMount() {
    this.props.fetch();
  }

  render() {
    const { data, initialized, setRendered, setDestroyed } = this.props;
    return (
      <div>
        <LandingVisual
          data={data}
          width={1000}
          height={1000}
          options={{
            rendered: initialized,
            setRendered,
            setDestroyed
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.arxiv.metaData,
  initialized: state.d3.initialized
});

const mapDispatchToProps = dispatch => ({
  fetch: () => dispatch(getSubjectCountData()),
  setRendered: () => dispatch(initialize()),
  setDestroyed: () => dispatch(destroy())
});

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);
