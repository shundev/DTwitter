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
import { fetchHistoryRequestAction, sendMessageRequestAction, setFriendAction } from './actions'

class App extends Component {
  componentWillMount() {
      store.dispatch(setFriendAction("0x7777777777777777"))
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
}

function mapDispatchToProps (dispatch, ownProps) {
    return {
        fetchHistory: () => dispatch(fetchHistoryRequestAction()),
        sendMessage: (msg) => dispatch(sendMessageRequestAction(msg)),
        changeFriend: (address) => dispatch(setFriendAction(address)),
    }
}

export default connect(
    state => state,
    mapDispatchToProps
)(App);
