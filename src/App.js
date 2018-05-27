import React, { Component } from 'react'
import PropTypes from 'prop-types'
import getWeb3 from './getWeb3'

import ChatInput from './ChatInput'
import ChatHistory from './ChatHistory'
import ChangeFriend from './ChangeFriend'


// import './App.styl'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userAddress: "0x0",
      friendAddress: "0x0",
      history: [],
      web3: null,
      contractInstance: null,
    }

    this.sendMessage = this.sendMessage.bind(this)
    this.initContract = this.initContract.bind(this)
    this.getHistory = this.getHistory.bind(this)
    this.changeFriend = this.changeFriend.bind(this)
  }

  componentWillMount() {
    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      this.initAccount(this.initContract);
    })
  }

  componentDidMount() {
    console.log("App#componentDidMount")
  }

  initContract() {
    const contractAddress = "0x7e04d5549470a4f3f7e0d3fc5f66d778ce615856"
    const contractABI = [ { "anonymous": false, "inputs": [ { "indexed": true, "name": "id", "type": "uint256" }, { "indexed": true, "name": "sender", "type": "address" }, { "indexed": true, "name": "recipient", "type": "address" }, { "indexed": false, "name": "text", "type": "string" }, { "indexed": false, "name": "created_at", "type": "uint256" } ], "name": "MessageSent", "type": "event" }, { "constant": false, "inputs": [ { "name": "recipient", "type": "address" }, { "name": "text", "type": "string" } ], "name": "sendMessage", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "constant": true, "inputs": [ { "name": "id", "type": "uint256" } ], "name": "getMessage", "outputs": [ { "name": "", "type": "uint256" }, { "name": "", "type": "address" }, { "name": "", "type": "address" }, { "name": "", "type": "string" }, { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "theother", "type": "address" } ], "name": "getMessages", "outputs": [ { "name": "", "type": "uint256[20]" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "messages", "outputs": [ { "name": "sender", "type": "address" }, { "name": "recipient", "type": "address" }, { "name": "text", "type": "string" }, { "name": "created_at", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" } ]

    const instance = this.state.web3.eth.contract(contractABI).at(contractAddress)

    instance.MessageSent({recipient: this.state.userAddress})
    .watch((err, result) => {
      console.log("Received a message.")
      this.getHistory()
    })

    instance.MessageSent({sender: this.state.userAddress})
    .watch((err, result) => {
      console.log("Your message mined.")
      this.getHistory()
    })

    this.setState({
      contractInstance: instance,
    }, this.getHistory)
  }

  initAccount(callback) {
    this.state.web3.eth.getAccounts((err, accounts) => {
      this.setState({
        userAddress: accounts[0],
      }, callback)
    })
  }

  sendMessage(message) {
    // Temporary message (not mined)
    const msgObj = {
      Id: Math.floor(Math.random() * 100000000), // overwritten once mined
      Who: this.state.userAddress,
      What: message,
      When: (new Date().valueOf()) / 1000
    }
    this.setState({
      history: this.state.history.concat(msgObj)
    }, () => {
      window.scrollTo(0, document.body.scrollHeight)
    })

    this.state.contractInstance.sendMessage.sendTransaction(
      this.state.friendAddress,
      message,
      {from: this.state.userAddress},
      (err, result) => {}
    );
  }

  getHistory() {
    this.state.contractInstance.getMessages(this.state.friendAddress, {from: this.state.userAddress}, (err, messageIds) => {
        var messageCount = 0;
        for (var i=0; i < messageIds.length; i++) {
          if (messageIds[i] == 0) break;
          messageCount++;
        }

        if (messageCount === 0) {
            this.setState({
              history: []
            })
        }

        var history = []
        for (var i=0; i < messageCount; i++) {
          this.state.contractInstance.getMessage(messageIds[i], {from: this.state.userAddress}, (err, message) => {
            history = history.concat({
                Id: message[0],
                Who: message[1],
                What: message[3],
                When: message[4],
            })

            if (history.length == messageCount) {
              this.setState({
                history: history.sort((m1, m2) => {
                  if (m1.When > m2.When) {
                    return 1;
                  } else if (m1.When < m2.When) {
                    return -1;
                  } else {
                    return 0;
                  }
                })
              }, () => {
                window.scrollTo(0, document.body.scrollHeight)
              })
            }
          })
        }
      })
  }

  changeFriend(address) {
    console.log("Change: " + address)
    this.setState({
      friendAddress: address
    }, this.getHistory)
  }

  render() {
    return (
      <div className="App">
        <ChangeFriend friendAddress={ this.state.friendAddress } changeFriend={ this.changeFriend } />
        <ChatHistory history={ this.state.history } getHistory={ this.getHistory }/>
        <ChatInput userAddress={ this.state.userAddress } friendAddress={ this.state.friendAddress } sendMessage={ this.sendMessage } />
      </div>
    );
  }
}

export default App
