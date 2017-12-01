import React from 'react'
import ReactDOM from 'react-dom'
import d3Chart from './d3Chart'

export default class Arc extends React.Component {
  constructor(props) {
    super(props)
    this.changeState = this.changeState.bind(this)
  }
  componentDidMount () {
    var el = ReactDOM.findDOMNode(this)
    d3Chart.create(el, {width: this.props.width, height: this.props.height}, this.props.data, this.changeState)
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.searchTitle.searchTerm!=this.props.searchTitle.searchTerm) {
      var el = ReactDOM.findDOMNode(this)
      d3Chart.matchhighlight(el, nextProps.searchTitle.searchTerm)
    }
 }
  changeState(term) {
    this.props.onChange(term)
  }
  render() {
    return (
      <div className="Arc">

      </div>
    )
  }
}