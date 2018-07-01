import 'babel-polyfill'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createStore } from 'redux'

import * as actionTypes from '../constants/actionTypes'

class App extends Component {
  componentWillMount() {
      store.dispatch({ type: actionTypes.FETCH_WEB3_CONNECTION_REQUESTED })
  }

  render() {
    return (
      <div className="App">
        <h1>App</h1>
      </div>
    )
  }
}

function mapDispatchToProps (dispatch, ownProps) {
    return {}
}

export default connect(
    state => state,
    mapDispatchToProps
)(App)
