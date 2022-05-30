import React, { Component, createRef, useEffect, useState } from "react";
import { Link, useParams, useRef } from "react-router-dom";
import iconMenubarGrey from "./images/menubarGrey.png";
import profilePicture from "./images/woman.jpg";
import backspaceIcon from "./images/backspaceIcon.png";
import axios from "axios";

const BASE_URL = "http://10.61.38.193:8080";

function Message() {
  const [messageMetadata, setMessageMetadata] = useState({});
  const [formMessages, setFormMessages] = useState([]);
  const [tempMessage, setTempMessage] = useState("");
  const [surveyMakerId, setSurveyMakerId] = useState("");
  const { formId } = useParams();
  const { feedbackId } = useParams();
  const { chatRef } = createRef();

  useEffect(() => {
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
    axios.get(`${BASE_URL}/api/v1/feedback/by-feedback/${feedbackId}`).then((res) => {
      let messages = res.data;
      let tempDate = new Date(0);
      let index = -1;
      let listOfInsert = [];
      messages.map((message) => {
        index++;
        let flag = 0;
        const datetime = new Date(message.createDateTime);
        if(tempDate.getFullYear() < datetime.getFullYear()) flag = 1;
        else if(tempDate.getFullYear() == datetime.getFullYear()){
          if(tempDate.getMonth() < datetime.getMonth()) flag = 1;
          else if(tempDate.getMonth() == datetime.getMonth()){
            if(tempDate.getDate() < datetime.getDate()) flag = 1;
          }
        }
        let date = datetime.getDate() + "/" + (datetime.getMonth() + 1) + "/" + datetime.getFullYear();
        let time = datetime.getHours() + ':';
        if(datetime.getMinutes() == 0) time = time + datetime.getMinutes() + '0';
        else if(datetime.getMinutes() < 10) time = time + '0' + datetime.getMinutes();
        else time = time + datetime.getMinutes();
        if(flag == 1){
          tempDate = datetime;
          console.log("now tempdate value is " + tempDate);
          let insert = {
            date: date,
            index: index,
          }
          listOfInsert.push(insert);
        }
        message["date"] = date;
        message["time"] = time;
      });
      console.log(listOfInsert);
      listOfInsert.map((insert) => {
        messages.splice(insert.index, 0, insert.date);
      })
      console.log(messages);
      setFormMessages(messages);
    });
    let currentUser = JSON.parse(localStorage.getItem("loggedInUser"));
    setSurveyMakerId(currentUser);
    // axios.get(`${BASE_URL}/api/v1/feedback/by-feedback/get-user/${feedbackId}`).then((res) => {
    //   const user = res.data;
    //   setUser(user);
    // });
    // let end = document.getElementById("end-of-chat");
    // if(end) chatRef.current.scrollIntoView(false);
  }, []);

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
        setFormMessages(messages);
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
    window.location = `/feedback/formId/${formId}`;
    localStorage.removeItem("selectedChat");
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
              {/* <div id="message-user-name"></div> */}
              {/* <div id="message-status"></div> */}
              <img
                className="profile-image"
                id="message-profile-image"
                src={profilePicture}
                alt=""
              />
              {messageMetadata.fullname}
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
