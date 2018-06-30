import 'babel-polyfill'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createStore } from 'redux'

import { store } from '../store'
import ChatInput from './ChatInput'
import ChatHistory from './ChatHistory'
import * as actionTypes from '../constants/actionTypes'

class App extends Component {
  componentWillMount() {
      store.dispatch({ type: actionTypes.FETCH_WEB3_CONNECTION_REQUESTED })
  }

  render() {
    const { userAddress, history, fetchHistory, sendMessage } = this.props
    return (
      <div className="App">
        <ChatHistory history={ history } fetchHistory={ fetchHistory }/>
        <ChatInput userAddress={ userAddress } sendMessage={ sendMessage } />
      </div>
    )
  }
}

function mapDispatchToProps (dispatch, ownProps) {
    return {
        fetchHistory: () => dispatch({ type: actionTypes.FETCH_HISTORY_REQUESTED }),
        sendMessage: (msg) => dispatch({ type: actionTypes.SEND_MESSAGE_REQUESTED, payload: msg }),
    }
}

export default connect(
    state => state,
    mapDispatchToProps
)(App)
