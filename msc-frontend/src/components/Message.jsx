import React, { Component, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import iconMenubarGrey from "./images/menubarGrey.png";
import profilePicture from "./images/woman.jpg";
import backspaceIcon from "./images/backspaceIcon.png";
import axios from "axios";

function Message(props) {
  const [formMessages, setFormMessages] = useState([]);
  const [tempMessage, setTempMessage] = useState("");
  const [user, setUser] = useState({});
  const { feedbackId } = useParams(); // ?
  const [breadcrumbs, setBreadcrumbs] = useState(props.breadcrumbs);

  const BASE_URL = "http://10.61.38.193:8080";

  useEffect(() => {

    setBreadcrumbs(
      breadcrumbs.push(
        {
          page: "formId",
        },
        {
          page: "Feedback",
          path: `${BASE_URL}/feedback/formId/:formId`,
        }
      )
    )

    let body = document.getElementById("body");
    let menuBtn = document.getElementById("menu-icon");
    menuBtn.addEventListener("click", () => {
      body.classList.toggle("openMenu");
    });

    axios.get(`${BASE_URL}/api/v1/feedback/by-feedback/${feedbackId}`).then((res) => {
      const formMessages = res.data;
      // console.log(formMessages);
      setFormMessages(formMessages);
    });

    axios.get(`${BASE_URL}/api/v1/feedback/by-feedback/get-user/${feedbackId}`).then((res) => {
      const user = res.data;
      setUser(user);
    });

  }, []);

  const handleMessageInput = (e) => {
    setTempMessage(e.target.value);
  };

  const handleClickSend = () => {
    let newArray = formMessages;
    let newMessage = {
      feedbackId: formMessages.feedbackId,
      userID: "2", // user id pemilik form
      message: tempMessage,
    };
    newArray.push(newMessage);

    try {
      axios({
        method: "post",
        url: `${BASE_URL}/api/v1/feedback/by-feedback-message/insert`,
        data: newMessage,
        headers: { "Content-Type": "application/json" }
      }).then((res) => {
        // find feedback by feedbackid
        setFormMessages(newArray);
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
              {user.fullname}
            </div>
          </div>
          <div className="message-line"></div>
          <div id="message-content-wrapper">
            {formMessages.map((m) => {
              return (
                <React.Fragment>
                  <div className="message-content">
                    <div
                      className="message-content-2"
                      id={m.userID != 2 ? "message-user-1" : "message-user-2"}
                    >
                      <div className="message-single-bubble">
                        <div id="message-single-content">{m.feedbackMessage}</div>
                      </div>
                      <div id="message-single-timestamp">{m.createDateTime}</div>
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
