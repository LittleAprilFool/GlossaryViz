import React from 'react'
import ReactDOM from 'react-dom'
import glsjson from './json/glossary.json'

export default class Searchbox extends React.Component {
  constructor(props) {
    super(props)
    this.inputChange = this.inputChange.bind(this)
  }
  componentDidMount(){
    var glossary = []
    glsjson.forEach(e =>{
      glossary.push(e.term)
    })
    var input = document.getElementById("myinput");
    var awe = new Awesomplete(input, {
      list: glossary,
      minChars: 1,
    })
    input.removeEventListener("awesomeplete-selectcomplete", this.inputChange)
    input.addEventListener("awesomplete-selectcomplete", this.inputChange)
  }
  inputChange() {
    var input = document.getElementById("myinput")
    this.props.onChange(input.value)
    console.log(input.value)
  }

  render() {
    return (
      <div id="SearchBox">
        <p>></p><input type="text" id="myinput" placeholder="Search" onInput={this.inputChange}/>
      </div>
    )
  }
}