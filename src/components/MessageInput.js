import React from 'react'

import "./MessageInput.styl"

class MessageInput extends React.Component {
    onSubmit(e) {
        // デフォルトの送信ボタンの挙動（ブラウザリロード）を禁止
        e.preventDefault()

        // Inputに入力されているテキストを取得
        const msg = this.refs.txtMessage.value
        this.props.sendMessage(msg)

        // 送信後は空にする
        this.refs.txtMessage.value = ""

        // 再び入力欄にフォーカスを戻す
        this.refs.txtMessage.focus()
    }

    render () {
        return (
                    <div id="messageinput" className="blue">
                      <form className="container" onSubmit={ this.onSubmit.bind(this) }>
                        <div className="row">
                          <div className="input-field col s10">
                            <i className="prefix material-icons">chat</i>
                            <input ref="txtMessage" type="text" placeholder="Type your message" />
                            <span className="chip left white">
                              <span>You: { this.props.userAddress }</span>
                            </span>
                          </div>
                          <div className="input-field col s2">
                            <button type="submit" className="waves-effect waves-light btn-floating btn-large blue">
                              <i className="material-icons">send</i>
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
        )
    }
}

export default MessageInput
