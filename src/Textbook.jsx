import React from 'react'
import ReactDOM from 'react-dom'
import tbjson from './json/chapter22.json'
import glsjson from './json/glossary.json'
import Mark from 'mark.js'

export default class Textbook extends React.Component {
  constructor(props) {
    super(props)
    tbjson.sort((a,b)=>a.id>b.id?1:-1)
    this.ins = null
    this.mouseon = false
    this.markAll = this.markAll.bind(this)
    this.handleOnMouseOver = this.handleOnMouseOver.bind(this)
    this.handleOnMouseOut = this.handleOnMouseOut.bind(this)
  }
  componentDidMount() {
    var instance = new Mark(ReactDOM.findDOMNode(this))
    this.ins = instance
    this.markAll()
    var allTerm = document.querySelectorAll('*[data-markjs]')
    Array.from(allTerm).forEach(e => {
      e.onmouseover = this.handleOnMouseOver
      e.onmouseout = this.handleOnMouseOut
      e.onclick = this.handleClick
    })
  }
  markAll() {
    this.ins.unmark()
    glsjson.forEach( e =>{
      var result = this.ins.mark(e.term, {"separateWordSearch":false, "accuracy": "exactly", "className":"mark-"+e.term})
    })
  }
  handleClick(e) {
    console.log("inner click!!")
    e.stopPropagation()
  }
  handleOnMouseOver(e){ 
    this.mouseon = true
    const keyword = e.target.innerText 
    this.props.onChange(keyword)
  } 
  handleOnMouseOut(e){
    this.mouseon = false
    this.props.onChange("Glossary Viz")
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.title.termTitle!=this.props.title.termTitle){
      if(nextProps.title.termTitle == "Glossary Viz"){
        var selectTerm = document.querySelectorAll(".highlight_term")
        Array.from(selectTerm).forEach(e => {
          e.classList.remove("highlight_term")
        })
      }
      else{
        var selectTerm = document.querySelectorAll(".mark-"+nextProps.title.termTitle)
        Array.from(selectTerm).forEach( e => {
          e.classList.add("highlight_term")
        })
        if((selectTerm[0] != null) & (this.mouseon == false))
          selectTerm[0].scrollIntoView()
      }
    }
  }
  render() {
    return (
      <div className="Textbook">
        <h1>Introduction to Computer Graphics</h1>
        <p> Version 1.1, January 2016 </p>
        <p> Author:  David J. Eck </p>
        <div>
          {tbjson.map(a=>
            <div key={a.id}>
              {a.section_title=="null" ? <h3>{a.chapter_id} {a.chapter_title}</h3>: <h4>{a.section_id} {a.section_title}</h4>}
              <div>{a.content}</div>
            </div>
          )}
        </div>
      </div>
    )
  }
}