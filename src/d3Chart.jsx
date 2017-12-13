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
  this._predraw(data)
  this._drawLinks(el, props, data, updt)
  this._drawPoints(el, props, data, updt)
  this._drawList(el, props, data, updt)
  // this._drawBrush(el, props, data, updt)
}
ns._drawBrush = function(el, props, data, updt) {
  function brushed() {
    console.log("hhhh")
    // if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
    // var s = d3.event.selection || x2.range();
    // x.domain(s.map(x2.invert, x2));
    // focus.select(".area").attr("d", area);
    // focus.select(".axis--x").call(xAxis);
    // svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
    //     .scale(width / (s[1] - s[0]))
    //     .translate(-s[0], 0));
  }
  var brush = d3.brushX()
  .extent([[0, 0], [200, 200]])
  .on("brush end", brushed);
  var svg = d3.select(el).selectAll('.d3')
  svg.append('g')
    .attr('class', 'brush-container') 
    .call(brush)
    .call(brush.move, [10, 100]);
}

ns._predraw = function(data) {
  var currenty = 20
  var innergap = 20
  var outtergap = 20
  var widthbase = 3
  var currentx = 20
  var node
  for (var i=0; i < data.node.length; ++i) {
    node = data.node[i]
    node.x = currentx  
    node.y = currenty
    node.r = 5 + Math.log10(node.number) * widthbase
    currenty = node.y + innergap
  }
}

ns._drawList = function(el, props, data, updt) {
  var svg = d3.select(el).selectAll('.d3')

  // var color = d3.scaleOrdinal(d3ScaleChromatic.schemeBlues[9])
  var color = d3.scaleSequential(d3ScaleChromatic.interpolateGnBu);
  function textTransform(node){
    return ("rotate(-45 " + (node.x + 20) + " " + (node.y) +")")
  }
  var text = svg.append('g')
    .attr('class', 'text-container')
    .selectAll('.text-container')
    .data(data.node)
    .enter().append('text')
    .attr('x', function(d){return d.x +20})
    .attr('y', function(d){return d.y})
    .attr("transform", function(d,i) { return textTransform(d); })
    .attr("font-size", "12px")
    .text(function(d){return d.term})
    .style('fill', function(d){return "black"})
}

ns._drawLinks = function(el, props, data, updt) {
  var svg = d3.select(el).selectAll('.d3')
  
  // scale to generate radians (just for lower-half of circle)
  var radians = d3.scaleLinear()
  .range([Math.PI / 2, 3 * Math.PI / 2])

  var currentx = 20
  // add links
  var link = svg.append('g')
    .attr('class', 'link')
    .selectAll('.link')
    .data(data.link)
    .enter().append('path')
    .attr('class', function(d){return 'alink ' + d.source.term.replace(' ','_')})
    .attr('d', function(d){
      var radius = Math.abs(d.target.y - d.source.y) / 2
      var arc = d3.arc()
        .innerRadius(radius)
        .outerRadius(radius)
        .startAngle(0)
        .endAngle(Math.PI);
      return arc();
    })
    .attr('stroke',function(d){
      // var radius = Math.abs(d.target.y - d.source.y)
      // if (d.target.y > props.height) 
      //   return "#fff"
      // else
      //   return "#ddd"
      return "#ddd"
    })
    .attr('stroke-width', 2)
    .attr('transform', function(d) {
      var radius = Math.abs(d.target.y - d.source.y) / 2
      var xshift = currentx
      var yshift = d.source.y + radius
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

  var color = d3.scaleOrdinal(d3ScaleChromatic.schemeSet2)
  var node = svg.append('g')
    .attr('class', 'nodes')
    .selectAll('circle')
    .data(data.node)
    .enter().append('circle')
    .attr('cx', function(d){return d.x})
    .attr('cy', function(d){return d.y})
    .attr('r', function(d){return d.r})
    .attr('id', function(d){return d.chapter_int})
    .attr('class', function(d){return 'blockterm '+ d.term.replace(' ', '_')})
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
      this.resethighlight()
      this.highlight(d.term)
      d3.event.stopPropagation();
    })
    .style("fill", function(d){
      return color(d.section_int)
    })
}

ns.highlight = function (term) {
  var allterm = d3.selectAll('.blockterm').style('fill', '#ddd')
  var related = d3.selectAll('.blockterm').filter('.'+term.replace(' ', '_')).style('fill', 'orange')
  var relatedlink = d3.selectAll('.alink').filter('.'+ term.replace(' ', '_')).style('stroke', 'orange')
}

ns.resethighlight = function () {
  var color = d3.scaleOrdinal(d3ScaleChromatic.schemeSet2)
  var allterm = d3.selectAll('.blockterm').style('fill', function(d){
    return color(d.section_int)
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
    .style('fill', 'yellow')
  }
}

ns.destroy = function(el) {

}

module.exports = ns