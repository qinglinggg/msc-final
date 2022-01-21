import React, { Component } from "react";
import { Link } from "react-router-dom";
import iconMenubarGrey from "./images/menubarGrey.png";
import profilePicture from "./images/woman.jpg";
import backspaceIcon from "./images/backspaceIcon.png";

class Message extends React.Component {
  constructor(props) {
    super(props);
    this.handleMessageInput = this.handleMessageInput.bind(this);
    this.handleClickSend = this.handleClickSend.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
  }

  state = {
    tempMessage: "",
  };

  componentDidMount() {
    let body = document.getElementById("body");
    let menuBtn = document.getElementById("menu-icon");
    menuBtn.addEventListener("click", () => {
      body.classList.toggle("openMenu");
    });
  }

  handleMessageInput(e) {
    this.setState({ tempMessage: e.target.value }, () => {
      console.log(this.state.tempMessage);
    });
  }

  handleClickSend() {
    //  harusnya sendNewMessage() di app.js
    let newArray = this.props.messages.messagesHistory;
    let newMessage = {
      userID: 2, // user id pemilik akun
      message: this.state.tempMessage,
      timestamp: "3.48 PM",
    };
    newArray.push(newMessage);
    this.props.Parent.setState({ messageHistory: newArray });

    // yg ini tetap
    this.setState({ tempMessage: "" });
    this.updateTextarea();
  }

  handleEnter(e) {
    if (e.key === "Enter") this.handleClickSend();
  }

  updateTextarea() {
    let textarea = document.getElementById("message-input");
    if (textarea) {
      textarea.value = "";
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="title-container">
          <div className="menu-icon" id="menu-icon">
            <img id="menu-icon-img" src={iconMenubarGrey} alt="" />
          </div>
          <div className="page-title" id="page-title-home">
            Chat
          </div>
        </div>
        <div id="page-content">
          <div id="message-container">
            <div id="message-header">
              <Link to="/item1/feedback">
                <img id="backspace-icon-img" src={backspaceIcon} alt="" />
              </Link>
              <div id="message-profile">
                {/* <div id="message-user-name"></div> */}
                {/* <div id="message-status"></div> */}
                <img
                  className="profile-image"
                  id="message-profile-image"
                  src={profilePicture}
                  alt=""
                />
                {this.props.messages.userName}
              </div>
            </div>
            <div className="message-line"></div>
            <div id="message-content-wrapper">
              {this.props.messages.messagesHistory.map((m) => {
                return (
                  <React.Fragment>
                    <div className="message-content">
                      <div
                        className="message-content-2"
                        id={m.userID == 1 ? "message-user-1" : "message-user-2"}
                      >
                        <div className="message-single-bubble">
                          <div id="message-single-content">{m.message}</div>
                        </div>
                        <div id="message-single-timestamp">{m.timestamp}</div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
            <div className="message-line"></div>
            <div id="message-input-box">
              <input
                id="message-input"
                placeholder="Send a message..."
                onChange={(e) => {
                  this.handleMessageInput(e);
                }}
                onKeyUp={(e) => {
                  this.handleEnter(e);
                }}
              ></input>
              <div id="message-send" onClick={this.handleClickSend}>
                <ion-icon name="send-outline" id="send-icon"></ion-icon>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Message;
