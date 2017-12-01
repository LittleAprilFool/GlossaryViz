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
      searchTerm: ""
    }
    this.changeTerm = this.changeTerm.bind(this)
    this.changeSearch = this.changeSearch.bind(this)
  }
  changeTerm(term) {
    this.setState({
      termTitle: term
    })
  }
  changeSearch(term) {
    this.setState({
      searchTerm: term
    })
  }
  render () {
    return (
      <div className="App">
        <SearchBox onChange={this.changeSearch} />
        <Textbook title = {this.state}/>
        <Terminology title = {this.state} />
        <Arc data = {this.props.data} width = '810' height = '550' onChange={this.changeTerm} searchTitle={this.state}/>
      </div>
    )
  }
}