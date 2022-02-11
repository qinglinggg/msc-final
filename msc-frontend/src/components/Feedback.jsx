import React, { Component, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import iconMenubarGrey from "./images/menubarGrey.png";
import profilePicture from "./images/woman.jpg";
import Chat from "./Message";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";

function Feedback(props) {
  const [index] = useState(props.formMessages_data.length);
  const [count, setCount] = useState(0);
  const [feedbackList, setFeedbackList] = useState([]);
  const {formId} = useParams();
  
  const BASE_URL = "http://localhost:8080";

  useEffect(() => {
    let body = document.getElementById("body");
    let menuBtn = document.getElementById("menu-icon");
    menuBtn.addEventListener("click", () => {
      body.classList.toggle("openMenu");
    });

    // get all feedback by formId
    axios.get(`${BASE_URL}/api/v1/feedback/by-form/${formId}`).then((res) => {
      const feedbackList = res.data;
      setFeedbackList(feedbackList);
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
          {feedbackList.map((message) => {
            setCount(count + 1);
            let path = "chat-" + count;
            
            // getFeedbackMessageByFeedbackId -> lastIndex
            let lastMessage = axios.get(`${BASE_URL}/api/v1/feedback/by-feedback/get-last-message/${message.feedbackId}`);
            
            // get user fullname
            let user = axios.get(`${BASE_URL}/api/v1/user-profiles/${message.userId}`);
            
            return (
              <React.Fragment>
                <div id="chat-single-box">
                  <img className="profile-image" src={profilePicture} alt="" />
                  <Link to={path} className="link" id="link-container">
                    <div id="chat-message-box">
                      <div id="chat-user-name">{user.fullname}</div>
                      <div id="chat-user-message">{lastMessage.lastMessage}</div>
                    </div>
                    <div id="chat-info-box">
                      <div id="chat-timestamp">{lastMessage.createDateTime}</div>
                      <div
                        className="chat-tag-box"
                        id={
                          message.read
                            ? "orange-chat-tag-box"
                            : "green-chat-tag-box"
                        }
                      >
                        <div id="chat-tag">{lastMessage.tag}</div>
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
