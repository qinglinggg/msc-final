import axios from 'axios';
import React, { Component, useEffect, useState } from 'react';
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
    const [openChat, setOpenChat] = useState(false);
    const [tempMessage, setTempMessage] = useState("");
    const [feedbackId, setFeedbackId] = useState();
    const [feedbackMessages, setFeedbackMessages] = useState([]);

    // DESIGN
    const [primaryColor, setPrimaryColor] = useState("Default");
    const [secondaryColor, setSecondaryColor] = useState("Default");
    const [bgLink, setBgLink] = useState("");

    useEffect(() => {
      console.log("formId : " + formId + " is rendered.");
      try { 
          axios({
              method: "get",
              url: `${BASE_URL}/api/v1/forms/${formId}`
          }).then((res) => {
              setFormMetadata(res.data);
              localStorage.setItem("selectedForm", JSON.stringify(res.data));
              console.log(res.data);
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
      // let createNewFeedback = false;
      // cek pernah kirim message ga
      // try {
      //   axios({
      //     method: "get",
      //     url: `${BASE_URL}/api/v1/feedback/by-form-and-user/${formId}`,
      //     data: userId,
      //   }).then((res) => {
      //     if(res.data){
      //       setFeedbackId(res.data);
      //     }
      //     // else createNewFeedback = true;
      //   })
      // } catch(error) {
      //   console.log(error);
      // }
      // get feedbackId by formId and userId
      let userId = localStorage.getItem("loggedInUser");
      if(userId) {
        axios({
          method: "post",
          url: `${BASE_URL}/api/v1/forms/form-respondent/${formId}`,
          data: userId, // cek lagi nanti. 
        }).then((res) => {
          console.log("Mencari Form Responden User")
          if(res) setFormRespondentId(res.data);
          else {
            let newFormRespondent = {
              userId: userId,
              isTargeted: 0,
            }
            axios({
              method: "post",
              url: `${BASE_URL}/api/v1/forms/insert-form-respondent/${formId}`
            }).then((res) => {
              setFormRespondentId(res.data);
            })
          }
        });
      }
    }, []);

    useEffect(() => {
      if(!formItems) return;
      let loadData = JSON.parse(localStorage.getItem("tempFormResponse"));
      if (loadData) setFormResponse(loadData);
      else {
        let tempData = [];
        formItems.map(() => {
          console.log("test");
          tempData.push({});
        });
        setFormResponse(tempData);
      }
    }, [formItems])

    useEffect((prevState) => {
      if(feedbackId != undefined && prevState.feedbackId == ""){
        try {
          axios({
            method: "get",
            url: `${BASE_URL}/api/v1/feedback/by-feedback/${feedbackId}`,
          }).then((res) => {
            setFeedbackMessages(res.data);
          })
        } catch (error) {
          console.log(error);
        }
      }
    }, [feedbackId]);

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

    useEffect(() => {
      localStorage.setItem("tempFormResponse", JSON.stringify(formResponse));
    }, [formResponse])

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
    
    const handleNext = () => {
        setIndex(index + 1);
        // console.log(index);
    }
    
    const handleBack = () => {
        setIndex(index - 1);
    }
     
    const displayQuestion = () => {
      let length = formItems.length;
      return (
          <div className="display-container">
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
        let current = formItems[index-1];
        getAnswerSelection(formItems[index-1]);
        return (
          <React.Fragment>
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
            <div className="preview-flex">
              Selected option: {formResponse && formResponse[index-1] ? formResponse[index-1].answerSelectionValue : null}
              <div className="preview-field">
              <div id="preview-index">
              {index}.
              </div>
              {current.content == '' ? 
                <div id="preview-warning">There is no question, please contact the author.</div> 
                : current.content
              }
              </div>
              <div className="answer-field">
                {current.type == "LS"
                  ? (loadAnswerField = loadLinearScale(current.id, answerSelection))
                  : current.type == "MC"
                  ? (loadAnswerField = loadMultipleChoice(index, current.id, answerSelection))
                  : current.type == "CB"
                  ? (loadAnswerField = loadCheckbox(current.id, answerSelection))
                  : current.type == "SA"
                  ? (loadAnswerField = loadShortAnswer(current.id))
                  : null}
              </div>
            </div>
            {index == length ? null : (
              <div id="preview-next-icon-animation">
                <ion-icon
                  name="chevron-forward-outline"
                  id="preview-next-icon"
                  onClick={handleNext}
                />
              </div>
            )}
          </React.Fragment>
        );
      }

      const setMultipleChoiceValue = (index, formItemId, selectedAnswerSelection) => {
        // find formitemid yg sama, dihapus. push yg baru.
        let responses = [...formResponse];
        let formItemResponse = {
          formRespondentId: formRespondentId,
          formItemId: formItemId,
          answerSelectionId: selectedAnswerSelection.id,
          answerSelectionValue: selectedAnswerSelection.value,
        }
        responses[index-1] = formItemResponse;
        console.log("Set Multiple Choice Value:");
        console.log(responses[index-1].answerSelectionValue);
        setFormResponse(responses);
      }

      const loadMultipleChoice = (index, formItemId, arrayOptions) => {
        return (
          <React.Fragment>
            <div id="preview-multiple-choice">
              { 
                arrayOptions.map((options, innerIdx) => {
                return (
                  <div id="preview-option-container">
                    <div id="preview-input-mc-cb-container">
                      <input
                        className="answerSelection"
                        id={"options-"+formItemId+"-"+innerIdx}
                        type="radio"
                        name={"options-"+formItemId}
                        checked={formResponse[index-1] && options.value == formResponse[index-1].answerSelectionValue}
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

      const setLinearScaleValue = (formItemId, selectedAnswerSelection) => {
        let responses = [...formResponse];
        let deletePrevChoice = responses.filter((choice) => {
          return choice.formItemId != formItemId;
        });
        let formItemResponse = {
          formRespondentId: formRespondentId,
          formItemId: formItemId,
          answerSelectionId: selectedAnswerSelection.id,
          answerSelectionValue: selectedAnswerSelection.value,
        }
        deletePrevChoice.push(formItemResponse);
        setFormResponse(deletePrevChoice);
      }

      const loadLinearScale = (formItemId, arrayOptions) => {
        return (
          <React.Fragment>
            <div id="preview-linear-scale">
              {arrayOptions.map((options) => {
                return (
                  <div id="preview-option-container">
                    <div id="preview-input-ls-container">
                      <input
                        className="answerSelection"
                        id="option-ls"
                        type="radio"
                        name="options"
                        onClick={() => setLinearScaleValue(formItemId, options)}
                      />
                      <label id="option-ls-label" for="options">
                        {options.value}
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </React.Fragment>
        );
      }

      const setCheckboxValue = (formItemId, selectedAnswerSelection) => {
        let responses = [...formResponse];
        let formItemResponse = {
          formRespondentId: formRespondentId,
          formItemId: formItemId,
          answerSelectionId: selectedAnswerSelection.id,
          answerSelectionValue: selectedAnswerSelection.value,
        }
        responses.push(formItemResponse);
        setFormResponse(responses);
      }
    
      const loadCheckbox = (formItemId, arrayOptions) => {
        return (
          <React.Fragment>
            {arrayOptions.map((options) => {
              return (
                <div id="preview-option-container">
                  <div id="preview-input-mc-cb-container">
                    <input
                      className="answerSelection"
                      id="option-mc-cb"
                      type="checkbox"
                      name="options"
                      onClick={() => setCheckboxValue(formItemId, options)}
                    />
                    <label id="option-label" for="options">
                      {options.value == "" ? options.label : options.value}
                    </label>
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        );
      }

      const setShortAnswerValue = (formItemId, value) => {
        let responses = [...formResponse];
        let prevAnswer = responses.filter((r) => {
          return r.formItemId != formItemId;
        })
        let formItemResponse = {
          formRespondentId: formRespondentId,
          formItemId: formItemId,
          answerSelectionId: 1,
          answerSelectionValue: value,
        }
        prevAnswer.push(formItemResponse);        
      }
    
    const loadShortAnswer = (formItemId) => {
      return (
        <React.Fragment>
          <div id="preview-short-answer">
            <AutoHeightTextarea id="preview-sa-text" placeholder="Your answer" onChange={(e) => setShortAnswerValue(formItemId, e.target.value)}></AutoHeightTextarea>
          </div>
        </React.Fragment>
      );
    }

    const submitForm = () => {
      console.log("submit Form: ");
      console.log(formResponse);
      formResponse.map((response) => {
        try {
          axios({
            method: "post",
            url: `${BASE_URL}/api/v1/forms/insert-response/${formRespondentId}`,
            data: response
          }).then(() => {
            localStorage.setItem("tempFormResponse", JSON.stringify([]));
          })
        } catch(error) {
          console.log(error);
        }
      })

    }
    
    const handleOpenChat = () => {
      setOpenChat(!openChat);
    }

    const handleCreateNewFeedback = () => {
      if(feedbackId == "") {
        let newFeedback = {
          formId: formId,
          userId: props.user,
        }
        // pernah, displayPreviousMessage passing feedbackId
        // nggak, maka insert feedback
        try {
          axios({
            method: "post",
            url: `${BASE_URL}/api/v1/feedback/by-feedback/insert`,
            data: newFeedback,
          }).then((res) => {
            // console.log(res.data);
            setFeedbackId(res.data);
          })
        } catch (error){
          console.log(error);
        }
      }
    }
    
    const displayChatBox = () => {
      let chatbox = document.getElementById("respondent-chat-box");
      if(openChat) chatbox.classList.toggle('respondent-chat-box--active');
      else chatbox.classList.toggle('respondent-chat-box--active');
    }

    const handleMessageInput = (e) => {
      setTempMessage(e.target.value);
    };

    const handleEnter = (e) => {
      if (e.key === "Enter") handleClickSend();
    };

    const handleClickSend = () => {
      if(feedbackId == undefined){
        handleCreateNewFeedback();
      }
      let newMessage = {
        feedbackId: feedbackId,
        senderUserId: props.user,
        message: tempMessage,
      };
      let messages = [...feedbackMessages];
      messages.push(newMessage);
      try {
        axios({
          method: "post",
          data: newMessage
        }).then(() => {
          setFeedbackMessages(messages);
          setTempMessage("");
          updateTextarea();
        })
      } catch(error) {
        console.log(error);
      }
    };

    const updateTextarea = () => {
      let textarea = document.getElementById("respondent-chat-input");
      if (textarea) {
        textarea.value = "";
      }
    };

    const respondentChat = () => {
      return (
        <div id="respondent-chat-box">
          <div id="respondent-chat-header">
            <div id="respondent-chat-profile-image"></div>
            <div id="respondent-chat-profile-name">Survey Maker</div>
          </div>
          <div id="respondent-chat-content">
            {feedbackMessages.map((m) => {
              return (
                <React.Fragment>
                  <div className="message-content">
                    <div
                      className="message-content-2"
                      id={m.userId != props.user ? "message-user-1" : "message-user-2"}
                    >
                      <div className="message-single-bubble">
                        <div id="message-single-content">{m.feedbackMessage}</div>
                      </div>
                      <div id="message-single-timestamp">{m.createDateTime}</div>
                    </div>
                  </div>
                </React.Fragment>
              )
            })}
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
                    {formMetadata.title}
                </div>
                <div className="page-description-respondent">
                    {formMetadata.description}
                </div>
                <div className="display-container" id="display-respondent">
                  {displayQuestion()}
                  {index == formItems.length ? (
                    displayOnSubmission()
                  ) : null}
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