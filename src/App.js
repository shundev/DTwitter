import 'babel-polyfill'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createStore } from 'redux'
import PropTypes from 'prop-types'
import getWeb3 from './getWeb3'

import ChatInput from './ChatInput'
import ChatHistory from './ChatHistory'
import ChangeFriend from './ChangeFriend'
import { fetchHistoryRequestAction, sendMessageRequestAction, setFriendAction } from './actions'

class App extends Component {
  componentWillMount() {
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
        fetchHistory: dispatch(fetchHistoryRequestAction()),
        sendMessage: dispatch(sendMessageRequestAction()),
        changeFriend: dispatch(setFriendAction()),
    }
}

export default connect(
    state => state,
    mapDispatchToProps
)(App);
