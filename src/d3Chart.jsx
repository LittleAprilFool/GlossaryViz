import EventEmitter from 'events'
import * as d3 from 'd3'
import { join } from 'path'
import * as d3ScaleChromatic from 'd3-scale-chromatic'


var ns = {}

ns.create = function(el, props, data, updt) {
  this.selected = 0
  this.totallength = 0
  var svg = d3.select(el).append('svg')
      .attr('class', 'd3')
      .attr('width', props.width)
      .attr('height', props.height)
      .on('click', ()=>{
        this.selected = 0
        this.resethighlight()
        updt("Glossary Viz")
      }).append('g')
      .attr('class', 'zoom')
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
  this._drawBrush(el, props, data, updt)
}
ns._drawBrush = function(el, props, data, updt) {
  var svg = d3.select(el).selectAll('.d3')
  var zoomele = svg.select(".zoom")
  var x2 = d3.scaleTime().range([0, brushlength])
  var color = d3.scaleOrdinal(d3ScaleChromatic.schemeDark2)
  //var color = d3.scaleOrdinal(d3ScaleChromatic.schemeYlGnBu[9])
  var brushlength = props.width
  var brushright = 0.435 * props.width
  var areaScale = brushlength / this.totallength
  var area = svg.append('g')
    .attr('class', 'area')
    .selectAll('rect')
    .data(data.node)
    .enter().append('rect')
    .attr('x', function(d){return d.x * areaScale})
    .attr('y', function(d){return d.y + 43})
    .attr('width', function(d){return d.width * areaScale})
    .attr('height', function(d){return d.height * 2})
    .style("fill", function(d){
      return color(d.section_int)
    })
  function zoomed() {
    var t = d3.event.transform
    if(d3.event.sourceEvent.type=="brush")
      zoomele.attr("transform", `translate(${t.x} 0) scale(${t.k} 1)`)
  }
  var zoom = d3.zoom()
  .scaleExtent([1, Infinity])
  .translateExtent([[0, 0], [brushlength, 550]])
  .extent([[0, 0], [brushlength, 550]])
  .on("zoom", zoomed)

  zoomele.call(zoom)

  function brushed() {
    var s = d3.event.selection || x2.range();
    var scalevalue = brushlength / brushright
    zoomele.call(zoom.transform, d3.zoomIdentity
      .scale(brushright / (s[1] - s[0]))
      .translate(-s[0] * scalevalue, 0))
  }
  var brush = d3.brushX()
  .extent([[0, 550], [brushlength, 620]])
  .on("brush end", brushed);
  
  svg.append('g')
    .attr('class', 'brush-container') 
    .call(brush)
    .call(brush.move, [0,brushright]);
}

ns._predraw = function(data) {
  var currentx = 0
  var innergap = 1
  var outtergap = 20
  var widthbase = 1
  var currenty = 520
  var defaultheight = 15
  var node
  for (var i=0; i < data.node.length; ++i) {
    node = data.node[i]
    node.x = currentx  
    node.y = currenty
    node.width = 5 + node.number * widthbase
    node.height = defaultheight
    currentx = node.x + node.width + innergap
  }
  this.totallength = currentx - innergap
}

ns._drawList = function(el, props, data, updt) {
  var canvas = d3.select(el).selectAll('.zoom')
  var threshold = 8
  function textTransform(node){
    return ("rotate(-45 " + (node.x + 10) + " " + (node.y) +")")
  }
  var text = canvas.append('g')
    .attr('class', 'text-container')
    .selectAll('.text-container')
    .data(data.node)
    .enter().append('text')
    .attr('x', function(d){return d.x + 10})
    .attr('y', function(d){return d.y})
    .attr("transform", function(d,i) { return textTransform(d); })
    .attr("font-size", "14px")
    .text(function(d){return d.term})
    .attr("visibility", function(d){
      if (d.number > threshold)
        return "show"
      else
        return "hidden"
    })
    .style('fill', function(d){return "black"})
}

ns._drawLinks = function(el, props, data, updt) {
  var canvas = d3.select(el).selectAll('.zoom')
  
  // scale to generate radians (just for lower-half of circle)
  var radians = d3.scaleLinear()
  .range([Math.PI / 2, 3 * Math.PI / 2])

  var currenty = 520
  // add links
  var link = canvas.append('g')
    .attr('class', 'link')
    .selectAll('.link')
    .data(data.link)
    .enter().append('path')
    .attr('class', function(d){return 'alink ' + d.source.term.replace(' ','_')})
    .attr('d', function(d){
      var radius = Math.abs(d.target.x - d.source.x - d.source.width / 2 + d.target.width / 2) / 2
      var arc = d3.arc()
        .innerRadius(radius)
        .outerRadius(radius)
        .startAngle(-Math.PI / 2)
        .endAngle(Math.PI / 2);
      return arc(); 
    })
    .attr('stroke',function(d) {
      if (d.target.x > props.width)
        return "#ddd"
      else
        return "#ddd"
    })
    .attr('opacity', 0.5)
    .attr('stroke-width', function(d){
      var mincount = Math.min(d.target.number, d.source.number)
      var param = 1
      return mincount * param
    })
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
  var canvas = d3.select(el).selectAll('.zoom')

  var color = d3.scaleOrdinal(d3ScaleChromatic.schemeDark2)
  //var color = d3.scaleOrdinal(d3ScaleChromatic.schemeYlGnBu[9])
  var node = canvas.append('g')
    .attr('class', 'nodes')
    .selectAll('rect')
    .data(data.node)
    .enter().append('rect')
    .attr('x', function(d){return d.x})
    .attr('y', function(d){return d.y})
    .attr('width', function(d){return d.width})
    .attr('height', function(d){return d.height})
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
  // var allterm = d3.selectAll('.blockterm').style('fill', '#ddd')
  var related = d3.selectAll('.blockterm').filter('.'+term.replace(' ', '_')).style('fill', 'orange')
  var relatedlink = d3.selectAll('.alink').filter('.'+ term.replace(' ', '_')).style('stroke', 'orange')
}

ns.resethighlight = function () {
  var color = d3.scaleOrdinal(d3ScaleChromatic.schemeDark2)
  // var color = d3.scaleOrdinal(d3ScaleChromatic.schemeYlGnBu[9])
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
    var tt = d3.selectAll('.blockterm')
    .filter(function(d) { 
      const reg = new RegExp('^' + term)
      return (reg.test(d.term))
    })
    .style('fill', 'yellow')
    
    var ll = d3.selectAll('.alink')
    .filter(function(d) { 
      const reg = new RegExp('^' + term)
      return (reg.test(d.source.term))
    })
    .style('stroke', 'yellow')
  }
}

ns.destroy = function(el) {

}

module.exports = ns