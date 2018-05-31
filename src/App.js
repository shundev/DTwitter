import 'babel-polyfill'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createStore } from 'redux'
import PropTypes from 'prop-types'
import getWeb3 from './getWeb3'

import { store } from './store'
import ChatInput from './ChatInput'
import ChatHistory from './ChatHistory'
import ChangeFriend from './ChangeFriend'
import * as actionTypes from './constants/actionTypes'

class App extends Component {
  componentWillMount() {
      store.dispatch({ type: actionTypes.FETCH_WEB3_CONNECTION_REQUESTED })
  }

  componentDidUpdate() {
      this.scrollDown()
  }

  render() {
    const { userAddress, friendAddress, history, fetchHistory, changeFriend, sendMessage } = this.props
    return (
      <div className="App">
        <ChangeFriend friendAddress={ friendAddress } changeFriend={ changeFriend } />
        <ChatHistory history={ history } fetchHistory={ fetchHistory }/>
        <ChatInput userAddress={ userAddress } friendAddress={ friendAddress } sendMessage={ sendMessage } />
      </div>
    );
  }

  scrollDown() {
      window.scrollTo(0, document.body.scrollHeight);
  }

}

function mapDispatchToProps (dispatch, ownProps) {
    return {
        fetchHistory: () => dispatch({ type: actionTypes.FETCH_HISTORY_REQUESTED }),
        sendMessage: (msg) => dispatch({ type: actionTypes.SEND_MESSAGE_REQUESTED, payload: msg }),
        changeFriend: (address) => {
            dispatch({ type: actionTypes.SET_FRIEND_ADDRESS, payload: address })
            dispatch({ type: actionTypes.FETCH_HISTORY_REQUESTED })
        },
    }
}

export default connect(
    state => state,
    mapDispatchToProps
)(App);
