import React from 'react'
import ReactDOM from 'react-dom'
import tbjson from './json/chapter-hint3.json'
import glsjson from './json/glossary.json'

export default class Textbook extends React.Component {
  constructor(props) {
    super(props)
    tbjson.sort((a,b)=>a.id>b.id?1:-1)
    this.mouseon = false
    this.handleOnMouseOver = this.handleOnMouseOver.bind(this)
    this.handleOnMouseOut = this.handleOnMouseOut.bind(this)
    this.menu = this.getMenu()
  }
  getMenu() {
    const chapterMap = {}
    const menuMap = []
    tbjson.forEach(item =>{
      if (!chapterMap[item.chapter_id]) {
        chapterMap[item.chapter_id] = true
        const menuItem = {"chapter_id": item.chapter_id, "chapter_title": item.chapter_title}
        menuMap.push(menuItem)
      }
    })
    return menuMap
  }
  componentDidMount() {
    var allTerm = document.querySelectorAll('.mark')
    Array.from(allTerm).forEach(e => {
      e.onmouseover = this.handleOnMouseOver
      e.onmouseout = this.handleOnMouseOut
      e.onclick = this.handleClick
    })
    var menu = document.querySelector('.menu-container')
    if (menu!= null)
      menu.style.display= "none"
  }
  jumpChapter(id){
    var menu = document.querySelector('.menu-container')
    if (menu!= null)
      menu.style.display= "none"
    var chapter = document.querySelector('.'+id.replace(' ', '_'))
    if (chapter!= null)
      chapter.scrollIntoView()
  }
  showMenu(){
    console.log("???")
    var menu = document.querySelector('.menu-container')
    if (menu!= null)
      menu.style.display = "flex"
  }
  handleClick(e) {
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
        var selectTerm = document.querySelectorAll(".mark-"+nextProps.title.termTitle.replace(' ','_'))
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
        <div className="menu" >
          <div className="menu-icon" onClick={()=>this.showMenu()}>
            <i className="fa fa-bars"></i>
          </div>
          <div className="menu-container">
            <div>
            {this.menu.map(a=>
              <div key={a.chapter_id} onClick={()=> this.jumpChapter(a.chapter_id)}>
                <div className="menu-item">{a.chapter_id} {a.chapter_title}</div>
              </div>
            )}
            </div>
          </div>
        </div>
        <a href="http://math.hws.edu/graphicsbook/index.html" target="_blank">  
        <h1>Introduction to Computer Graphics</h1> </a>
        <p> Version 1.1, January 2016 </p>
        <p> Author:  David J. Eck </p>
        <div>
          {tbjson.map(a=>
            <div key={a.id}>
              {a.section_title=="null" ? <h3 className={a.chapter_id.replace(' ', '_')}>{a.chapter_id} {a.chapter_title}</h3>: <h4>{a.section_id} {a.section_title}</h4>}
              <div dangerouslySetInnerHTML={{__html:a.content}}></div>
            </div>
          )}
        </div>
      </div>
    )
  }
}