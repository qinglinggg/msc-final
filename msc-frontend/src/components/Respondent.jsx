import axios from 'axios';
import React, { Component, useEffect, useState, useRef } from 'react';
import { Link, useParams } from "react-router-dom";
import AutoHeightTextarea from './functional-components/AutoheightTextarea';

import dummyProfile from "./images/woman.jpg";

const BASE_URL = "http://10.61.38.193:8080";

function Respondent (props) {
  let { formId } = useParams();

  const [index, setIndex] = useState(1);
  const [formMetadata, setFormMetadata] = useState([]);
  const [formItems, setFormItems] = useState([]);
  const [answerSelection, setAnswerSelection] = useState([]);
  const [formRespondentId, setFormRespondentId] = useState();
  const [formResponse, setFormResponse] = useState([]);
  const [next, setNext] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);

  const [openChat, setOpenChat] = useState(false);
  const [tempMessage, setTempMessage] = useState("");
  const [feedbackId, setFeedbackId] = useState();
  const [feedbackMessages, setFeedbackMessages] = useState([]);
  const prevFeedbackMessage = useRef(0);
  const chatRef = React.createRef();

  // DESIGN
  const [primaryColor, setPrimaryColor] = useState("Default");
  const [secondaryColor, setSecondaryColor] = useState("Default");
  const [bgLink, setBgLink] = useState("./images/woman.jpg");

  useEffect(() => {
    // console.log("formId : " + formId + " is rendered.");
    // console.log("Preview mode enabled: " + props.previewMode);
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
    })
    return () => {
      console.log("feedbackId is destroyed");
      if(feedbackMessages.length == 0){
        axios.delete(`${BASE_URL}/api/v1/feedback/${feedbackId}`).catch((error) => console.log(error));
      }
    };
  }, []);

  useEffect(() => {
    if(!formItems) return;
    let loadData = localStorage.getItem("tempFormResponse");
    if (loadData) {
      loadData = JSON.parse(loadData);
    }
    if (loadData.length !== formItems.length) {
      loadData = [];
      formItems.map((fi) => {
        if (fi.type == "CB") loadData.push([]);
        else loadData.push({});
      });
    }
    setFormResponse(loadData);
  }, [formItems])

  useEffect(() => {
    let userId = JSON.parse(localStorage.getItem("loggedInUser"));
    if(feedbackId == undefined){
      let newFeedback = {
        formId: formId,
        userId: userId,
      }
      try {
        axios({
          method: "post",
          url: `${BASE_URL}/api/v1/feedback/by-feedback/insert`,
          data: newFeedback,
        }).then((res) => {
          setFeedbackId(res.data);
          console.log("feedbackId: " + res.data);
        })
      } catch (error){
        console.log(error);
      }
    }
    if(feedbackId){
      if(feedbackMessages.length == 0){
        console.log("currently loading past feedback messages...");
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
      }
    } 
  }, [feedbackId]);

  const preparingMessages = (data) => {
    // new date element objects: [date] [indexToInsert]
    // existing date element objects: [date]
    data.map((f) => {
      if(f['date'] && f['time']) return;
      const messageDate = new Date(f.createDateTime);
      const date = messageDate.getDate() + "/" + messageDate.getMonth() + "/" + messageDate.getFullYear();
      let time = messageDate.getHours() + ':';
      if(messageDate.getMinutes() == 0) time = time + messageDate.getMinutes() + '0';
      else if(messageDate.getMinutes() < 10) time = time + '0' + messageDate.getMinutes();
      else time = time + messageDate.getMinutes();
      f['date'] = date;
      f['time'] = time;
    });
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

  useEffect(() => {
    let length = formItems.length;
    if(index <= length){
      let current = formItems[index-1];
      let requiredField = document.getElementById("required-field");
      if(current.isRequired){
        if(!formResponse[index-1] || formResponse[index-1].answerSelectionValue == ""){
          requiredField.innerHTML = "* This is a required question!";
          setNext(false);
        } else {
          requiredField.innerHTML = "";
          setNext(true);
        }
      }
    }
  }, [index, formResponse])

  const handleNext = () => {
    if(next) {
      setIndex(index + 1);
      let displayContainer = document.querySelector('.inner-display-container');
      displayContainer.style.animation = 'show-transition 1s forwards';
    }
  }
    
  const handleBack = () => {
    setIndex(index - 1);
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
                <div id="required-field" />
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
    console.log("formRespondentId: " + formRespondentId);
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
  }

  const loadMultipleChoice = (index, formItemId, arrayOptions) => {
    return (
      <React.Fragment>
        <div id="preview-multiple-choice">
          { 
            arrayOptions.map((options, innerIdx) => {
            return (
              <div className="preview-option-container" id="preview-option-mc-cb-container">
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

  // TODO: Bugs di Linear Scale, tidak bisa ganti answer
  const setLinearScaleValue = (index, formItemId, selectedAnswerSelection) => {
    let responses = [...formResponse];
    let formItemResponse = {
      formRespondentId: formRespondentId,
      formItemsId: formItemId,
      answerSelectionId: selectedAnswerSelection.id,
      answerSelectionValue: selectedAnswerSelection.value,
    }
    responses[index-1] = formItemResponse;
    if(formResponse && formResponse.length == formItems.length) localStorage.setItem("tempFormResponse", JSON.stringify(responses));
    setFormResponse(responses);
  }

  const loadLinearScale = (index, formItemId, arrayOptions) => {
    return (
      <React.Fragment>
        <div id="preview-linear-scale">
          {arrayOptions.map((options, innerIdx) => {
            // console.log(options);
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
          console.log("deleted");
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
  // TODO: Nilai Short Answer selalu null, coba dicek
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
  }
    
  const loadShortAnswer = (index, formItemId, answerSelection) => {
    return (
      <React.Fragment>
        <div id="preview-short-answer">
          <AutoHeightTextarea id="preview-sa-text" placeholder="Your answer" onChange={(e) => setShortAnswerValue(index, formItemId, answerSelection, e.target.value)}
          value={formResponse[index-1] && formResponse[index-1].answerSelectionValue ? formResponse[index-1].answerSelectionValue : ""}></AutoHeightTextarea>
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
              <React.Fragment>
                <div 
                  className="respondent-chat-wrapper"
                  id={m.userId != userId ? "respondent-chat-1" : "respondent-chat-2"}
                >
                  <div className="respondent-chat-message">{m.feedbackMessage}</div>
                  <div className="respondent-chat-timestamp">{m.date + " " + m.time}</div>
                </div>
              </React.Fragment>
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
                  <div id="preview-back-icon-animation">
                    <ion-icon
                      name="chevron-back-outline"
                      id="preview-back-icon"
                      onClick={handleBack}
                    />
                  </div>
                )}
                {displayQuestion()}
                {(index > formItems.length && !props.previewMode) || (index > formItems.length - 1 && props.previewMode) ? null : (
                  <div id="preview-next-icon-animation">
                    <ion-icon
                      name="chevron-forward-outline"
                      id="preview-next-icon"
                      onClick={handleNext}
                    />
                  </div>
                )}
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