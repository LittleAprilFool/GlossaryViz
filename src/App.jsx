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
      locked: false
    }
    this.changeTerm = this.changeTerm.bind(this)
    this.changeSearch = this.changeSearch.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.width = window.innerWidth * 0.6
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
  componentDidMount() {
    document.onclick = this.handleClick
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
        <Arc data = {this.props.data} width ={this.width} height = '600' onChange={this.changeTerm} title={this.state}/>
      </div>
    )
  }
}