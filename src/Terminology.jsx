import React from 'react'
import ReactDOM from 'react-dom'
import dictionary from './json/glossary.json'


export default class Termonology extends React.Component {
  constructor(props) {
    super(props)
    this.termExplanation = "IAT814 Visualization Final Project - Developed by April Wang"
    this.updateExplanation = this.updateExplanation.bind(this)
    var dic = {}
    dictionary.forEach(function(x) {
      dic[x.term] = x.definition
    })
    this.dic = dic
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.title.termTitle!=this.props.title.termTitle) 
      this.updateExplanation(nextProps.title.termTitle)
  }

  updateExplanation(title) {
    this.termExplanation = this.dic[title]
    if (this.termExplanation == null)
     this.termExplanation = "IAT814 Visualization Final Project. Developed by April Wang"
  }

  render() {
    return (
      <div id="termBox">
        <div id="termTitle"> {this.props.title.termTitle} </div>
        <div id="termExplanation"> {this.termExplanation}</div>
      </div>
    )
  }
}