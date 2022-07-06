import axios from 'axios';
import React, { Component, useEffect, useState, useRef, createRef } from 'react';
import { Link, useParams } from "react-router-dom";
import AutoHeightTextarea from './functional-components/AutoheightTextarea';
import DateTimeService from './functional-components/services/DateTimeService';

import dummyProfile from "./images/woman.jpg";

const BASE_URL = "http://10.61.44.90:8080";

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
  const [currDateTime, setCurrDateTime] = useState(new Date(0));

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
            console.log(res.data);
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
            let loadNav = localStorage.getItem("navigator");
            let nav_check = false;
            if(loadNav) {
              loadNav = JSON.parse(loadNav);
              if(loadNav.length == res.data.length + 1) {
                setNavigator(loadNav);
                nav_check = true;
              }
            }
            if(!nav_check || (loadNav && loadNav.length != res.data.length + 1)){
              let tempNav = [];
              res.data.map((data) => tempNav.push(-1));
              if(tempNav.length > 0) tempNav.push(-1);
              console.log("check init navigator", tempNav);
              setNavigator(tempNav);
              localStorage.setItem("navigator", JSON.stringify(tempNav));
            }
        });
    } catch (error) {
      console.log(error);
    }
    // DESIGN
    responsePageTheme();
    // CHAT
    if(!previewMode){
      let userId = JSON.parse(localStorage.getItem("loggedInUser"));
      if(userId) {
        let userId_data = {"userId": userId}
        axios({
          method: "post",
          url: `${BASE_URL}/api/v1/forms/form-respondent/${formId}`,
          data: userId_data, 
        }).then((res) => {
          if(res.data && res.data.length > 0){
            // setFormRespondentId(res.data[0]);
            console.log("formres", res.data);
            setFormRespondentId(res.data.formRespondentId);
            localStorage.setItem("alreadySubmitted", JSON.stringify(res.data.submitDate));
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
              setFormRespondentId(res.data);
            });
          }
        });
      }
    }
    let prevElement = document.querySelector('.display-container');
    if(props.previewMode) prevElement.style.marginTop = 0 + 'px';
    let displayContainer = document.querySelector('.inner-display-container');
    displayContainer.addEventListener('animationend', () => {
      displayContainer.style.animation = '';
    });
    localStorage.removeItem("navigator");
    localStorage.removeItem("tempFormResponse");
    return () => {
      if(!previewMode){
        let check = undefined;
        axios({
          method: "get",
          url: `${BASE_URL}/api/v1/feedback/by-feedback/${feedbackId}`,
        }).then((res) => {
          check = res.data;
        }).finally(() => {
          if(check == undefined) axios.delete(`${BASE_URL}/api/v1/feedback/${feedbackId}`).catch((error) => console.log(error));
        })
      }
      let alreadySubmitted = localStorage.getItem("alreadySubmitted");
      let isSubmitted = localStorage.getItem("isSubmitted");
      if(!alreadySubmitted && !isSubmitted){
        let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        axios({
          method: "delete",
          url: `${BASE_URL}/api/v1/forms/force-delete-form-respondent/${formId}`,
          data: loggedInUser,
          headers: { "Content-Type" : "text/plain" }
        })
      }
      localStorage.removeItem("navigator");
      localStorage.removeItem("tempFormResponse");
    };
    
  }, []);

  useEffect(() => {
    getAnswerSelection();
  }, [formItems])

  useEffect(() => {
    if(!formRespondentId) return;
    if(!formItems || formItems.length == 0) return;
    let loadData = localStorage.getItem("tempFormResponse");
    let validator = false;
    if (loadData) {
      let selectedId = null;
      loadData = JSON.parse(loadData);
      console.log("loadData");
      console.log(loadData);
      if(loadData.length)
        formItems.map((data, idx) => {
          if(data.type != "CB" && !selectedId) {
            selectedId = loadData[idx]['formRespondentId'];
            console.log("if(data.type != CB && !selectedId)")
            console.log("selectedId: ", selectedId);
          } else {
            let currentResp = loadData[idx];
            if(currentResp && currentResp.length > 0) currentResp.map((resp) => {
              if(!selectedId) selectedId = resp['formRespondentId'];
            });
            console.log("else, selectedId: ", selectedId);
          }
        });
      if(selectedId == formRespondentId) {
        setFormResponse(loadData);
        validator = true;
      }
    }
    if(!validator) {
      console.log("!validator");
      loadData = [];
      formItems.map((fi) => {
        if (fi.type == "CB") loadData.push([]);
        else loadData.push({});
      });
      setFormResponse(loadData);
    }
  }, [formRespondentId, answerSelection]);

  useEffect(() => {
    if(previewMode) return;
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
  
  useEffect(() => {
    if(!formItems || formItems.length == 0) return;
    if(navigator && navigator.length > 0) return;
    let loadNav = localStorage.getItem("navigator");
    let nav_check = false;
    if(loadNav) {
      loadNav = JSON.parse(loadNav);
      if(loadNav.length == formItems.length) {
        setNavigator(loadNav);
        nav_check = true;
      }
    }
    if(!nav_check || (loadNav && loadNav.length != formItems.length + 1)){
      let tempNav = [];
      formItems.map((data) => tempNav.push(-1));
      if(tempNav.length > 0) tempNav.push(-1);
      console.log("check init navigator", tempNav);
      setNavigator(tempNav);
      localStorage.setItem("navigator", JSON.stringify(tempNav));
    }
  }, [formResponse])

  useEffect(() => {
    if(formItems.length != formResponse.length || formResponse.length == 0) return;
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

  useEffect(() => {
    setIsLoaded(false);
    setNextNav(-1);
    if(formResponse[index-1] && formResponse[index-1].answerSelectionValue){
      let el = document.getElementById("preview-sa-text");
      if(el) el.value = formResponse[index-1].answerSelectionValue;
    }
    let el = document.getElementById("loading-transition");
    if(!el) return;
    if(el.classList.contains("loading-transition-done")) el.classList.remove("loading-transition-done");
    if(!el.classList.contains("loading-transition-onload")) el.classList.add("loading-transition-onload");
    setTimeout(() => {
      el.classList.remove("loading-transition-onload");
      el.classList.add("loading-transition-done");
      setIsLoaded(true)
    }, 500);
  }, [index]);

  useEffect(() => {
    if(isLoaded) return;
    let el = document.getElementById("loading-transition");
    if(!el) return;
    el.style.animation = "done-trans 2s forwards";
  }, [isLoaded]);

  useEffect(() => {
    chatRef.current.scrollIntoView(false);
  }, [feedbackMessages])

  useEffect(() => {
    let navbar = document.getElementById("navbar");
    let background = document.getElementById("display-background");
    let chatHeader;
    let chatIcon;
    if(!previewMode){
      chatHeader = document.getElementById("respondent-chat-header");
      chatIcon = document.getElementById("respondent-chat-button-float");
      chatHeader.style.backgroundColor = primaryColor;
      chatIcon.style.backgroundColor = primaryColor;
    }
    navbar.style.backgroundColor = primaryColor;
    if(bgLink == "") background.style.backgroundColor = secondaryColor;
    else {
      async function fetchImage() {
        const res = await fetch(bgLink);
        const imageBlob = await res.blob();
        const imageUrl = URL.createObjectURL(imageBlob);
        background.style.backgroundImage = `url(${imageUrl})`;
      }
      fetchImage();
    }
    return () => {
      navbar.style.backgroundColor = "";
      background.style.backgroundColor = "";
      background.style.backgroundImage = "";
      background.style.backgroundSize = "";
      if(!previewMode && chatHeader && chatIcon){
        chatHeader.style.backgroundColor = "";
        chatIcon.style.backgroundColor = "";
      }
    }
  }, [bgLink, primaryColor]);
  
  const preparingMessages = (data) => {
    let tempDateTime = currDateTime;
    let index = -1;
    let listOfInsert = [];
    data.map((f) => {
      index++;
      if(f['date'] && f['time']) return;
      if(!f['createDateTime']) return;
      const current = DateTimeService("convertToDateTime", f.createDateTime);
      let compareObj = {
        value1: tempDateTime,
        value2: current.datetime
      }
      let flag = DateTimeService("compareTwoDates", compareObj);
      if(flag == true){
        tempDateTime = current.datetime;
        let insert = {
          date: current.date,
          index: index + listOfInsert.length,
        }
        listOfInsert.push(insert);
      }
      f['date'] = current.date;
      f['time'] = current.time;
    });
    listOfInsert.map((insert) => {
      data.splice(insert.index, 0, insert.date);
    })
    setCurrDateTime(tempDateTime);
    prevFeedbackMessage.current = data;
    setFeedbackMessages(data);
  }

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
    setBgLink(selectedForm.backgroundLink);
  }

  const getAnswerSelection = () => {
    if(!formItems || !formItems.length) return;
    let tempArr = [];
    formItems.map(() => tempArr.push([]));
    formItems.map((currentItem, idx) => {
      try {
        axios({
          method: "get",
          url: `${BASE_URL}/api/v1/forms/get-answer-selection/${currentItem.id}`
        }).then((res) => {
          tempArr[idx] = res.data;
          if(idx == formItems.length - 1) setAnswerSelection(tempArr);
        });
      } catch(error) {
        console.log(error);
      }
    });
  }

  const checkIsRequired = (formItem, formResponse) => {
    let checker = true;
    if(!(formItem.type == "CB" || formItem.type == "LS")) {
      // SA, MC
      if(!formResponse || formResponse.answerSelectionValue == "" || !(formResponse.answerSelectionValue)) checker = false;
    }
    else if(formItem.type == "CB"){
      if(!formResponse || formResponse.length == 0) checker = false;
      else
      formResponse.map(resp => {
        if(resp || resp.answerSelectionValue != "") return;
        checker = false;
      });
    }
    else if(formItem.type == "LS"){
      if(!formResponse || !formResponse.answerSelectionValue) checker = false;
    } 
    return checker;
  }

  const findItemByNumber = (itemNumber) => {
    let i = -1;
    formItems.map((data, idx) => {
      if(data.itemNumber == itemNumber){
        i = idx;
      }
    });
    if(i != -1) return i+1;
    return -1;
  }

  const warningStyle = () => {
    let displayContainer = document.querySelector('.inner-display-container');
    if(!navToggle){
      displayContainer.style.border = "2px solid #f16f6f";
      displayContainer.style.backgroundColor = "#fde6e6";
    } else {
      displayContainer.style.border = "2px solid #c4c4c4";
      displayContainer.style.backgroundColor = "rgba(255, 255, 255, 0.76)";
      displayContainer.style.animation = 'show-transition 1s forwards';
    }
  }

  const handleNext = () => {
    console.log("nextNav:", nextNav);
    // console.log(navToggle);
    // let displayContainer = document.querySelector('.inner-display-container');
    warningStyle();
    if(!navToggle){
      return;
    } 
    console.log("cek Navigator:",navigator);
    if(navigator && navigator.length != formItems.length + 1) return;
    if(nextNav == -1) {
      let tempIdx = index+1;
      setIndex(tempIdx);
      let tempNav = [...navigator];
      tempNav[tempIdx-1] = -1;
      setNavigator(tempNav);
      localStorage.setItem("navigator", JSON.stringify(tempNav));
    }
    else if(index != formItems.length + 1) {
      let previousNav = index;
      let currentIdx = findItemByNumber(nextNav);
      setIndex(currentIdx);
      let tempNav = [...navigator];
      tempNav[currentIdx-1] = previousNav;
      for(let x=previousNav; x < currentIdx-1; x++){
        tempNav[x] = -1;
      }
      setNavigator(tempNav);
      localStorage.setItem("navigator", JSON.stringify(tempNav));
    } else {
      setIndex(index + 1);
    }
    let answerTextarea = document.getElementById("preview-sa-text");
    if(answerTextarea){
      answerTextarea.value = "";
    }
    // displayContainer.style.animation = 'show-transition 1s forwards';
  }
    
  const handleBack = () => {
    // warningStyle();
    // if(!navToggle){
    //   return;
    // }
    if(navigator[index-1] == -1) setIndex(index - 1);
    else setIndex(navigator[index-1]);

    let displayContainer = document.querySelector('.inner-display-container');
    displayContainer.style.animation = 'hide-transition 1s forwards';

    let answerTextarea = document.getElementById("preview-sa-text");
    if(answerTextarea){
      answerTextarea.value = "";
    }
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
    }
    return (
      <div className="preview-flex">
        <React.Fragment>
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
                  ? (loadAnswerField = loadLinearScale(index, current.id, answerSelection[index-1]))
                  : current.type == "MC"
                  ? (loadAnswerField = loadMultipleChoice(index, current.id, answerSelection[index-1]))
                  : current.type == "CB"
                  ? (loadAnswerField = loadCheckbox(index, current.id, answerSelection[index-1]))
                  : current.type == "SA"
                  ? (loadAnswerField = loadShortAnswer(index, current.id, answerSelection[index-1]))
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
              <div className="loading-transition"></div>
              <div className="respondent-endpage-title" style={{ backgroundColor: primaryColor }}>Congratulations!</div>
              <div className="respondent-endpage-description">You are at the end of the form. Click the button below to submit your answer! :)</div>
              { displayOnSubmission() }
            </div>
        )}
      </React.Fragment>
      </div>
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
    console.log("responses ");
    console.log(responses);
    console.log("formResponse");
    console.log(formResponse);
    console.log("formItems.length");
    console.log(formItems.length);
    if(formResponse && formResponse.length == formItems.length){
      console.log("set item");
      localStorage.setItem("tempFormResponse", JSON.stringify(responses));
    }
    setFormResponse(responses);
    setNextNav(selectedAnswerSelection.nextItem);
  }

  const loadMultipleChoice = (index, formItemId, arrayOptions) => {
    if(!arrayOptions) return;
    return (
      <React.Fragment>
        <div id="preview-multiple-choice">
          { 
            arrayOptions.map((options, innerIdx) => {
            if(formResponse[index-1] && options.id == formResponse[index-1].answerSelectionId && options.nextItem != nextNav){
              setNextNav(options.nextItem);
            }
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
    let id;
    let value;
    if(responses[index-1] && responses[index-1].answerSelectionId == selectedAnswerSelection.id){
      id = "";
      value = "";
    } else {
      id = selectedAnswerSelection.id;
      value = selectedAnswerSelection.label;
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
    setNextNav(-1);
  }

  const loadLinearScale = (index, formItemId, arrayOptions) => {
    if(!arrayOptions) return;
    return (
      <React.Fragment>
        <div id="preview-linear-scale">
          {arrayOptions.map((options, innerIdx) => {
            return (
              <div className="preview-option-container" id="preview-option-ls-container" key={"ls-"+formItemId+"-"+innerIdx}>
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
                    {options.label != ("Option " + (innerIdx + 1)) ? options.label : ""}
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
    setNextNav(-1);
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
    if(!arrayOptions) return;
    return (
      <React.Fragment>
        {arrayOptions.map((options, innerIdx) => {
          return (
            <div className="preview-option-container" id="preview-option-mc-cb-container" key={"cb-"+formItemId+"-"+innerIdx}>
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
    setNextNav(-1);
  }
    
  const loadShortAnswer = (index, formItemId, answerSelection) => {
    return (
      <React.Fragment>
        <div id="preview-short-answer">
          <AutoHeightTextarea id="preview-sa-text" placeholder="Your answer" onChange={(e) => setShortAnswerValue(index, formItemId, answerSelection, e.target.value)}/>
        </div>
        <div className="char-counter">
          <span style={formResponse[index-1] && formResponse[index-1].length && formResponse[index-1].answerSelectionValue.length <= 255 ? {color: "gray"} : {color: "red"}}>{formResponse[index-1] && formResponse[index-1].length ? formResponse[index-1].answerSelectionValue.length : null}</span>
        </div>
      </React.Fragment>
    );
  }

  const submitForm = async () => {
    console.log("submitForm", formResponse);
    formResponse.map(async(response, resIdx) => {
      if(!Array.isArray(response)) {
        console.log("masuk 1", response);
        try {
          await axios({
            method: "post",
            url: `${BASE_URL}/api/v1/forms/insert-response/${formRespondentId}`,
            data: response
          })
        } catch(error) {
          console.log(error);
        }
      } else {
        response.map(async (respItem, respIndex) => {
          console.log("Submitting form item index: " + respIndex);
          console.log("masuk 2", respItem);
          try {
            await axios({
              method: "post",
              url: `${BASE_URL}/api/v1/forms/insert-response/${formRespondentId}`,
              data: respItem
            })
          } catch(error) {
            console.log(error);
          }
        });
      }
      if(resIdx == formResponse.length - 1) localStorage.setItem("tempFormResponse", JSON.stringify([]));
    });
    localStorage.setItem("isSubmitted", JSON.stringify("true"));
    let currentVersion = JSON.parse(localStorage.getItem("selectedForm")).versionNo;
    console.log("currentVersion", currentVersion);
    axios({
      method: "put",
      url: `${BASE_URL}/api/v1/forms/submit-form/${formRespondentId}`,
      data: currentVersion,
      headers: { "Content-Type" : "text/plain" }
    }).catch((error) => console.log(error));
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
                <div id="display-background"></div>
                {index == 1 ? 
                  null : (
                  <div id="preview-back-icon-animation"
                    style={navToggle ? {backgroundColor: "white"} : null}>
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
                    style={navToggle ? {backgroundColor: "white"} : {backgroundColor: "gray"}}>
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
                      <React.Fragment key={"indicator"+idx}>
                        <div className="each-indicator"
                          style={idx <= index-1 ? {backgroundColor: "gray"} : null}/>
                      </React.Fragment>
                    );
                  })}
                </div>
                <div className="text-indicator"><span id="page-num">{index}</span><span id="max-page">/{formItems.length}</span></div>
              </div>
              {!previewMode ? (
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
              ) : null}
              {/* <div id="respondent-chat">
                {respondentChat()}
                <div id="respondent-chat-button-float" 
                  onClick={() => {
                    handleOpenChat();
                    displayChatBox();
                  }}
                >
                  <ion-icon name={openChat ? "close" : "chatbubbles"} id="respondent-chat-icon"></ion-icon>
                </div>
              </div> */}
          </div>
      </React.Fragment>
  );
}
 
export default Respondent;