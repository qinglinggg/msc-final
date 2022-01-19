import React, { Component } from "react";
import iconMenubarGrey from "./images/menubarGrey.png";
import profilePicture from "./images/woman.jpg";
import backspaceIcon from "./images/backspaceIcon.png";

class Message extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let body = document.getElementById("body");
    let menuBtn = document.getElementById("menu-icon");
    menuBtn.addEventListener("click", () => {
      body.classList.toggle("openMenu");
    });
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
              <img id="backspace-icon-img" src={backspaceIcon} alt="" />
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
              <input id="message-input" placeholder="Send a message..."></input>
              {/* send icon */}
              <img src="" alt="" />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Message;
