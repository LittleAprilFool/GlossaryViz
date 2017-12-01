import React from 'react'
import ReactDOM from 'react-dom'
import tbjson from './json/chapter4.json'
import Mark from 'mark.js'

export default class Textbook extends React.Component {
  constructor(props) {
    super(props)
    tbjson.sort((a,b)=>a.id>b.id?1:-1)
    this.ins = null
  }
  componentDidMount() {
    var instance = new Mark(ReactDOM.findDOMNode(this))
    this.ins = instance
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.title.termTitle!=this.props.title.termTitle){
      this.ins.unmark()
      var result = this.ins.mark(nextProps.title.termTitle)
      console.log(result)
      console.log("remark")
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
              <h3>{a.chapter_id} {a.chapter_title}</h3>
              <div>{a.content}</div>
            </div>
          )}
        </div>
      </div>
    )
  }
}