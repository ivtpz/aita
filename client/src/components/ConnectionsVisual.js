import React, { Component } from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';
import * as d3 from 'd3';
import d3Wrap from 'react-d3-wrap';
import RaisedButton from 'material-ui/RaisedButton';

import SearchField from '../components/SearchField';

import {
  getConnectionDataByAuthor,
  setAuthorQuery,
  getCoAuthorData } from '../actions/arxiv';
import dummy from '../helpers/dummyConnectionsD3Data.json';

let g, vis, width, height, d3Colors; // eslint-disable-line

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
  stateData = deepClone(newData);
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
    if (data.length || data.nodes) {
      if (!stateData) {
        // initializeData({ ...data[0] });
        initializeData({ ...data });
      } else {
        // updateData({ ...data[1] });
        updateData({ ...data });
      }

      if (!vis) {
        vis = d3.select(svg).attr('id', 'd3root');


        d3Colors = [
          d3.scaleLinear()
          .domain([-1, 10])
          .range(['hsl(235,40%,60%)', 'hsl(245,60%,70%)'])
          .interpolate(d3.interpolateHcl),
          d3.scaleLinear()
          .domain([-1, 6])
          .range(['hsl(228,50%,60%)', 'hsl(235,40%,60%)'])
          .interpolate(d3.interpolateHcl),
          d3.scaleLinear()
          .domain([-1, 21])
          .range(['hsl(200,60%,50%)', 'hsl(228,50%,60%)'])
          .interpolate(d3.interpolateHcl),
          d3.scaleLinear()
          .domain([-1, 8])
          .range(['hsl(190,80%,60%)', 'hsl(200,60%,50%)'])
          .interpolate(d3.interpolateHcl),
          d3.scaleLinear()
          .domain([-1, 5])
          .range(['hsl(180,70%,50%)', 'hsl(190,80%,60%)'])
          .interpolate(d3.interpolateHcl),
          d3.scaleLinear()
          .domain([-1, 32])
          .range(['hsl(152,80%,80%)', 'hsl(160,80%,30%)'])
          .interpolate(d3.interpolateHcl),
          d3.scaleLinear()
          .domain([-1, 6])
          .range(['hsl(40,70%,55%)', 'hsl(50,70%,60%)'])
          .interpolate(d3.interpolateHcl),
          d3.scaleLinear()
          .domain([-1, 36])
          .range(['hsl(25,60%,45%)', 'hsl(20,80%,50%)'])
          .interpolate(d3.interpolateHcl),
          d3.scaleLinear()
          .domain([-1, 10])
          .range(['hsl(0,50%,30%)', 'hsl(0,80%,50%)'])
          .interpolate(d3.interpolateHcl)
        ];
      }

      forceSimulation = d3.forceSimulation()
        .force('link',
          d3.forceLink()
            .distance(50)
            .strength(0.8)
            .id(d => d.id)
        )
        .force('charge',
          d3.forceManyBody()
            .strength(-50)
        )
        .force('center', d3.forceCenter(width / 2, height / 2));

        // ========================= Apply data ============================== //
        // =========================== DEFINE ENTER ========================= //
      vis.selectAll('g').remove();

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
          .attr('r', d => Math.sqrt(d.paperData.length) * 2)
          .attr('fill', (d) => {
            const gradient = d3Colors[d.group[0] - 1];
            console.log(gradient)
            return gradient(d.group[1]);
          })
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
// ========= EXIT ======== Remove old nodes ======================== //
    }
  },
  destroy() {
    d3.select('#d3root').selectAll('*').remove();
  }
});

const styles = {
  container: {
    paddingTop: 100,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  iconPosition: {
    top: '-23px',
    left: '96%'
  },
  searchContainer: {
    display: 'flex'
  },
  button: {
    width: 200
  }
};

// PRIMARY TODOS: test color by subcategory
// get better dummy data
// make sure coauthor fetching works

class ConnectionsVisualPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: dummy[0]
    };
  }
  componentDidMount() {
    // TODO: get data
    setTimeout(() => this.setState({ data: dummy[1] }), 5000);
  }
  render() {
    const {
      searchAuthor, setQuery,
      data, nextCoAuthors,
      getCoAuthors
    } = this.props;
    return (
      <div style={styles.container}>
        {nextCoAuthors.length ?
          <RaisedButton
            label="Add Collaborators"
            style={styles.button}
            onTouchTap={getCoAuthors} />
          : <div style={styles.searchContainer}>
            <SearchField
              onSearchInput={setQuery}
              search={searchAuthor}
              filter="Author's full name"
            />
          </div>
        }
        <ConnectionsVisual
          data={this.state.data}
          width={800}
          height={800}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.arxiv.authorConnectionData,
  nextCoAuthors: state.arxiv.coAuthors
});

const mapDispatchToProps = dispatch => ({
  searchAuthor: () => dispatch(getConnectionDataByAuthor()),
  setQuery: e => dispatch(setAuthorQuery(e.target.value)),
  getCoAuthors: () => dispatch(getCoAuthorData())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Radium(ConnectionsVisualPage));
