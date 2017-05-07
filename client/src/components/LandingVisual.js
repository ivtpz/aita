import * as d3 from 'd3';
import d3Wrap from 'react-d3-wrap';
import dummy from '../helpers/dummyD3Data.json';

console.log(dummy);

let g, vis, root, topLevel, circle;

const initialValues = {};

let lostChildren = {};

let stateData;

// =========================== HELPER FUNCTIONS ================== //

const deepCloneAndHide = (data) => {
  if (typeof data !== 'object') return data;
  let clone;
  if (!Array.isArray(data)) {
    clone = {};
    Object.keys(data).forEach((k) => {
      clone[k] = deepCloneAndHide(data[k]);
    });
    if (clone.children) {
      clone.hidden = true;
    }
  } else {
    clone = [];
    data.forEach(d => clone.push(deepCloneAndHide(d)));
  }
  return clone;
};

const initializeData = (data) => {
  stateData = deepCloneAndHide(data);
};

const updateData = (newData, state = stateData) => {
  if (typeof state.count === 'number') {
    state.count = newData.count;
  }

  if (state.children) {
    state.children.forEach((subCat) => {
      const newSubCat = newData.children.find(c =>
        c.id === subCat.id
      );

      if (newSubCat) {
        // This else if is to handle astrophysics
        if (subCat.children && !newSubCat.children) {
          lostChildren[subCat.id] = [...subCat.children];
          subCat.count = newSubCat.count;
          delete subCat.children;
          return;
        } else if (!subCat.children && newSubCat.children) {
          subCat.children = lostChildren[subCat.id];
          delete subCat.count;
          delete lostChildren[subCat.id];
        }

        updateData(newSubCat, subCat);
      } else {
        subCat.count = 0;
      }
    });
  }
};

const format = d3.format(',d');

const findAndUpdate = (id, update) => {
  let found = false;
  let queue = stateData.children;
  let queueIndex = 0;
  while (!found && queueIndex < queue.length) {
    const curr = queue[queueIndex];
    if (curr.id === id) {
      curr.hidden = update;
      found = true;
    } else if (curr.children) {
      queue = queue.concat(curr.children);
    }
    queueIndex++;
  }
};


// =========== TESTS FOR ELEMENT TYPE ======================================= //

const isRoot = d => d.data.id === 'root';

const isNotRoot = d => d.data.id !== 'root';

const isMiddleNode = d => !isRoot(d) && d.children && d.depth === 1;

const isSubMiddleNode = d => !isRoot(d) && !isMiddleNode(d) && d.children;

const isClickableParent = d => isMiddleNode(d) || isSubMiddleNode(d);

const isLeaf = d => !d.children;

const isHiddenChild = d => (isLeaf(d) || isSubMiddleNode(d)) && (d.parent.data.hidden);

const isDisplayedChild = d => (isLeaf(d) || isSubMiddleNode(d)) && (!d.parent.data.hidden);

// ================================= CLICK HANDLERS ============================ //

//                 // ============== ZOOM DEFINITION ============== //
let focus;
let view;
const margin = 5;
const diameter = vis ? vis.attr('width') : 800;

const zoom = (target) => {
  focus = target;

  topLevel.filter(d => !isRoot(d) && d.data.id === focus.data.id)
    .on('click', hideChildren);

  if (focus.data.id === 'root') {
    d3.selectAll('.node')
      .select('text')
      .transition()
      .delay(400)
      .text(d => d.data.name.substring(0, d.r / 3));
  } else {
    d3.selectAll('.node')
      .select('text')
      .transition()
      .delay(400)
      .text(d => d.data.name.substring(0, d.r / 1.7));
  }

  d3.transition()
    .duration(d3.event.altKey ? 7500 : 750)
    .tween('zoom', function(d) {
      var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
      return function(t) {
        zoomTo(i(t));
      };
    });
}

const zoomTo = (v) => {
  if (v && Array.isArray(v) && !isNaN(v[0])) {
    const k = diameter / v[2];
    view = v;
    if (topLevel) topLevel
      .attr('transform', d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
    if (circle) circle
      .attr('r', d => d.r * k);
  }
}

// ================= SHOW AND HIDE =========================== //

const showChildren = ({ data: { id } }) => {
  findAndUpdate(id, false);

  const parent = d3.selectAll('.node')
    .filter(d => d.data.id === id);

  parent.select('text')
    .on('click', hideChildren)
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
  findAndUpdate(id, true);

  const parent = d3.selectAll('.node')
    .filter(d => d.data.id === id);

  parent.select('text')
    .on('click', showAndZoom)
    .transition()
      .duration(700)
      .style('opacity', 1);

  parent.select('circle')
    .on('click', showAndZoom);

  const children = d3.selectAll('.node')
    .filter(d => d.parent && d.parent.data.id === id);

  children.each((d) => {
    if (d.children) {
      hideChildren(d);
    }
  });

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

const showAndZoom = (d) => {
  showChildren(d);
  zoom(d);
};

const hideAndZoom = (d) => {
  hideChildren(d);
  zoom(d);
};

// ================== D3 WRAPPER ==================== //

const LandingVisual = d3Wrap({
  initialize(svg) {
    d3.select(svg).selectAll('*').remove();
  },
  update(svg, data) {
    if (data.children && data.children.length) {
      if (!stateData) {
        // initializeData({ ...dummy[0] });
        initializeData({ ...data });
      } else {
        const rand = Math.floor(Math.random()*2)
        // updateData({ ...dummy[rand] });
        updateData({ ...data });
      }

      if (!g) {
        vis = d3.select(svg).attr('id', 'd3root');
        // Append background gradient definitions
        const defs = vis
          .append('defs');

        const nodeGrad = defs.append('radialGradient')
            .attr('id', 'nodeBackground');

        const middleGrad = defs.append('radialGradient')
            .attr('id', 'middleBackground');

        const subMiddleGrad = defs.append('radialGradient')
            .attr('id', 'subMiddleBackground');

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
          .attr('stop-color', 'rgba(51, 167, 194, 0.95)');
        middleGrad.append('stop')
          .attr('offset', '95%')
          .attr('stop-color', 'rgba(77, 194, 202, 0.95)');

        subMiddleGrad.append('stop')
          .attr('offset', '30%')
          .attr('stop-color', 'rgba(49, 135, 180, .9)');
        subMiddleGrad.append('stop')
          .attr('offset', '95%')
          .attr('stop-color', 'rgba(51, 167, 194, 0.95)');

        leafGrad.append('stop')
          .attr('offset', '10%')
          .attr('stop-color', 'rgba(255, 255, 255, 1)');
        leafGrad.append('stop')
          .attr('offset', '95%')
          .attr('stop-color', 'rgba(245, 245, 245, 0.95)');

        g = vis.append('g').attr('transform', 'translate(2,2)');
      }

      // Set borders of pack container, and padding between circles
      const pack = d3.pack()
          .size([794, 794])
          .padding(3);

      // Format data for packing
      if (!Object.keys(initialValues).length) {
        root = pack(d3.hierarchy({ ...stateData })
          .sum(d => d.count)
          .sort((a, b) => {
            initialValues[a.data.id] = a.value;
            initialValues[b.data.id] = b.value;
            return b.value - a.value;
          }));
      } else {
        const hi = d3.hierarchy({ ...stateData });
        const hD = hi.sum(d => d.count);
        root = pack(
        hD.sort((a, b) => {
          // Maintain original sorting order to minimize parent switching
          const aVal = initialValues[a.data.id];
          const bVal = initialValues[b.data.id];
          if (!aVal || !bVal) return 0;
          return bVal - aVal;
        }));
      }

      // ======================= Apply data ============================== //

      const node = g.selectAll('.node')
        .data(root.descendants());


      // ======================== DEFINE UPDATE =========================== //

      node
        .transition()
          .duration(2000)
          .attr('transform', d => `translate(${800/2},${800/2})`);

      node.select('circle')
        .filter(isHiddenChild)
          .style('visibility', 'hidden')
          .style('fill-opacity', 0)
          .style('stroke-opacity', 0);

      node.select('circle')
        .transition()
          .duration(2000)
          .attr('r', d => d.r);

      node.select('circle')
        .filter(isDisplayedChild)
        .transition()
          .delay(1500)
          .style('visibility', 'visible')
          .style('fill-opacity', 1)
          .style('stroke-opacity', 1);

      // For astrophysics
      node.filter(isLeaf)
        .select('text')
        .style('fill', 'black')
        .attr('style', d =>
          (d.r > 48 ? 'font-size: 12px' : 'font-size: 10px'));

      node.select('circle')
        .filter(isLeaf)
        .style('cursor', 'default')
        .on('click', () => true)
        .attr('fill', 'url(#leafBackground)');

      node.filter(isSubMiddleNode)
        .select('text')
        .style('font-size', '18px')
        .style('fill', 'white');

      const subMidCircles = node.select('circle')
        .filter(isSubMiddleNode);

      subMidCircles
        .style('cursor', 'pointer')
        .attr('fill', 'url(#subMiddleBackground)');

      subMidCircles.filter(d => d.data.hidden)
        .on('click', showAndZoom);

      subMidCircles.filter(d => !d.data.hidden)
        .on('click', hideChildren);

      node.select('text')
        .filter(d => !d.children && d.parent.data.hidden)
          .style('opacity', 0)
          .style('visibility', 'hidden');

      node.select('text')
        .filter(d => !d.children && !d.parent.data.hidden)
          .style('opacity', 1)
          .style('visibility', 'visible');

      node.select('text')
        .transition()
          .delay(1000)
          .text(d => d.data.name.substring(0, d.r / 3));

      node.select('title')
        .text(d =>
          `${d.parent && d.parent.data.id !== 'root' ? d.parent.data.name + ' - ' : ''}\
${d.data.name}\n${format(d.value)} Papers`);

// ========= EXIT ======== Remove old nodes ======================== //

      node.exit()
        .remove();

// =========================== DEFINE ENTER ========================= //

      // Apply classes
      const newNodes = node.enter()
        .append('g')
        // eslint-disable-next-line no-nested-ternary
        .attr('class', (d) => {
          if (d.data.id === 'root') return 'node';
          if (d.children) return d.depth === 1 ? 'middle node' : 'sub-middle node';
          return 'leaf node';
        })
        .attr('transform', d => `translate(${800/2},${800/2})`);


      // Add titles for hover info
      newNodes.append('title')
        .text(d =>
          `${(d.parent && d.parent.data.id !== 'root') ? d.parent.data.name + ' - ' : ''}\
${d.data.name}\n${format(d.value)} Papers`);

      const circles = newNodes.append('circle');

      // Apply backgrounds
      circles
        .attr('r', d => d.r)
        .attr('fill', (d) => {
          if (d.data.id === 'root') return 'url(#nodeBackground)';
          if (d.children) return d.depth === 1 ? 'url(#middleBackground)' : 'url(#subMiddleBackground)';
          return 'url(#leafBackground)';
        });

      // click handler for root
      circles.filter(isRoot)
        .on('click', zoom);

      // Click handlers for parents
      circles.filter(isClickableParent)
        .on('click', showAndZoom)
        .style('cursor', 'pointer');

      // Start with children hidden if parent has not been clicked
      circles.filter(d => (isSubMiddleNode(d) || isLeaf(d)) && d.parent.data.hidden)
        .style('visibility', 'hidden')
        .style('fill-opacity', 0)
        .style('stroke-opacity', 0);

      // Add text to all data except root
      newNodes.filter(isNotRoot)
        .append('text')
        .attr('dy', '0.3em')
        .text(d => d.data.name.substring(0, d.r / 3));

      // Use larger font for general categories
      newNodes.filter(d => d.children)
        .select('text')
        .style('font-size', '18px')
        .style('fill', 'white');

      newNodes.filter(isLeaf)
        .select('text')
        .attr('style', d =>
          (d.r > 48 ? 'font-size: 12px' : 'font-size: 10px'));

      // Hide child text
      newNodes.filter(isHiddenChild)
        .select('text')
        .style('opacity', 0)
        .style('visibility', 'hidden');

      topLevel = g.selectAll('circle,text');
      circle = g.selectAll('circle');
      if (!view) {
        zoomTo([root.x, root.y, root.r * 2 + margin]);
      } else {
        zoom(view)
      }
    }
  },
  destroy() {
    d3.select('#d3root').selectAll('*').remove();
  }
});

export default LandingVisual;
