import React from 'react'
import PropTypes from 'prop-types'

import './ChatHistory.styl'

export default class ChatHistory extends React.Component {
  componentDidMount() {
      console.log("History.componentDidMount")
     // this.props.getHistory()
  }

  render() {
    return (
      <ul className="collection">
      {
        this.props.history.map((msgObj) => {
          const imgURL = "//robohash.org/" + msgObj.Who + "?set=set2&bgset=bg2&size=70x70";
          const messageDate = new Date(msgObj.When * 1000);
          const messageDateTime = messageDate.toLocaleDateString() + ' at ' + messageDate.toLocaleTimeString();
          return (
            <li className="collection-item avatar" key={ msgObj.Id }>
              <img src={ imgURL } alt="{ msgObj.Who }" className="circle" />
              <span className="title">From { msgObj.Who }</span>
              <p>
                <i className="prefix tiny material-icons">alarm</i>
                <span className="message-date">{ messageDateTime }</span>
                <br />
                <span>{ msgObj.What }</span>
              </p>
            </li>
          )
        })
      }
      </ul>
    )
  }
}

ChatHistory.propTypes = {
  history: PropTypes.arrayOf(PropTypes.object),
  getHistory: PropTypes.func,
}
