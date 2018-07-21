import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createStore } from 'redux'

import { store } from '../store'
import * as actionTypes from '../constants/actionTypes'

import MessageInput from './MessageInput'
import Timeline from './Timeline'

class App extends Component {
  componentWillMount() {
      store.dispatch({ type: actionTypes.FETCH_WEB3_CONNECTION_REQUESTED })
  }

  render() {
    return (
      <div className="App">
        <MessageInput userAddress={ this.props.userAddress } sendMessage={ this.props.sendMessage }/>
        <Timeline messages={ this.props.messages }/>
      </div>
    )
  }
}

function mapDispatchToProps (dispatch, ownProps) {
    return {
        sendMessage: (msg) => dispatch({ type: actionTypes.SEND_MESSAGE_REQUESTED, payload: msg })
    }
}

export default connect(
    state => state,
    mapDispatchToProps
)(App)
