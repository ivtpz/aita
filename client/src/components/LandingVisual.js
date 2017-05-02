import * as d3 from 'd3';
import d3Wrap from 'react-d3-wrap';

let state;

let g;

const initialValues = {};

let initialized;

const initializeStateFromData = data => data.children.reduce((obj, c) => {
  obj[c.id] = { hidden: true }; // eslint-disable-line no-param-reassign
  return obj;
}, {});

const getInitialSort = root => true;

const format = d3.format(',d');

const showChildren = ({ data: { id } }) => {
  state[id].hidden = false;

  const parent = d3.selectAll('.node')
    .filter(d => d.data.id === id);

  parent.select('text')
    .transition()
      .duration(250)
      .style('opacity', 0);

  parent.select('circle')
    .on('click', hideChildren); // eslint-disable-line no-use-before-define

  const children = d3.selectAll('.node')
    .filter(d => d.parent && d.parent.data.id === id);

  children.select('text')
    .style('visibility', 'visible')
    .transition()
      .duration(700)
      .style('opacity', 1);

  children.select('circle')
    .style('visibility', 'visible')
    .transition()
      .duration(700)
      .style('stroke-opacity', 1)
      .style('fill-opacity', 1);
};

const hideChildren = ({ data: { id } }) => {
  state[id].hidden = true;

  const parent = d3.selectAll('.node')
    .filter(d => d.data.id === id);

  parent.select('text')
    .transition()
      .duration(700)
      .style('opacity', 1);

  parent.select('circle')
    .on('click', showChildren);

  const children = d3.selectAll('.node')
    .filter(d => d.parent && d.parent.data.id === id);

  children.select('text')
    .transition()
      .duration(250)
      .style('opacity', 0)
    .transition()
      .delay(250)
      .style('visibility', 'hidden');

  children.select('circle')
    .transition()
      .duration(250)
      .style('stroke-opacity', 0)
      .style('fill-opacity', 0)
    .transition()
      .delay(250)
      .style('visibility', 'hidden');
};

const LandingVisual = d3Wrap({
  initialize(svg) {
    d3.select(svg).selectAll('*').remove();
  },
  update(svg, data) {
    console.log('UPDATE TO D3');
    if (data.children && data.children.length) {
      if (!state) state = initializeStateFromData({ ...data });

      if (!initialized) {
        const vis = d3.select(svg).attr('id', 'd3root');
        // Append background gradient definitions
        const defs = vis
          .append('defs');

        const nodeGrad = defs.append('radialGradient')
            .attr('id', 'nodeBackground');

        const middleGrad = defs.append('radialGradient')
            .attr('id', 'middleBackground');

        const leafGrad = defs.append('radialGradient')
            .attr('id', 'leafBackground');

        nodeGrad.append('stop')
          .attr('offset', '30%')
          .attr('stop-color', 'rgba(117, 220, 205, 0.8)');
        nodeGrad.append('stop')
          .attr('offset', '95%')
          .attr('stop-color', 'rgba(163, 245, 207, 0.95)');

        middleGrad.append('stop')
          .attr('offset', '30%')
          .attr('stop-color', 'rgba(49, 135, 180, .9)');
        middleGrad.append('stop')
          .attr('offset', '95%')
          .attr('stop-color', 'rgba(51, 167, 194, 0.95)');

        leafGrad.append('stop')
          .attr('offset', '10%')
          .attr('stop-color', 'rgba(255, 255, 255, 1)');
        leafGrad.append('stop')
          .attr('offset', '95%')
          .attr('stop-color', 'rgba(245, 245, 245, 0.95)');

        g = vis.append('g').attr('transform', 'translate(2,2)');

        // Set borders of pack container, and padding between circles
      }

      const pack = d3.pack()
          .size([994, 994])
          .padding(3);

      // Format data for packing
      let root;
      if (!initialized) {
        root = pack(d3.hierarchy({ ...data })
          .sum(d => d.count)
          .sort((a, b) => {
            initialValues[a.data.id] = a.value;
            initialValues[b.data.id] = b.value;
            return b.value - a.value;
          }));
      } else {
        root = pack(d3.hierarchy({ ...data })
          .sum(d => d.count)
          .sort((a, b) => {
            const bVal = initialValues[b.data.id];
            const aVal = initialValues[a.data.id];
            if (!aVal) return 1;
            if (!bVal) return -1;
            return bVal - aVal;
          }));
      }

      // Apply data and classes
      const node = g.selectAll('.node')
        .data(root.descendants());

      node
        .transition()
          .duration(2000)
          .attr('transform', d => `translate(${d.x},${d.y})`);

      node.select('circle')
        .transition()
          .duration(2000)
          .attr('r', d => d.r);

      node.select('text')
        .transition()
          .delay(1500)
          .text(d => d.data.name.substring(0, d.r / 3));

      node.select('title')
        .transition()
          .delay(1500)
          .text(d => `${d.parent && d.parent.data.name} - ${d.data.name}\n${format(d.value)} Papers`);

      const newNodes = node.enter()
        .append('g')
        // eslint-disable-next-line no-nested-ternary
        .attr('class', d => (d.data.id === 'root' ? 'node' : (d.children ? 'middle node' : 'leaf node')))
        .attr('transform', d => `translate(${d.x},${d.y})`);

      const oldNodes = node
        .exit()
        .remove();
      console.log('removed', oldNodes);

      // Add titles for hover info
      newNodes.append('title')
        .text(d => `${d.parent && d.parent.data.name} - ${d.data.name}\n${format(d.value)} Papers`);

      const circles = newNodes.append('circle');

      circles
        .attr('r', d => d.r)
        .attr('fill', (d) => {
          if (d.data.id === 'root') return 'url(#nodeBackground)';
          return d.children ? 'url(#middleBackground)' : 'url(#leafBackground)';
        });

      // Click handlers for parents
      circles.filter(d => d.children && d.data.id !== 'root')
        .on('click', showChildren)
        .style('cursor', 'pointer');

      // Swap handlers for parents with displayed children
      circles.filter(d => state[d.data.id] && !state[d.data.id].hidden)
        .on('click', hideChildren);

      // Start with children hidden
      if (!initialized) {
        circles.filter(d => !d.children)
          .style('visibility', 'hidden')
          .style('fill-opacity', 0)
          .style('stroke-opacity', 0);
      } else {
        circles.filter(d => !d.children && state[d.parent.data.id].hidden)
          .style('visibility', 'hidden')
          .style('fill-opacity', 0)
          .style('stroke-opacity', 0);
      }

      // Add text to all data except root
      newNodes.filter(d => d.data.id !== 'root')
        .append('text')
        .attr('dy', '0.3em')
        .text(d => d.data.name.substring(0, d.r / 3));

      newNodes.filter(d => d.children)
        .select('text')
        .style('font-size', '18px')
        .style('fill', 'white');

      // Hide parent text if children are not hidden
      newNodes.filter(d => d.children && state[d.data.id] && !state[d.data.id].hidden)
        .select('text')
        .style('opacity', 0);

      const leaves = newNodes.filter(d => !d.children)
                         .select('text');

      leaves
        .attr('style', d =>
          (d.r > 48 ? 'font-size: 12px' : 'font-size: 10px'));

      // Hide child text
      if (!initialized) {
        leaves
          .style('opacity', 0)
          .style('visibility', 'hidden');
      } else {
        leaves.filter(d => state[d.parent.data.id].hidden)
          .style('opacity', 0)
          .style('visibility', 'hidden');
      }

      if (!initialized) initialized = true;
    } // else if ()
  },
  destroy() {
    d3.select('#d3root').selectAll('*').remove();
    state = undefined;
    initialized = false;
  }
});

export default LandingVisual;
