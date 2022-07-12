import React, { Component, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import iconMenubarGrey from "./images/menubarGrey.png";
// import profilePicture from "./images/woman.jpg";
import ProfilePicture from "./functional-components/ProfilePicture"
import Chat from "./Message";
import axios from "axios";
import DateTimeService from "./functional-components/services/DateTimeService";

function Feedback(props) {
  const [index, setIndex] = useState(0);
  const [feedbackList, setFeedbackList] = useState([]);
  const [renderFlag, setRenderFlag] = useState(0);
  const {formId} = useParams();
  const [currentStep, setCurrentStep] = useState([]);
  const [intervalId, setIntervalId] = useState(0);
  const BASE_URL = "http://10.61.54.168:8080";

  useEffect(() => {
    let body = document.getElementById("body");
    let menuBtn = document.getElementById("menu-icon");
    menuBtn.addEventListener("click", () => {
      body.classList.toggle("openMenu");
    });
    // get all feedback by formId
    // console.log("user: " + loggedInUser);
    // test
    let tempBreadcrumbs = localStorage.getItem("breadcrumbs");
    tempBreadcrumbs = JSON.parse(tempBreadcrumbs);
    if(tempBreadcrumbs.length >= 2) {
      while(tempBreadcrumbs.slice(-1)[0] && !(tempBreadcrumbs.slice(-1)[0].page == "Home" || tempBreadcrumbs.slice(-1)[0].page == "/")){
        tempBreadcrumbs.pop();
      }
    }
    let selectedForm = localStorage.getItem("selectedForm");
    selectedForm = JSON.parse(selectedForm);
    tempBreadcrumbs.push({page: "Feedback - " + selectedForm['title'], path: window.location.href});
    setCurrentStep(tempBreadcrumbs);
    localStorage.setItem("breadcrumbs", JSON.stringify(tempBreadcrumbs));
  }, []);

  useEffect(() => {
    props.isAuthor(formId);
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    let feedbacks = [];
    if(feedbackList.length == 0){
      let interval = setInterval(() => {
        axios.get(`${BASE_URL}/api/v1/feedback/by-form/${formId}`).then((res) => {
          feedbacks = res.data;
          console.log("---", feedbacks);
          setIndex(feedbacks.length);
          if(feedbacks.length == 0) setRenderFlag(1);
        }).finally(() => { 
          let i = 0;
          feedbacks.map(async (feedback) => {
            i++;
            await axios.get(`${BASE_URL}/api/v1/feedback/by-feedback/get-last-message/${feedback.feedbackId}`)
            .then((res) => {
              feedback["lastMessage"] = res.data.feedbackMessage;
              feedback["isRead"] = res.data.isRead;
              let convertedDateTime = DateTimeService("convertToDateTime", res.data.createDateTime);
              feedback["date"] = convertedDateTime.date;
              feedback["time"] = convertedDateTime.time;
            }).finally(async () => {
              if(feedback["fullname"]) return;
              await axios.get(`${BASE_URL}/api/v1/user-profiles/${feedback.userId}`)
              .then((res) => {
                feedback["fullname"] = res.data.fullname;
                feedback["user"] = res.data;
              }).finally(async () => {
                await axios.get(`${BASE_URL}/api/v1/feedback/by-feedback-message/new-message-count/${feedback.feedbackId}/${loggedInUser}`)
                .then((res) => {
                  feedback["tag"] = res.data;
                }).finally(() => {
                  if(i == feedbacks.length){
                    setFeedbackList(feedbacks);
                    setRenderFlag(1);
                  }
                })
              });
            })
          });
        });
      }, 1000);
      setIntervalId(interval);
    }

    return () => {
      clearInterval(intervalId);
    }
  }, [feedbackList]);

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
      <div className="page-breadcrumbs">
        {
          currentStep.map((b, idx) => {
            if(idx > 0) {
              return (
                <a href={b['path']} key={"bread-" + idx}>
                  <span>{">"}</span>
                  <span>{b['page']}</span>
                </a>
              );
            }
            return (
              <a href={b['path']} key={"bread-" + idx}>{b['page']}</a>
            );
          })
        }
      </div>
      <div id="page-content" className="chat-content">
        <div id="chat-container">
          {renderFlag == 1 ? 
           (feedbackList.length == 0 ? (
            <div style={{textAlign: "center", fontSize: "16px", color: "gray", fontStyle: "italic"}}>There is no messages yet.</div>
           ) : (
            feedbackList.map((message) => {
              count++;
              return (
                <React.Fragment>
                  <div id="chat-single-box">
                    {/* <img className="profile-image" src={profilePicture} alt="" /> */}
                    
                    <Link to={`/feedback/formId/${message.formId}/${message.feedbackId}`} 
                      className="link" id="link-container"
                      onClick={() => localStorage.setItem("selectedChat", JSON.stringify(message))}
                    >
                      <div className="chat-display">
                        <ProfilePicture user={message["user"]}></ProfilePicture>
                        <div id="chat-message-box">
                          <div id="chat-user-name">{message.fullname}</div>
                          <div id="chat-user-message">{message["lastMessage"]}</div>
                        </div>
                      </div>
                      <div id="chat-info-box">
                        <div id="chat-timestamp">{message["date"] + " " + message["time"]}</div>
                        {message["tag"] ?
                          <div
                            className="chat-tag-box"
                            id={
                              message.isRead
                                ? "orange-chat-tag-box"
                                : "green-chat-tag-box"
                            }
                          >
                            <div id="chat-tag">{message["tag"]}</div>
                          </div>
                          : false}
                        </div>
                    </Link>
                  </div>
                  {count == index ? null : <div id="chat-line"></div>}
                </React.Fragment>
              );
            }))
          ) : null } 
        </div>
      </div>
    </React.Fragment>
  );
}

export default Feedback;
