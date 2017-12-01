import React from 'react'
import ReactDOM from 'react-dom'

export default class Searchbox extends React.Component {
  constructor(props) {
    super(props)
    this.inputChange = this.inputChange.bind(this)
  }
  inputChange(e) {
    this.props.onChange(e.target.value)
  }

  render() {
    return (
      <div id="SearchBox">
        <p>></p><input type="text" placeholder="Search" onInput={this.inputChange}/>
      </div>
    )
  }
}