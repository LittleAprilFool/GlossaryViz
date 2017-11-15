import React from 'react'
import ReactDOM from 'react-dom'
import d3Chart from './d3Chart'

export default class Arc extends React.Component {
  constructor(props) {
    super(props)
  }
  componentDidMount () {
    var el = ReactDOM.findDOMNode(this)
    d3Chart.create(el, {width: this.props.width, height: this.props.height}, this.props.data)
  }
  render() {
    return (
      <div className="Arc">233</div>
    )
  }
}