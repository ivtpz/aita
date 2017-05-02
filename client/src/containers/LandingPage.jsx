import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'material-ui/Slider';
import LandingVisual from '../components/LandingVisual';

import { getSubjectCountData } from '../actions/arxiv';
import { initialize, destroy } from '../actions/d3Actions';
import { updateD3YearSlider, setSliderDrag } from '../actions/materialUi';

import { colors } from '../theme/colors';

const styles = {
  slideContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  slider: {
    width: '65%'
  },
  sliderTitle: {
    color: colors.PrimaryDark
  },
  year: {
    color: colors.PrimaryBright
  }
};

class LandingPage extends Component {

  componentDidMount() {
    this.props.fetch(this.props.sliderValue);
  }

  componentWillReceiveProps({ dragging, sliderValue }) {
    const { prevSliderValue } = this.props;
    if (!dragging && prevSliderValue !== sliderValue) {
      console.log('SHOULD FETCH DATA for ', sliderValue);
      this.props.fetch(sliderValue);
    }
  }

  render() {
    const {
      data, initialized,
      setRendered, setDestroyed,
      sliderValue, handleSlide,
      handleDragStart, handleDragStop
    } = this.props;
    const currYear = new Date().getFullYear();
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
        <div style={styles.slideContainer}>
          <div style={styles.sliderTitle}>
            Papers published in <span style={styles.year}>{sliderValue}</span>
          </div>
          <Slider
            min={1995}
            step={1}
            max={currYear}
            value={sliderValue}
            onChange={handleSlide}
            onDragStop={handleDragStop}
            onDragStart={handleDragStart}
            style={styles.slider}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.arxiv.metaData,
  prevSliderValue: state.arxiv.metaDataYear,
  initialized: state.d3.initialized,
  sliderValue: state.materialUi.slider.value,
  dragging: state.materialUi.slider.dragging
});

const mapDispatchToProps = dispatch => ({
  fetch: year => dispatch(getSubjectCountData(year)),
  setRendered: () => dispatch(initialize()),
  setDestroyed: () => dispatch(destroy()),
  handleSlide: (e, value) => dispatch(updateD3YearSlider(value)),
  handleDragStart: () => dispatch(setSliderDrag(true)),
  handleDragStop: () => dispatch(setSliderDrag(false))
});

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);
