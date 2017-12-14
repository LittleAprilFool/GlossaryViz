import React from 'react'
import Arc from './Arc'
import Terminology from './Terminology'
import SearchBox from './Searchbox'
import Textbook from './Textbook'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      termTitle: "Glossary Viz",
      searchTerm: "",
      locked: false,
      resizeCount: 0
    }
    this.changeTerm = this.changeTerm.bind(this)
    this.changeSearch = this.changeSearch.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.changeCount = this.changeCount.bind(this)
  }
  changeTerm(term) {
    this.setState({
      termTitle: term
    })
  }
  changeLocked() {
    this.setState({
      locked: !this.state.locked
    })
  }
  changeSearch(term) {
    this.setState({
      searchTerm: term
    })
  }
  changeCount(){
    this.setState({
      resizeCount: this.state.resizeCount +1
    })
  }
  componentDidMount() {
    document.onclick = this.handleClick
    window.onresize = this.changeCount
  }
  componentWillUnmount() {
    window.onresize = null
  }
  handleClick() {
    // this.setState({
    //   locked: false
    // })
  }
  render () {
    return (
      <div className="App">
        <SearchBox onChange={this.changeSearch} />
        <Textbook title = {this.state} onChange={this.changeTerm}/>
        <Terminology title = {this.state} />
        <Arc data = {this.props.data} onChange={this.changeTerm} title={this.state} key={this.state.resizeCount}/>
      </div>
    )
  }
}