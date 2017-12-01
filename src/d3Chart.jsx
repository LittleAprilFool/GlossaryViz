import EventEmitter from 'events'
import * as d3 from 'd3'
import { join } from 'path'
import * as d3ScaleChromatic from 'd3-scale-chromatic'


var ns = {}

ns.create = function(el, props, data, updt) {
  this.selected = 0
  var svg = d3.select(el).append('svg')
      .attr('class', 'd3')
      .attr('width', props.width)
      .attr('height', props.height)
      .on('click', ()=>{
        this.selected = 0
        this.resethighlight()
        updt("Glossary Viz")
      })
  //var dispatcher = new EventEmitter()
  this.update(el, props, data, updt)
}

ns.update = function(el, props, data, updt) {
  data.link.forEach(function(d, i){
    d.source = isNaN(d.source) ? d.source : data.node[d.source]
    d.target = isNaN(d.target) ? d.target : data.node[d.target]
  })
  this._drawPoints(el, props, data, updt)
  var line0 = d3.line()
  .x(function(d) { return newX + (d.x * 5); })
  .y(function(d) { return newY + baselineY - (d.y * 5); })
  .curve(d3.curveLinear);
  this._drawLinks(el, props, data, updt)
}

ns._drawLinks = function(el, props, data, updt) {
  var svg = d3.select(el).selectAll('.d3')
  
  // scale to generate radians (just for lower-half of circle)
  var radians = d3.scaleLinear()
  .range([Math.PI / 2, 3 * Math.PI / 2])

  var currenty = 460
  // add links
  var link = svg.append('g')
    .attr('class', 'link')
    .selectAll('.link')
    .data(data.link)
    .enter().append('path')
    .attr('class', function(d){return 'alink ' + d.source.term})
    .attr('d', function(d){
      var radius = Math.abs(d.target.x - d.source.x - d.source.width / 2 + d.target.width / 2) / 2
      var arc = d3.arc()
        .innerRadius(radius)
        .outerRadius(radius)
        .startAngle(-Math.PI / 2)
        .endAngle(Math.PI / 2);
      return arc(); 
    })
    .attr('stroke','#ddd')
    .attr('stroke-width', 2)
    .attr('transform', function(d) {
      var radius = Math.abs(d.target.x - d.source.x - d.source.width / 2 + d.target.width / 2) / 2
      var xshift = d.source.x + d.source.width / 2 + radius
      var yshift = currenty
      return 'translate(' + xshift + ',' + yshift + ')'
    })
    .on("mouseover", (d)=>{
      if(this.selected == 0){
        updt(d.source.term)
        this.highlight(d.source.term)
      }
    })
    .on("mouseout", (d)=>{
      if(this.selected == 0){
        updt("Glossary Viz")
        this.resethighlight(d.source.term)
      }
    })
    .on("click", (e)=>{
      this.selected = 1
      d3.event.stopPropagation();
    })
}

ns._drawPoints = function (el, props, data, updt) {
  var svg = d3.select(el).selectAll('.d3')
  var i,j,node

//  data = data.slice(0, 20)  
  var currentx = 0
  var currentc = 1
  var innergap = 1
  var outtergap = 20
  var widthbase = 0.8
  var currenty = 460
  var heightbase = 15
  for (i=0; i < data.node.length; ++i) {
    node = data.node[i]
    if (node.chapter_int != currentc){
      currentc = node.chapter_int
      node.x = currentx + outtergap 
   }
    else {
      node.x = currentx
    }
    node.y = currenty
    node.width = node.number * widthbase
    currentx = node.x + node.width + innergap
    node.height = heightbase
  }
  var color = d3.scaleOrdinal(d3ScaleChromatic.schemeSet2)
  var node = svg.append('g')
    .attr('class', 'nodes')
    .selectAll('rect')
    .data(data.node)
    .enter().append('rect')
    .attr('x', function(d){return d.x})
    .attr('y', function(d){return d.y})
    .attr('width', function(d){return d.width})
    .attr('height', function(d){return d.height})
    .attr('id', function(d){return d.chapter_int})
    .attr('class', function(d){return 'blockterm '+ d.term})
    .on("mouseover", (d)=>{
      if(this.selected == 0){
        updt(d.term)
        this.highlight(d.term)
      }
      if(this.selected == 2){
        updt(d.term)
      }
    })
    .on("mouseout", (d)=>{
      if(this.selected == 0){
        updt("Glossary Viz")
        this.resethighlight(d.term)
      }
    })
    .on("click", (d)=>{
      this.selected = 1
      this.highlight(d.term)
      d3.event.stopPropagation();
    })
    .style("fill", function(d){
      return color((d.chapter_int * 7 + d.section_int) % 10)
    })
}

ns.highlight = function (term) {
  var allterm = d3.selectAll('.blockterm').style('fill', '#ddd')
  var related = d3.selectAll('.blockterm').filter('.'+term).style('fill', 'red')
  var relatedlink = d3.selectAll('.alink').filter('.'+ term).style('stroke', 'red')
}

ns.resethighlight = function () {
  var color = d3.scaleOrdinal(d3ScaleChromatic.schemeSet2)
  var allterm = d3.selectAll('.blockterm').style('fill', function(d){
    return color((d.chapter_int * 7 + d.section_int) % 10)
  })
  var relatedlink = d3.selectAll('.alink').style('stroke', '#ddd')
}

ns.matchhighlight = function (el, term) {
  if (term =='') {
    this.resethighlight
    this.selected = 0
  }
  else {
    this.selected = 2
    var allterm = d3.selectAll('.blockterm').style('fill', '#ddd')
    var test = d3.selectAll('.blockterm')
    .filter(function(d) { 
      const reg = new RegExp('^' + term)
      return (reg.test(d.term))
    })
    .style('fill', 'blue')
  }
}

ns.destroy = function(el) {

}

module.exports = ns