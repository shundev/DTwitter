import React from 'react'

import './ChatInput.styl'

export default class ChatInput extends React.Component {
  onSubmit(e) {
    e.preventDefault()

    const message = this.refs.txtMessage.value
    if (message.length === 0) {
      return
    }

    this.props.sendMessage(message)
    this.refs.txtMessage.value = ""
    this.refs.txtMessage.focus()
  }

  componentDidMount() {
    this.refs.txtMessage.value = ""
  }

  render() {
      const userImgURL = "//robohash.org/" + this.props.userAddress + "?set=set2&bgset=bg2&size=70x70"

      return (
        <footer className="teal">
          <form className="container" onSubmit={ this.onSubmit.bind(this) }>
            <div className="row">
              <div className="input-field col s10">
                <i className="prefix material-icons">chat</i>
                <input ref="txtMessage" type="text" placeholder="Type your message" />
                <span className="chip left">
                  <img src={ userImgURL } />
                  <span>You: { this.props.userAddress }</span>
                </span>
              </div>
              <div className="input-field col s2">
                <button type="submit" className="waves-effect waves-light btn-floating btn-large">
                  <i className="material-icons">send</i>
                </button>
              </div>
            </div>
          </form>
        </footer>
      )
  }
}
