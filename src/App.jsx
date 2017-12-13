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
        <Arc data = {this.props.data} width = '810' height = '2050' onChange={this.changeTerm} title={this.state}/>
      </div>
    )
  }
}