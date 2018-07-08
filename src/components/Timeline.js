import React, { Component } from 'react'

import "./Timeline.styl"

class Timeline extends Component {
    render () {
        return (
            <div id="timeline">
              <ul className="collection">
              {
                  this.props.messages.map((msgObj) => {
                      const msgDate = new Date(msgObj.When * 1000)
                      const msgDateTime = msgDate.toLocaleDateString() + ' at ' + msgDate.toLocaleTimeString()
                      return (
                          <li className="collection-item" key={msgObj.Id}>
                            <span className="title">From: {msgObj.Who}</span>
                            <p>
                              <i className="prefix tiny material-icons">alarm</i>
                              <span className="message-date">{msgDateTime}</span>
                              <br />
                              <span>{msgObj.What}</span>
                            </p>
                          </li>
                      )
                  })
              }
              </ul>
            </div>
        )
    }
}

export default Timeline
