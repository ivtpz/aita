import React, { Component } from 'react';
import * as d3 from 'd3';
import d3Wrap from 'react-d3-wrap';
import dummy from '../helpers/dummyConnectionsD3Data.json';

console.log(dummy);

let g, vis, width, height, colors; // eslint-disable-line

let forceSimulation;

let stateData;

const deepClone = (data) => {
  if (typeof data !== 'object') return data;
  let clone;
  if (!Array.isArray(data)) {
    clone = {};
    Object.keys(data).forEach((k) => {
      clone[k] = deepClone(data[k]);
    });
  } else {
    clone = [];
    data.forEach(d => clone.push(deepClone(d)));
  }
  return clone;
};

const initializeData = (data) => {
  stateData = deepClone(data);
};

const updateData = (newData) => {
  stateData.nodes = [...stateData.nodes, ...newData.nodes];
  stateData.links = [...stateData.links, ...newData.links];
};

/* eslint-disable no-param-reassign */
const dragstarted = (d) => {
  if (!d3.event.active) forceSimulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
};

const dragged = (d) => {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
};

const dragended = (d) => {
  if (!d3.event.active) forceSimulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
};
/* eslint-enable no-param-reassign */

const ConnectionsVisual = d3Wrap({
  initialize(svg) {
    d3.select(svg).selectAll('*').remove();
  },
  update(svg, data) {
    width = svg.getAttribute('width');
    height = svg.getAttribute('height');
    if (data) {
      if (!stateData) {
        initializeData({ ...dummy });
        // initializeData({ ...data });
      } else {
        updateData({ ...dummy });
        // updateData({ ...data });
      }

      if (!vis) {
        vis = d3.select(svg).attr('id', 'd3root');
        // Append background gradient definitions
        const defs = vis
          .append('defs');

        colors = d3.scaleLinear()
          .domain([-1, 5])
          .range(['hsl(152,80%,80%)', 'hsl(228,30%,40%)'])
          .interpolate(d3.interpolateHcl);

        // TODO: adjust for final num groups
        for (let i = 1; i < 5; i++) {
          const b = defs.append('radialGradient')
            .attr('id', `background${i}`);

          b.append('stop')
            .attr('offset', '30%')
            .attr('stop-color', colors(i - 1));

          b.append('stop')
            .attr('offset', '95%')
            .attr('stop-color', colors(i));
        }

        forceSimulation = d3.forceSimulation()
          .force('link', d3.forceLink().id(d => d.id))
          .force('charge', d3.forceManyBody())
          .force('center', d3.forceCenter(width / 2, height / 2));

        // ========================= Apply data ============================== //
        // =========================== DEFINE ENTER ========================= //
        const link = vis.append('g')
          .attr('class', 'link')
          .selectAll('line')
          .data(stateData.links)
          .enter()
            .append('line')
            .attr('stroke-width', d => Math.sqrt(d.value));

        const node = vis.append('g')
          .attr('class', 'connection-node')
          .selectAll('circle')
          .data(stateData.nodes)
          .enter()
          .append('circle')
            .attr('r', 10)
            .attr('fill', d => colors(d.group))
            .call(d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended));

        node.append('title')
          .text(d => d.id);

        const ticked = () => {
          link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

          node
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
        };

        forceSimulation
          .nodes(stateData.nodes)
          .on('tick', ticked);

        forceSimulation
          .force('link')
          .links(stateData.links);
      }
// ========= EXIT ======== Remove old nodes ======================== //
    }
  },
  destroy() {
    d3.select('#d3root').selectAll('*').remove();
  }
});

class ConnectionsVisualPage extends Component {
  componentDidMount() {
    // TODO: get data
  }
  render() {
    return (
      <div>
        <ConnectionsVisual
          data={dummy}
          width={800}
          height={800}
        />
      </div>
    );
  }
}

export default ConnectionsVisualPage;
