import EventEmitter from 'events'
import * as d3 from 'd3'
import { join } from 'path';

var ns = {}

ns.create = function(el, props, data) {
  var svg = d3.select(el).append('svg')
      .attr('class', 'd3')
      .attr('width', props.width)
      .attr('height', props.height)
  //var dispatcher = new EventEmitter()
  console.log(data)
  console.log(data.nodes)
  this.update(el, props, data)
}

ns.update = function(el, props, data) {
  this._drawPoints(el, props, data)
}

ns._drawPoints = function (el, props, data) {
  var svg = d3.select(el).selectAll('.d3')
  var idToNode = {}
  var groupSep = 10
  var i,j,node
  var nodeRadius = d3.scaleSqrt().range([3, 7]);
  
    
  data.nodes.forEach(function(n) {
    idToNode[n.id] = n
  })

  data.nodes.forEach(function(n) {
    n.chapters = n.chapters.map(function(chaps) {
      return chaps.split('.').map(function(c){
        return parseInt(c)
      })
    })
    n.chapters.sort(chapterCompare).reverse()
    n.firstChapter = n.chapters[0]
  })
    
  data.nodes.sort(function(a,b) {
    return chapterCompare(a.firstChapter, b.firstChapter)
  }).reverse()

  for (i = 0, j = 0; i < data.nodes.length; ++i) {
    node = data.nodes[i]
    if(i > 0 && data.nodes[i - 1].firstChapter[0] != node.firstChapter[0]) ++j
    node.x = j * groupSep + i * (props.width - 4 * groupSep) / (data.nodes.length - 1)
    node.y = props.height - 100
  }

  nodeRadius.domain(d3.extent(data.nodes, function(d) { return d.chapters.length}))

  var node = svg.append('g')
    .attr('class', 'nodes')
    .selectAll('circle')
    .data(data.nodes)
    .enter().append('circle')
    .attr('cx', function(d) {return d.x})
    .attr('cy', function(d) {return d.y})
    .attr('r', function(d) {return nodeRadius(d.chapters.length)})

  function chapterCompare (aChaps, bChaps) {
    if (aChaps[0] != bChaps[0])
      return bChaps[0] - aChaps[0];
    else if (aChaps[1] != bChaps[0])
      return bChaps[1] - aChaps[1];
    else if (aChaps[2] != bChaps[2])
      return bChaps[2] - aChaps[2];
    return 0;
  }
}

ns.destroy = function(el) {

}

module.exports = ns