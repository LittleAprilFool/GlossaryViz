import React from 'react'
import Arc from './Arc'


export default class App extends React.Component {
  constructor(props) {
    super(props)
  }
  render () {
    return (
      <div className="App">
        <h1> Glossary Viz </h1>
        <Arc data = {this.props.data} width = '1000' height = '500'/>
      </div>
    )
  }
}