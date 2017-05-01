import * as d3 from 'd3';
import d3Wrap from 'react-d3-wrap';

let destroyFn;

let metaData;

const format = d3.format(',d');

const updateMetaData = (pack, D) => {
  console.log(D);
  const updateChild = metaData.children.find(c => c.id === D.data.id);
  if (updateChild && updateChild.hiddenChildren) {
    updateChild.children = [...updateChild.hiddenChildren];
    delete updateChild.hiddenChildren;
  }

  const root = d3.hierarchy(metaData)
    .sum(d => d.count);

  const old = d3.select('g')
    .selectAll('.node');

  old.remove();

  const node = d3.select('g')
    .selectAll('.node')
    .data(pack(root).descendants())
    .enter()
    .append('g')
      .attr('class', d => (d.children ? 'node' : 'leaf node'))
      .attr('transform', d => `translate(${d.x},${d.y})`);


  node.append('title')
    .text(d => `${d.data.name}\n${format(d.value)}`);

  node.append('circle')
    .attr('r', d => d.r)
    .attr('fill', d => (d.children ? 'url(#nodeBackground)' : 'url(#leafBackground)'))
    .on('click', updateMetaData.bind(null, pack));

  node.filter(d => !d.children)
    .append('text')
    .attr('dy', '0.3em')
    .attr('style', d =>
      (d.value > 35000 ? 'font-size: 12px' : 'font-size: 10px'))
    .text(d => d.data.name.replace('-', '-\n').substring(0, d.r / 3));

  console.log(node)
    // .append('g')
    //   .attr('class', d => (d.children ? 'node' : 'leaf node'))
    //   .attr('transform', d => `translate(${d.x},${d.y})`);
};

const LandingVisual = d3Wrap({
  initialize(svg, data, options) {
    d3.select(svg).selectAll('*').remove();
  },
  update(svg, data, { rendered, setRendered, setDestroyed }) {
    destroyFn = setDestroyed;
    if (!rendered && data.children && data.children.length) {
      metaData = { ...data };
      const vis = d3.select(svg).attr('id', 'd3root');
      const defs = vis
        .append('defs');

      const nodeGrad = defs.append('radialGradient')
          .attr('id', 'nodeBackground');

      const leafGrad = defs.append('radialGradient')
          .attr('id', 'leafBackground');

      nodeGrad.append('stop')
        .attr('offset', '10%')
        .attr('stop-color', 'rgba(31, 119, 180, 0.35)');
      nodeGrad.append('stop')
        .attr('offset', '95%')
        .attr('stop-color', 'rgba(31, 119, 180, 0.2)');

      leafGrad.append('stop')
        .attr('offset', '10%')
        .attr('stop-color', 'rgba(25, 240, 152, 0.95)');
      leafGrad.append('stop')
        .attr('offset', '95%')
        .attr('stop-color', 'rgba(30, 220, 152, 0.95)');

      const g = vis.append('g').attr('transform', 'translate(2,2)');

      const pack = d3.pack().size([996, 996]);

      const root = d3.hierarchy(metaData)
        .sum(d => d.count);
        // No need to sort, data is presorted in createHierarchy function


      const node = g.selectAll('.node')
        .data(pack(root).descendants())
        .enter().append('g')
          .attr('class', d => (d.children ? 'node' : 'leaf node'))
          .attr('transform', d => `translate(${d.x},${d.y})`);

      node.append('title')
        .text(d => `${d.data.name}\n${format(d.value)}`);

      const circles = node.append('circle')
        .attr('r', d => d.r)
        .attr('fill', d => (d.children ? 'url(#nodeBackground)' : 'url(#leafBackground)'))
        .on('click', updateMetaData.bind(null, pack));

      node.transition()
        .duration(2000);
      circles.transition()
        .duration(2000);

      node.filter(d => !d.children)
        .append('text')
        .attr('dy', '0.3em')
        .attr('style', d =>
          (d.value > 35000 ? 'font-size: 12px' : 'font-size: 10px'))
        .text(d => d.data.name.replace('-', '-\n').substring(0, d.r / 3));

      setRendered();
    }
  },
  destroy() {
    destroyFn();
  }
});

export default LandingVisual;
