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
    if(nextProps.title.searchTerm!=this.props.title.searchTerm) {
      var el = ReactDOM.findDOMNode(this)
      d3Chart.matchhighlight(el, nextProps.title.searchTerm)
    }
    if(nextProps.title.termTitle != this.props.title.termTitle)
    {
      if (nextProps.title.termTitle == "Glossary Viz")
        d3Chart.resethighlight()
      else
        d3Chart.highlight(nextProps.title.termTitle)
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