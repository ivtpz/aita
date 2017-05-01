import * as d3 from 'd3';
import d3Wrap from 'react-d3-wrap';

let destroyFn;

let metaData;

const format = d3.format(',d');

const showChildren = ({ data: { id } }) => {
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
  update(svg, data, { rendered, setRendered, setDestroyed }) {
    // Keep gloabal access to redux destroy notification action
    destroyFn = setDestroyed;
    if (!rendered && data.children && data.children.length) {
      metaData = { ...data };
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
        .attr('stop-color', 'rgba(40, 120, 140, 0.85)');
      nodeGrad.append('stop')
        .attr('offset', '95%')
        .attr('stop-color', 'rgba(40, 120, 140, 0.6)');

      middleGrad.append('stop')
        .attr('offset', '10%')
        .attr('stop-color', 'rgba(25, 240, 152, 0.95)');
      middleGrad.append('stop')
        .attr('offset', '95%')
        .attr('stop-color', 'rgba(30, 220, 152, 0.95)');

      leafGrad.append('stop')
        .attr('offset', '10%')
        .attr('stop-color', 'rgba(255, 255, 255, 1)');
      leafGrad.append('stop')
        .attr('offset', '95%')
        .attr('stop-color', 'rgba(245, 245, 245, 0.95)');

      const g = vis.append('g').attr('transform', 'translate(2,2)');

      // Set borders of pack container, and padding between circles
      const pack = d3.pack()
        .size([996, 996])
        .padding(2);

      // Format data for packing
      const root = d3.hierarchy(metaData)
        .sum(d => d.count)
        .sort((a, b) => b.value - a.value);

      // Apply data and classes
      const node = g.selectAll('.node')
        .data(pack(root).descendants())
        .enter().append('g')
          // eslint-disable-next-line no-nested-ternary
          .attr('class', d => (d.data.id === 'root' ? 'node' : (d.children ? 'middle node' : 'leaf node')))
          .attr('transform', d => `translate(${d.x},${d.y})`);

      // Add titles for hover info
      node.append('title')
        .text(d => `${d.data.name}\n${format(d.value)} Papers`);

      const circles = node.append('circle');

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

      // Start with children hidden
      circles.filter(d => !d.children)
        .style('visibility', 'hidden')
        .style('fill-opacity', 0)
        .style('stroke-opacity', 0);

      // Add text to all data except root
      node.filter(d => d.data.id !== 'root')
        .append('text')
        .attr('dy', '0.3em')
        .text(d => d.data.name.substring(0, d.r / 3));

      node.filter(d => d.children)
        .select('text')
        .attr('style', 'font-size: 16px');

      // Hide child text
      node.filter(d => !d.children)
        .select('text')
        .attr('style', d =>
          (d.r > 48 ? 'font-size: 12px' : 'font-size: 10px'))
        .style('opacity', 0)
        .style('visibility', 'hidden');

      setRendered();
    }
  },
  destroy() {
    destroyFn();
  }
});

export default LandingVisual;
