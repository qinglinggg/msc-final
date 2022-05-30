import axios from 'axios';
import React, { Component, useEffect, useState, useRef, createRef } from 'react';
import { Link, useParams } from "react-router-dom";
import AutoHeightTextarea from './functional-components/AutoheightTextarea';

import dummyProfile from "./images/woman.jpg";

const BASE_URL = "http://10.61.38.193:8080";

function Respondent (props) {
  let { formId } = useParams();

  const [index, setIndex] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [formMetadata, setFormMetadata] = useState([]);
  const [formItems, setFormItems] = useState([]);
  const [answerSelection, setAnswerSelection] = useState([]);
  const [formRespondentId, setFormRespondentId] = useState();
  const [formResponse, setFormResponse] = useState([]);
  const [navToggle, setNavToggle] = useState(true);
  const [nextNav, setNextNav] = useState(-1);
  const [navigator, setNavigator] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);

  const [openChat, setOpenChat] = useState(false);
  const [tempMessage, setTempMessage] = useState("");
  const [feedbackId, setFeedbackId] = useState();
  const [feedbackMessages, setFeedbackMessages] = useState([]);
  const prevFeedbackMessage = useRef(0);
  const chatRef = createRef();
  const [currDate, setCurrDate] = useState(new Date(0));

  // DESIGN
  const [primaryColor, setPrimaryColor] = useState("Default");
  const [secondaryColor, setSecondaryColor] = useState("Default");
  const [bgLink, setBgLink] = useState("./images/woman.jpg");

  const [intervalId, setIntervalId] = useState(0);

  useEffect(() => {
    if(props.previewMode) setPreviewMode(props.previewMode);
    try { 
        axios({
            method: "get",
            url: `${BASE_URL}/api/v1/forms/${formId}`
        }).then((res) => {
            setFormMetadata(res.data);
            localStorage.setItem("selectedForm", JSON.stringify(res.data));
        })
    } catch (error) {
      console.log(error);
    }
    try {
        axios({
            method: "get",
            url: `${BASE_URL}/api/v1/forms/get-form-items/${formId}`
        }).then((res) => {
            setFormItems(res.data);
            if(!navigator || navigator.length == 0) {
              let tempNav = [...navigator];
              res.data.map((data) => tempNav.push(-1));
              tempNav.push(-1);
              setNavigator(tempNav, () => localStorage.setItem("navigator", tempNav));
            }
        })
    } catch (error) {
      console.log(error);
    }
    // DESIGN
    responsePageTheme();
    // CHAT
    let userId = JSON.parse(localStorage.getItem("loggedInUser"));
    if(userId) {
      let userId_data = {"userId": userId}
      axios({
        method: "post",
        url: `${BASE_URL}/api/v1/forms/form-respondent/${formId}`,
        data: userId_data, // cek lagi nanti. 
      }).then((res) => {
        if(res.data && res.data.length > 0){
          setFormRespondentId(res.data[0]);
        }
        else {
          let newFormRespondent = {
            formId: formId,
            userId: userId,
            isTargeted: 0,
          }
          axios({
            method: "post",
            url: `${BASE_URL}/api/v1/forms/insert-form-respondent/${formId}`,
            data: newFormRespondent
          }).then((res) => {
            setFormRespondentId(res.data[0]);
          });
        }
      });
    }
    let prevElement = document.querySelector('.display-container');
    if(props.previewMode) prevElement.style.marginTop = 0 + 'px';
    let displayContainer = document.querySelector('.inner-display-container');
    displayContainer.addEventListener('webkitAnimationEnd', () => {
      displayContainer.style.animation = '';
    });
    return () => {
      let check = undefined;
      axios({
        method: "get",
        url: `${BASE_URL}/api/v1/feedback/by-feedback/${feedbackId}`,
      }).then((res) => {
        check = res.data;
      }).finally(() => {
        if(check == undefined) axios.delete(`${BASE_URL}/api/v1/feedback/${feedbackId}`)
        .then((res) => console.log("feedbackId is destroyed"))
        .catch((error) => console.log(error));
      })
    };
  }, []);

  useEffect(() => {
    if(!formItems) return;
    let loadData = localStorage.getItem("tempFormResponse");
    if (loadData && loadData.length == formItems.length) loadData = JSON.parse(loadData);
    else {
      loadData = [];
      formItems.map((fi) => {
        if (fi.type == "CB") loadData.push([]);
        else loadData.push({});
      });
    }
    setFormResponse(loadData, () => {
      let loadNav = localStorage.getItem("navigator");
      if(loadNav) loadNav = JSON.parse(loadNav);
      else return;
      let count = 1;
      formResponse.map((resp, idx) => {
        if(resp && loadNav[idx] != -1) count++;
      });
      let navCount = 1;
      loadNav.map((val) => {if(val != -1) navCount++});
      console.log("Check count nav:", count, navCount);
      if (count == navCount) setNavigator(loadNav);
    });
  }, [formItems]);

  useEffect(() => {
    let userId = JSON.parse(localStorage.getItem("loggedInUser"));
    if(feedbackId == undefined){
      let newFeedback = {
        formId: formId,
        userId: userId,
      }
      console.log("newFeedback");
      console.log(newFeedback);
      try {
        axios({
          method: "post",
          url: `${BASE_URL}/api/v1/feedback/by-feedback/insert`,
          data: newFeedback,
        }).then((res) => {
          setFeedbackId(res.data);
        })
      } catch (error){
        console.log(error);
      }
    }
    if(feedbackId && openChat){
      console.log("feedbackId masuk: " + feedbackId);
      if(feedbackMessages.length == 0){
        let interval = setInterval(() => {
          console.log("interval is working...");
          axios({
            method: "put",
            url: `${BASE_URL}/api/v1/feedback/by-feedback/read/${feedbackId}`,
            data: userId,
            headers: { "Content-Type": "text/plain" },
          }).finally(() => {
            axios({
              method: "get",
              url: `${BASE_URL}/api/v1/feedback/by-feedback/${feedbackId}`,
            }).then((res) => {
              if(res.data){
                preparingMessages(res.data);
              }
            }).catch(error => {
              console.log(error);
            })
          })
        }, 1000);
        setIntervalId(interval);
      }
    }
    if(!openChat){
      clearInterval(intervalId);
    }
  }, [feedbackId, openChat]);

  const preparingMessages = (data) => {
    let tempDate = currDate;
    let index = -1;
    let listOfInsert = [];
    data.map((f) => {
      index++;
      if(f['date'] && f['time']) return;
      if(!f['createDateTime']) return;
      const messageDate = new Date(f.createDateTime);
      let flag = 0;
      if(tempDate.getFullYear() < messageDate.getFullYear()) flag = 1;
      else if(tempDate.getFullYear() == messageDate.getFullYear()){
        if(tempDate.getMonth() < messageDate.getMonth()) flag = 1;
        else if(tempDate.getMonth() == messageDate.getMonth()){
          if(tempDate.getDate() < messageDate.getDate()) flag = 1;
        }
      }
      let date = messageDate.getDate() + "/" + (messageDate.getMonth() + 1) + "/" + messageDate.getFullYear();
      let time = messageDate.getHours() + ':';
      if(messageDate.getMinutes() == 0) time = time + messageDate.getMinutes() + '0';
      else if(messageDate.getMinutes() < 10) time = time + '0' + messageDate.getMinutes();
      else time = time + messageDate.getMinutes();
      if(flag == 1){
        tempDate = messageDate;
        let insert = {
          date: date,
          index: index,
        }
        listOfInsert.push(insert);
      }
      f['date'] = date;
      f['time'] = time;
    });
    listOfInsert.map((insert) => {
      data.splice(insert.index, 0, insert.date);
    })
    setCurrDate(tempDate);
    prevFeedbackMessage.current = data;
    setFeedbackMessages(data);
  }

  useEffect(() => {
    chatRef.current.scrollIntoView(false);
  }, [feedbackMessages])

  useEffect(() => {
    let navbar = document.getElementById("navbar");
    let chatHeader = document.getElementById("respondent-chat-header");
    let chatIcon = document.getElementById("respondent-chat-button-float");
    let background = document.getElementById("page-container");

    navbar.style.backgroundColor = primaryColor;
    chatHeader.style.backgroundColor = primaryColor;
    chatIcon.style.backgroundColor = primaryColor;
    if(bgLink == "") background.style.backgroundColor = secondaryColor;
    else {
      background.style.backgroundImage = bgLink;
      background.style.backgroundSize = "cover";
    }

    return () => {
      navbar.style.backgroundColor = "";
      chatHeader.style.backgroundColor = "";
      chatIcon.style.backgroundColor = "";
      background.style.backgroundColor = "";
      background.style.backgroundImage = "";
      background.style.backgroundSize = "";
    }
  }, [bgLink, primaryColor]);

  const responsePageTheme = () => {
    let selectedForm = JSON.parse(localStorage.getItem("selectedForm"));
    let selectedColor = selectedForm.backgroundColor;
    if(selectedColor == "Black"){
      setPrimaryColor(selectedColor);
      setSecondaryColor("grey");
    } if(selectedColor == "Dark Grey"){
      setPrimaryColor("darkgrey");
      setSecondaryColor("whitesmoke");
    } if(selectedColor == "Red") {
      setPrimaryColor("rgb(202, 52, 52)");
      setSecondaryColor("rgb(212, 131, 131)");
    } if(selectedColor == "Green") {
      setPrimaryColor("rgb(99, 180, 99)");
      setSecondaryColor("rgb(206, 241, 206)");
    } if(selectedColor == "Blue") {
      setPrimaryColor("rgb(38, 95, 216)");
      setSecondaryColor("lightblue");
    } if(selectedColor == "Cyan"){
      setPrimaryColor("rgb(7, 197, 197)");
      setSecondaryColor("rgb(155, 233, 233)");
    } if(selectedColor == "Pink"){
      setPrimaryColor("rgb(248, 174, 186)");
      setSecondaryColor("rgb(245, 233, 239)");
    }
    // setBgLink(`url('${dummyProfile}')`);
    setBgLink(selectedForm.backgroundLink);
  }

  const getAnswerSelection = (current) => {
      let formItemId = current.id;
      try {
        axios({
          method: "get",
          url: `${BASE_URL}/api/v1/forms/get-answer-selection/${formItemId}`
        }).then((res) => {
          setAnswerSelection(res.data);
        })
      } catch(error) {
        console.log(error);
      }
  }

  const checkIsRequired = (formItem, formResponse) => {
    let checker = true;
    if(!(formItem.type == "CB" || formItem.type == "LS")) {
      if(!formResponse || formResponse.answerSelectionValue == "") checker = false;
    }
    else if(formItem.type == "CB"){
      formResponse.map(resp => {
        if((!resp || resp.answerSelectionValue == "") && checker == true) checker = false;
      });
    }
    else if(formItem.type == "LS"){
      if(!formResponse || !formResponse.answerSelectionValue) checker = false;
    }
    return checker;
  }

  useEffect(() => {
    let length = formItems.length;
    if(index <= length){
      let current = formItems[index-1];
      if(current.isRequired){
        let validator = checkIsRequired(formItems[index-1], formResponse[index-1]);
        if(!validator){
          setNavToggle(false);
        } else {
          setNavToggle(true);
        }
      }
    }
  }, [index, formResponse]);

  let prevAnswerSelection = {};

  useEffect(() => {
    setIsLoaded(false);
    let el = document.getElementById("loading-transition");
    if(!el) return;
    if(el.classList.contains("loading-transition-done")) el.classList.remove("loading-transition-done");
    if(!el.classList.contains("loading-transition-onload")) el.classList.add("loading-transition-onload");
    setNavToggle(false);
    setTimeout(() => setIsLoaded(true), 1000);
  }, [index]);

  useEffect(() => {
    if(!isLoaded) return;
    let el = document.getElementById("loading-transition");
    el.style.animation = "done-trans 1.5s forwards";
    el.addEventListener("webkitAnimationEnd", () => {
      el.classList.remove("loading-transition-onload");
      el.classList.add("loading-transition-done");
      setNavToggle(true);
    });
  }, [isLoaded])

  const handleNext = () => {
    if(!navToggle) return;
    if(nextNav == -1) {
      setIndex(index + 1);
      navigator[index] = -1;
      setNavigator(navigator, () => localStorage.setItem("navigator", JSON.stringify(navigator)));
    }
    else if(index != formItems.length + 1) {
      console.log(nextNav);
      let previousNav = index;
      setIndex(nextNav);
      navigator[nextNav-1] = previousNav;
      setNavigator(navigator, () => localStorage.setItem("navigator", JSON.stringify(navigator)));
    } else {
      setIndex(index + 1);
    }
    let displayContainer = document.querySelector('.inner-display-container');
    displayContainer.style.animation = 'show-transition 1s forwards';
  }
    
  const handleBack = () => {
    if(!navToggle) return;
    if(navigator[index-1] == -1) setIndex(index - 1);
    else setIndex(navigator[index-1]);
    let displayContainer = document.querySelector('.inner-display-container');
    displayContainer.style.animation = 'hide-transition 1s forwards';
  }
     
  const displayQuestion = () => {
    let length = formItems.length;
    return (
        <div className="inner-display-container">
          {
            length == 0 ? (
              <div id="preview-empty-list">
                There is no question to answer, please contact the author.
              </div>
            ) : displayQuestionCard(length)
          }
        </div>
      )
  }

  const displayQuestionCard = (length) => {
      let loadAnswerField;
      let current;
      if(index <= length){
        current = formItems[index-1];
        getAnswerSelection(formItems[index-1]);
      }
      return (
        <React.Fragment>
          <div className="preview-flex">
            {index <= length ? (
              <React.Fragment>
                <div id="loading-transition"/>
                {/* Selected option: {formResponse && formResponse[index-1] ? formResponse[index-1].answerSelectionValue : null} */}
                <div className="preview-field">
                  <div id="preview-index">
                    {index}.
                  </div>
                  {current.content == '' ? 
                    <div id="preview-warning">
                      There is no question, please contact the author.
                    </div> 
                    : current.content
                  }
                  {current.isRequired ? <span style={{color: 'red', marginLeft: '20px'}}>{'*'}</span> : null}
                </div>
                <div className="answer-field">
                  {current.type == "LS"
                    ? (loadAnswerField = loadLinearScale(index, current.id, answerSelection))
                    : current.type == "MC"
                    ? (loadAnswerField = loadMultipleChoice(index, current.id, answerSelection))
                    : current.type == "CB"
                    ? (loadAnswerField = loadCheckbox(index, current.id, answerSelection))
                    : current.type == "SA"
                    ? (loadAnswerField = loadShortAnswer(index, current.id, answerSelection))
                    : null}
                </div>
                {current.isRequired ? (
                <div>
                  <span style={{color: 'red', fontSize: 'small'}}>{'*'}</span>
                  <span style={{color: 'gray', marginLeft: '10px', fontSize: 'small'}}>Required to be filled.</span>
                </div>
                ) : null}
              </React.Fragment>
            ) : (
              <div className="respondent-endpage" >
                <div className="respondent-endpage-title" style={{ backgroundColor: primaryColor }}>Congratulations!</div>
                <div className="respondent-endpage-description">You are at the end of the form. Click the button below to submit your answer! :)</div>
                { displayOnSubmission() }
              </div>
            )}
          </div>
        </React.Fragment>
      );
    }

  const setMultipleChoiceValue = (index, formItemId, selectedAnswerSelection) => {
    let id;
    let value;
    let responses = [...formResponse];
    if(responses[index-1] && responses[index-1].answerSelectionId == selectedAnswerSelection.id){
      id = "";
      value = "";
    } else {
      id = selectedAnswerSelection.id;
      value = selectedAnswerSelection.value;
    }
    let formItemResponse = {
      formRespondentId: formRespondentId,
      formItemsId: formItemId,
      answerSelectionId: id,
      answerSelectionValue: value,
    }
    responses[index-1] = formItemResponse;
    if(formResponse && formResponse.length == formItems.length) localStorage.setItem("tempFormResponse", JSON.stringify(responses));
    setFormResponse(responses);
    setNextNav(selectedAnswerSelection.nextItem);
  }

  const loadMultipleChoice = (index, formItemId, arrayOptions) => {
    return (
      <React.Fragment>
        <div id="preview-multiple-choice">
          { 
            arrayOptions.map((options, innerIdx) => {
            return (
              <div className="preview-option-container" id="preview-option-mc-cb-container" key={"mc-" + innerIdx}>
                <div id="preview-input-mc-cb-container">
                  <input
                    className="answerSelection"
                    id={"options-"+formItemId+"-"+innerIdx}
                    type="radio"
                    name={"options-"+formItemId}
                    checked={formResponse[index-1] && options.id == formResponse[index-1].answerSelectionId}
                    onClick={() => setMultipleChoiceValue(index, formItemId, options)}
                  />
                  <label id={"option-label"+"-"+innerIdx} htmlFor={"options-"+formItemId+"-"+innerIdx}>
                    {options.value == "" ? options.label : options.value}
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </React.Fragment>
    );
  }

  
  const setLinearScaleValue = (index, formItemId, selectedAnswerSelection) => {
    let responses = [...formResponse];
    let formItemResponse = {
      formRespondentId: formRespondentId,
      formItemsId: formItemId,
      answerSelectionId: selectedAnswerSelection.id,
      answerSelectionValue: selectedAnswerSelection.label,
    }
    responses[index-1] = formItemResponse;
    if(formResponse && formResponse.length == formItems.length) localStorage.setItem("tempFormResponse", JSON.stringify(responses));
    setFormResponse(responses);
    setNextNav(selectedAnswerSelection.nextItem);
  }

  const loadLinearScale = (index, formItemId, arrayOptions) => {
    return (
      <React.Fragment>
        <div id="preview-linear-scale">
          {arrayOptions.map((options, innerIdx) => {
            return (
              <div className="preview-option-container" id="preview-option-ls-container">
                <div id="preview-input-ls-container">
                  <input
                    className="answerSelection"
                    id={"options-"+formItemId+"-"+innerIdx}
                    type="radio"
                    name={"options-"+formItemId}
                    checked={formResponse[index-1] && formResponse[index-1].answerSelectionId == options.id}
                    onClick={() => setLinearScaleValue(index, formItemId, options)}
                  />
                  <label className="option-ls-desc" id={"option-label"+"-"+innerIdx} htmlFor={"options-"+formItemId+"-"+innerIdx}>
                    {options.label ? options.label : options.no}
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </React.Fragment>
    );
  }

  const setCheckboxValue = (index, formItemId, selectedAnswerSelection) => {
    let id = selectedAnswerSelection.id;
    let value = selectedAnswerSelection.value;
    let responses = [...formResponse];
    let removeSelectedId = "";
    if(responses[index-1] && responses[index-1].length > 0){
      let selectedResponse = responses[index-1];
      selectedResponse.map((resp) => {
        if(resp.answerSelectionId == selectedAnswerSelection.id) {
          removeSelectedId = resp.answerSelectionId;
        }
      });
      if(removeSelectedId) {
        responses[index-1] = selectedResponse.filter((resp) => resp.answerSelectionId != removeSelectedId);
        if(formResponse && formResponse.length == formItems.length) localStorage.setItem("tempFormResponse", JSON.stringify(responses));
        setFormResponse(responses);
        return;
      }
    }
    if(removeSelectedId) return;
    if(!responses[index-1]) responses[index-1] = [];
    let formItemResponse = {
      formRespondentId: formRespondentId,
      formItemsId: formItemId,
      answerSelectionId: id,
      answerSelectionValue: value,
    }
    responses[index-1].push(formItemResponse);
    if(formResponse && formResponse.length == formItems.length) localStorage.setItem("tempFormResponse", JSON.stringify(responses));
    setFormResponse(responses);
    setNextNav(selectedAnswerSelection.nextItem);
  }

  const multipleChecked = (index, options) => {
    let selectedResponse = formResponse[index-1];
    let checker = false;
    if(selectedResponse.length > 0) selectedResponse.map((resp) => {
      if(resp.answerSelectionId == options.id) checker = true;
    });
    return checker;
  }
    
  const loadCheckbox = (index, formItemId, arrayOptions) => {
    return (
      <React.Fragment>
        {arrayOptions.map((options, innerIdx) => {
          return (
            <div className="preview-option-container" id="preview-option-mc-cb-container">
              <div id="preview-input-mc-cb-container">
                <input
                  className="answerSelection"
                  id={"options-"+formItemId+"-"+innerIdx}
                  type="checkbox"
                  name={"options-"+formItemId}
                  checked={formResponse[index-1] && multipleChecked(index, options)}
                  onClick={() => setCheckboxValue(index, formItemId, options)}
                />
                <label id={"option-label"+"-"+innerIdx} htmlFor={"options-"+formItemId+"-"+innerIdx}>
                  {options.value == "" ? options.label : options.value}
                </label>
              </div>
            </div>
          );
        })}
      </React.Fragment>
    );
  }
  
  const setShortAnswerValue = (index, formItemId, answerSelection, value) => {
    let responses = [...formResponse];
    let formItemResponse = {
      formRespondentId: formRespondentId,
      formItemsId: formItemId,
      answerSelectionId: answerSelection[0].id,
      answerSelectionValue: value,
    }
    responses[index-1] = formItemResponse;
    if(formResponse && formResponse.length == formItems.length) localStorage.setItem("tempFormResponse", JSON.stringify(responses));
    setFormResponse(responses);
    setNextNav(answerSelection[0].nextItem);
  }
    
  const loadShortAnswer = (index, formItemId, answerSelection) => {
    return (
      <React.Fragment>
        <div id="preview-short-answer">
          <AutoHeightTextarea id="preview-sa-text" placeholder="Your answer" onChange={(e) => setShortAnswerValue(index, formItemId, answerSelection, e.target.value)}
          value={formResponse[index-1] && formResponse[index-1].length && formResponse[index-1].answerSelectionValue ? formResponse[index-1].answerSelectionValue : ""}></AutoHeightTextarea>
        </div>
        <div className="char-counter">
          <span style={formResponse[index-1] && formResponse[index-1].length && formResponse[index-1].answerSelectionValue.length <= 255 ? {color: "gray"} : {color: "red"}}>{formResponse[index-1] && formResponse[index-1].length ? formResponse[index-1].answerSelectionValue.length : null}</span>
        </div>
      </React.Fragment>
    );
  }

  const submitForm = async () => {
    formResponse.map(async(response) => {
      if(!Array.isArray(response)) {
        try {
          await axios({
            method: "post",
            url: `${BASE_URL}/api/v1/forms/insert-response/${formRespondentId}`,
            data: response
          }).then(() => {
            localStorage.setItem("tempFormResponse", JSON.stringify([]));
          })
        } catch(error) {
          console.log(error);
        }
      } else {
        response.map(async (respItem, respIndex) => {
          if (navigator[respIndex] == -1 && respIndex != 0) return;
          console.log("Submitting form item index: " + respIndex);
          try {
            await axios({
              method: "post",
              url: `${BASE_URL}/api/v1/forms/insert-response/${formRespondentId}`,
              data: respItem
            }).then(() => {if(respIndex == response.length - 1) localStorage.setItem("tempFormResponse", JSON.stringify([]))});
          } catch(error) {
            console.log(error);
          }
        });
      }
    })
  }
    
  const handleOpenChat = () => {
    setOpenChat(!openChat);
  }

  const handleClickSend = () => {
    let userId = JSON.parse(localStorage.getItem("loggedInUser"));
    let newMessage = {
      feedbackId: feedbackId,
      userId: userId,
      feedbackMessage: tempMessage,
    };
    console.log(newMessage);
    try {
      axios({
        method: "post",
        url: `${BASE_URL}/api/v1/feedback/by-feedback-message/insert`,
        data: newMessage,
        headers: { "Content-Type" : "application/json" }
      }).then((res) => {
        let messages = [...feedbackMessages];
        messages.push(res.data);
        preparingMessages(messages);
        setTempMessage("");
        updateTextarea();
      })
    } catch(error) {
      console.log(error);
    }
  };
    
  const displayChatBox = () => {
    let chatbox = document.getElementById("respondent-chat-box");
    if(openChat) chatbox.classList.toggle('respondent-chat-box--active');
    else {
      chatbox.classList.toggle('respondent-chat-box--active');
      chatRef.current.scrollIntoView(false);
    }
  }

  const handleMessageInput = (e) => {
    setTempMessage(e.target.value);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") handleClickSend();
  };

  const updateTextarea = () => {
    let textarea = document.getElementById("respondent-chat-input");
    if (textarea) {
      textarea.value = "";
    }
  };

  const respondentChat = () => {
    let userId = JSON.parse(localStorage.getItem("loggedInUser"));
    return (
      <div id="respondent-chat-box">
        <div id="respondent-chat-header">
          <div id="respondent-chat-profile-image"></div>
          <div id="respondent-chat-profile-name">Survey Maker</div>
        </div>
        <div id="respondent-chat-content" >
          {feedbackMessages.map((m) => {
            return (
              m.createDateTime ? (
                <div 
                  className="respondent-chat-wrapper"
                  id={m.userId != userId ? "respondent-chat-1" : "respondent-chat-2"}
                >
                  <div className="respondent-chat-message">{m.feedbackMessage}</div>
                  <div className="respondent-chat-timestamp">{m.time}</div>
                </div>
              ) : (
                <div className="respondent-chat-wrapper">
                  <div className="respondent-chat-date">
                    {"— " + m.toString() + " —"}
                  </div>
                </div>
              )
            )
          })}
          <div id="end-of-chat" ref={chatRef}></div>
        </div>
        <div id="respondent-chat-footer">
          <AutoHeightTextarea 
            id="respondent-chat-input"
            // type="text" 
            // value=
            onChange={(e) => {
              handleMessageInput(e);
            }}
            onKeyUp={(e) => {
              handleEnter(e);
            }}
            placeholder='Please type your message...'
          />
          <div id="respondent-chat-send" 
            onClick={() => { 
              handleClickSend();
            }}
          >
            <ion-icon name="send-outline" id="send-icon"></ion-icon>
          </div>
        </div>
      </div>
    );
  }

  const displayOnSubmission = () => {
    return (
      <React.Fragment>
        {formRespondentId ? (
          <Link to="/" className="preview-submit-button" style={{ backgroundColor: primaryColor }} onClick={() => submitForm()}>
            Submit Form
          </Link>
        ) : (
          <div className="preview-submit-button" style={{ backgroundColor: "gray" }} onClick={() => submitForm()}>Submit Form (Unable to connect)</div>
        )}
      </React.Fragment>
    )
  }

  return (
      <React.Fragment>
          <div className="respondent-container">
              <div className="page-title" id="page-title-respondent">
                  {props.previewMode ? null : formMetadata.title}
              </div>
              <div className="page-description-respondent">
                  {props.previewMode ? null : formMetadata.description}
              </div>
              <div className="display-container" id="display-respondent">
                {index == 1 ? 
                  null : (
                  <div id="preview-back-icon-animation"
                    style={navToggle ? {backgroundColor: "transparent"} : {backgroundColor: "gray"}}>
                    <ion-icon
                      name="chevron-back-outline"
                      id="preview-back-icon"
                      onClick={handleBack}
                    />
                  </div>
                )}
                {displayQuestion()}
                {(index > formItems.length && !props.previewMode) || (index > formItems.length - 1 && props.previewMode) ? null : (
                  <div id="preview-next-icon-animation"
                    style={navToggle ? {backgroundColor: "transparent"} : {backgroundColor: "gray"}}>
                    <ion-icon
                      name="chevron-forward-outline"
                      id="preview-next-icon"
                      onClick={handleNext}
                    />
                  </div>
                )}
              </div>
              <div className="page-indicator">
                <div className="symbol-indicator">
                  {formItems.map((item, idx) => {
                    return (
                      <React.Fragment>
                        <div className="each-indicator"
                          style={idx <= index-1 ? {backgroundColor: "gray"} : null}/>
                      </React.Fragment>
                    );
                  })}
                </div>
                <div className="text-indicator"><span id="page-num">{index}</span><span id="max-page">/{formItems.length}</span></div>
              </div>
              <div id="respondent-chat">
                {respondentChat()}
                <div id="respondent-chat-button-float" 
                  onClick={() => {
                    handleOpenChat();
                    displayChatBox();
                  }}
                >
                  <ion-icon name={openChat ? "close" : "chatbubbles"} id="respondent-chat-icon"></ion-icon>
                </div>
              </div>
          </div>
      </React.Fragment>
  );
}
 
export default Respondent;