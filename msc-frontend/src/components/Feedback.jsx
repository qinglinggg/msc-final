import React, { Component, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import iconMenubarGrey from "./images/menubarGrey.png";
import profilePicture from "./images/woman.jpg";
import Chat from "./Message";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";

function Feedback(props) {
  const [index, setIndex] = useState(0);
  const [feedbackList, setFeedbackList] = useState([]);
  const [messageList, setMessageList] = useState([]);
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
      setIndex(feedbackList.length);
      props.handleSetFormMessages(feedbackList);
      // console.log(feedbackList);
    });
  }, []);

  useEffect(() => {
    if(feedbackList && messageList.length == 0){
      let index = 0;
      feedbackList.map((feedback) => {
        let obj = {};
        let tempMessageList = [...messageList];
        axios.get(`${BASE_URL}/api/v1/user-profiles/${feedback.userId}`)
            .then((res) => {
              obj.fullname = res.data.fullname;
              axios.get(`${BASE_URL}/api/v1/feedback/by-feedback/get-last-message/${feedback.feedbackId}`)
                .then((res) => {
                  obj.feedbackId = res.data.feedbackId;
                  obj.lastMessage = res.data.feedbackMessage;
                  obj.createDateTime = res.data.createDateTime;
                  obj.isRead = res.data.isRead;
                  obj.tag = 1;
                  tempMessageList.push(obj);
                  setMessageList(tempMessageList);
                  index = index + 1;
              });
        });

      });
    }
  })

  let count = 0;
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
          {messageList.map((message) => {
            
            count = count + 1;
            let path = "chat-" + count;
            
            // getFeedbackMessageByFeedbackId -> lastIndex
            

            return (
              <React.Fragment>
                <div id="chat-single-box">
                  <img className="profile-image" src={profilePicture} alt="" />
                  <Link to={`/feedback/formId/${message.feedbackId}/${path}`} className="link" id="link-container">
                    <div id="chat-message-box">
                      <div id="chat-user-name">{message.fullname}</div>
                      <div id="chat-user-message">{message.lastMessage}</div>
                    </div>
                    <div id="chat-info-box">
                      <div id="chat-timestamp">{message.createDateTime}</div>
                      <div
                        className="chat-tag-box"
                        id={
                          message.isRead
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
