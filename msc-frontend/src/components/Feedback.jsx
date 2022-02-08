import React, { Component, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import iconMenubarGrey from "./images/menubarGrey.png";
import profilePicture from "./images/woman.jpg";
import Chat from "./Message";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function Feedback(props) {
  const [index] = useState(props.formMessages_data.length);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let body = document.getElementById("body");
    let menuBtn = document.getElementById("menu-icon");
    menuBtn.addEventListener("click", () => {
      body.classList.toggle("openMenu");
    });
  }, []);

  return (
    <React.Fragment>
      <div className="title-container">
        <div className="menu-icon" id="menu-icon">
          <img id="menu-icon-img" src={iconMenubarGrey} alt="" />
        </div>
        <div className="page-title" id="page-title-home">
          Feedback
        </div>
      </div>
      <div id="page-content" className="chat-content">
        <div id="chat-container">
          {props.formMessages_data.map((message) => {
            setCount(count + 1);
            let path = "chat-" + count;
            return (
              <React.Fragment>
                <div id="chat-single-box">
                  <img className="profile-image" src={profilePicture} alt="" />
                  <Link to={path} className="link" id="link-container">
                    <div id="chat-message-box">
                      <div id="chat-user-name">{message.userName}</div>
                      <div id="chat-user-message">{message.lastMessage}</div>
                    </div>
                    <div id="chat-info-box">
                      <div id="chat-timestamp">{message.timestamp}</div>
                      <div
                        className="chat-tag-box"
                        id={
                          message.read
                            ? "orange-chat-tag-box"
                            : "green-chat-tag-box"
                        }
                      >
                        <div id="chat-tag">{message.tag}</div>
                      </div>
                    </div>
                  </Link>
                </div>
                {count == index ? null : <div id="chat-line"></div>}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </React.Fragment>
  );
}

export default Feedback;
