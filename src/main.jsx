import React from 'react'
import {render} from 'react-dom'
// import {createStore} from 'redux'
// import {Provider} from 'react-redux'
// import reducer from './reducers'
import App from './App'
import './scss/main.scss'
import node from './json/node-middle.json'
import link from './json/link-middle.json'

// const store = createStore(reducers)

var data = {}
data.node = node
data.link = link


render(
  // <Provider store={store}>
    <App data = {data}/>, document.getElementById('app')
  //</Provider>, document.getElementById('app')
)