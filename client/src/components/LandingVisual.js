import * as d3 from 'd3';
import d3Wrap from 'react-d3-wrap';

const LandingVisual = d3Wrap({
  initialize(svg, data, options) {

  },
  update(svg, data, options) {
    console.log(svg)
    const vis = d3.select(svg);
    vis.append('circle')
      .attr('cx', 30)
      .attr('cy', 30)
      .attr('r', 10);
  },
  destroy() {

  }
});

export default LandingVisual;
