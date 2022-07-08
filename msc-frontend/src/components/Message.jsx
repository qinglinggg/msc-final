import React, { Component, createRef, useEffect, useState } from "react";
import { Link, useParams, useRef } from "react-router-dom";
import iconMenubarGrey from "./images/menubarGrey.png";
// import profilePicture from "./images/woman.jpg";
import ProfilePicture from "./functional-components/ProfilePicture"
import backspaceIcon from "./images/backspaceIcon.png";
import axios from "axios";
import DateTimeService from "./functional-components/services/DateTimeService";

const BASE_URL = "http://10.61.42.160:8080";

function Message(props) {
  const [messageMetadata, setMessageMetadata] = useState({});
  const [formMessages, setFormMessages] = useState([]);
  const [tempMessage, setTempMessage] = useState("");
  const [surveyMakerId, setSurveyMakerId] = useState("");
  const { formId } = useParams();
  const { feedbackId } = useParams();
  const { chatRef } = createRef();
  const [currDateTime, setCurrDateTime] = useState(new Date(0));
  const [intervalId, setIntervalId] = useState(0);

  useEffect(() => {
    props.isAuthor(formId);
    let tempBreadcrumbs = localStorage.getItem("breadcrumbs");
    tempBreadcrumbs = JSON.parse(tempBreadcrumbs);
    if(tempBreadcrumbs.length >= 2) {
      while(tempBreadcrumbs.slice(-1)[0] && !(tempBreadcrumbs.slice(-1)[0].page == "Home" || tempBreadcrumbs.slice(-1)[0].page == "/")){
        tempBreadcrumbs.pop();
      }
    }
    tempBreadcrumbs.push({page: "Chat", path: window.location.href});
    let body = document.getElementById("body");
    let menuBtn = document.getElementById("menu-icon");
    menuBtn.addEventListener("click", () => {
      body.classList.toggle("openMenu");
    });
    let metadata = JSON.parse(localStorage.getItem("selectedChat"));
    setMessageMetadata(metadata);
    let intervalId = setInterval(() => {
      axios.get(`${BASE_URL}/api/v1/feedback/by-feedback/${feedbackId}`).then((res) => {
        preparingMessages(res.data);
      });
      axios({
        method: "put",
        url: `${BASE_URL}/api/v1/feedback/by-feedback/read/${feedbackId}`,
        data: currentUser,
        headers: { "Content-Type": "text/plain" }
      }).catch(error => console.log(error));
    }, 1000);
    setIntervalId(intervalId);
    let currentUser = JSON.parse(localStorage.getItem("loggedInUser"));
    setSurveyMakerId(currentUser);
    return () => {
      localStorage.removeItem("selectedChat");
      clearInterval(intervalId);
    }
  }, []);

  const preparingMessages = (messages) => {
    let tempDateTime = currDateTime;
    let index = -1;
    let listOfInsert = [];
    messages.map((message) => {
      index++;
      if(message['date'] && message['time']) return;
      if(!message['createDateTime']) return;
      const current = DateTimeService("convertToDateTime", message.createDateTime);
      let compareObj = {
        value1: tempDateTime,
        value2: current.datetime
      };
      let flag = DateTimeService("compareTwoDates", compareObj);
      if(flag == true){
        tempDateTime = current.datetime;
        let insert = {
          date: current.date,
          index: index + listOfInsert.length,
        }
        listOfInsert.push(insert);
      }
      message["date"] = current.date;
      message["time"] = current.time;
    });
    console.log(listOfInsert);
    listOfInsert.map((insert) => {
      messages.splice(insert.index, 0, insert.date);
    })
    console.log(messages);
    setCurrDateTime(tempDateTime);
    setFormMessages(messages);
  }

  const handleMessageInput = (e) => {
    setTempMessage(e.target.value);
  };

  const handleClickSend = () => {
    let newMessage = {
      feedbackId: messageMetadata.feedbackId,
      userId: surveyMakerId, // user id pemilik form
      feedbackMessage: tempMessage,
    };
    try {
      axios({
        method: "post",
        url: `${BASE_URL}/api/v1/feedback/by-feedback-message/insert`,
        data: newMessage,
        headers: { "Content-Type": "application/json" }
      }).then((res) => {
        let messages = [...formMessages];
        messages.push(res.data);
        preparingMessages(messages);
        setTempMessage("");
        updateTextarea();
      })
    } catch (error){
      console.log(error);
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") handleClickSend();
  };

  const updateTextarea = () => {
    let textarea = document.getElementById("message-input");
    if (textarea) {
      textarea.value = "";
    }
  };

  const handleBackToFeedbackList = () => {
    localStorage.removeItem("selectedChat");
    window.location = `/feedback/formId/${formId}`;
  };

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
            <div style={{"cursor": "pointer"}} onClick={() => handleBackToFeedbackList()}>
              <img id="backspace-icon-img" src={backspaceIcon} alt="" />
            </div>
            <div id="message-profile">
              <ProfilePicture user={JSON.parse(localStorage.getItem("selectedChat")).user}></ProfilePicture>
              <span>{messageMetadata.fullname}</span>
            </div>
          </div>
          <div className="message-line"></div>
          <div id="message-content-wrapper">
            {formMessages.map((m) => {
              return (
                <React.Fragment>
                  {m.createDateTime ? 
                  <div className="message-content">
                    <div
                      className="message-content-2"
                      id={m.userId != surveyMakerId ? "message-user-1" : "message-user-2"}
                    >
                      <div className="message-single-bubble">
                        <div id="message-single-content">{m.feedbackMessage}</div>
                      </div>
                      <div id="message-single-timestamp">{m.time}</div>
                    </div>
                  </div> : 
                  <div className="respondent-chat-wrapper">
                  <div className="respondent-chat-date">
                    {"— " + m.toString() + " —"}
                  </div>
                </div>}
                </React.Fragment>
              );
            })}
            <div id="end-of-chat" ref={chatRef}></div>
          </div>
          <div className="message-line"></div>
          <div id="message-input-box">
            <input
              id="message-input"
              placeholder="Send a message..."
              onChange={(e) => {
                handleMessageInput(e);
              }}
              onKeyUp={(e) => {
                handleEnter(e);
              }}
            ></input>
            <div id="message-send" onClick={handleClickSend}>
              <ion-icon name="send-outline" id="send-icon"></ion-icon>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Message;
