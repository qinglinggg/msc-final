import React, { Component } from "react";
import Select from "react-select";
import AutoHeightTextarea from "./functional-components/AutoheightTextarea";
import Popup from "reactjs-popup";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { v4 as uuid } from "uuid";
import Option from "./Option";

const BASE_URL = "http://10.61.38.193:8081";

function Question(props) {
  const [selectedQuestionOption, setSelectedQuestionOption] = useState("");
  const [selectedIsRequired, setSelectedIsRequired] = useState(false);
  const [branchingState, setBranchingState] = useState(false);
  const [branchingSelection, setBranchingSelection] = useState([]);
  const prevBranchSelection = useRef();
  const [questionContent, setQuestionContent] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [arrayOptions, setArrayOptions] = useState([]);
  const [isUsed, setIsUsed] = useState(false);
  const [intervalObj, setIntervalObj] = useState([]);

  const questionOptions = [
    { value: "MC", label: "Multiple choice" },
    { value: "SA", label: "Short answer" },
    { value: "CB", label: "Checkbox" },
    { value: "LS", label: "Linear scale" },
  ];

  const inputOptions = [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
    { value: 6, label: "6" },
    { value: 7, label: "7" },
    { value: 8, label: "8" },
    { value: 9, label: "9" },
    { value: 10, label: "10" },
  ];

  useEffect(() => {
    if(props.questionData) {
      let questionContentTextarea = document.getElementById("question-input-" + props.questionData.id);
      if(questionContent) questionContentTextarea.value = questionContent;
      if(props.questionData.isRequired){
        if(props.questionData.isRequired == 1) setSelectedIsRequired(true);
        else setSelectedIsRequired(false);
      }
    }
    if (props.mode) {
      console.log("mounted");
      setQuestionContent(props.questionData.questionContent);
      setQuestionType(props.questionData.questionType);
      handleInterval();
      let elem = document.getElementById("question-input-" + props.questionData.id);
      elem.addEventListener("focusin", () => {
        setIsUsed(isUsed => {
          if(isUsed == false) return true;
          return isUsed;
        });
      });
      elem.addEventListener("focusout", () => {
        setIsUsed(isUsed => {
          if(isUsed == true) return false;
          return isUsed;
        });
      });
      let blockerElem = document.getElementById("blocker-" + props.questionData.id);
      blockerElem.style.display = "none";
    }
    return (() => {
      removeInterval();
    })
  }, []);

  useEffect(() => {
    let branch_check = false;
    if(!arrayOptions) return;
    for(let x=0; x<arrayOptions.length; x++){
      let currentData = arrayOptions[x];
      if (currentData.nextItem != -1) branch_check = true;
    }
    if (branch_check && !branchingState) handleShowBranching();
  }, [arrayOptions]);

  useEffect(() => {
    if(!props.formItems) return;
    if(branchingSelection.length > 0) return;
    let tempSelection = branchingSelection;
    let logger = false;
    for(let i=0; i+1<props.formItems.length; i++){
      if (props.formItems[i].itemNumber < props.questionData.itemNumber) continue;
      let tempLabel = "";
      if(!logger) {
        tempLabel = "Continue to next question";
        logger = true;
      } else {
        if(i+2 > props.formItems.length) break;
        tempLabel = `Jump to Question No.${i+2}`;
      }
      tempSelection.push({ value: props.formItems[i+1].itemNumber, label: tempLabel});
    }
    setBranchingSelection(tempSelection);
  }, [branchingSelection]);

  useEffect(() => {
    if(props.questionData) resetBranchingSelection();
  }, [props.formItems]);

  useEffect(() => {
    if(!questionType) return;
    if (questionType != "" && selectedQuestionOption != questionType) { 
      setSelectedQuestionOption(questionType);
    } else if(selectedQuestionOption != questionType){
      setSelectedQuestionOption("MC");
    }
    setTimeout(() => props.handleUpdatedList(props.questionIdx, true), 1000)
  }, [questionType]);

  // useEffect(() => {
  //   console.log(intervalObj);
  // }, [intervalObj]);


  const handleStyling = () => {
    let elem = document.getElementById("question-" + props.questionData.id);
    elem.style.border = "3px solid red";
    let blockerElem = document.getElementById("blocker-" + props.questionData.id);
    blockerElem.style.display = "flex";
    setTimeout(() => {
      elem.style.border = "";
      blockerElem.style.display = "none";
    }, 10000);
  }

  const handleInterval = () => {
    let interval = setInterval(() => {
      let validator = false;
      setIsUsed(isUsed => {
        if(isUsed) validator = true;
        return isUsed;
      });
      if(validator) return;
      updateQuestion();
      getAnswerSelection();
    }, 1000);
    setIntervalObj(intervalObj => {
      let currentInterval = intervalObj
      currentInterval.push(interval);
      return currentInterval;
    });
  }

  const getAnswerSelection = () => {
    if(!props.questionData) return;
    axios({
      method: "get",
      url: `${BASE_URL}/api/v1/forms/get-answer-selection/${props.questionData.id}`,
    }).then((res) => {
      handleOptionList(props.questionData.id, res.data);
    });
  }

  useEffect(() => {
    if(questionContent) {
      let questionContentTextarea = document.getElementById("question-input-" + props.questionData.id);
      questionContentTextarea.value = "";
      questionContentTextarea.value = questionContent;
      questionContentTextarea.style.height = "25px";
      autoResizeContent(questionContentTextarea);
    }
  }, [questionContent]);

  const removeInterval = () => {
    setIntervalObj(intervalObj => {
      intervalObj.map((value) => clearInterval(value));
      return [];
    });
  }

  const resetBranchingSelection = () => {
    if(branchingSelection && branchingSelection.length > 0) prevBranchSelection.current = branchingSelection;
    setBranchingSelection([]);
  }

  const autoResizeContent = (el) => {
    el.style.height = "15px";
    el.style.height = (el.scrollHeight)+"px";
  }

  const updateQuestion = () => {
    if(!props.questionData) return;
    axios({
      method: "get",
      url: `${BASE_URL}/api/v1/forms/get-a-form-item/${props.questionData.id}`,
    }).then((res) => {
      setQuestionContent(questionContent => {
        let content = res.data.content;
        if(content != questionContent){
          handleStyling();
          return content;
        } 
        return questionContent;
      });
      setQuestionType(questionType => {
        let type = res.data.type;
        if(questionType != type){
          setSelectedQuestionOption(type);
          return type;
        }
        return questionType;
      });
    });
  }

  const handleShowBranching = () => {
    setBranchingState(!branchingState);
  }

  const handleIsRequired = () => {
    // boolean -> int
    let value = !selectedIsRequired;
    if(value) value = 1;
    else value = 0;
    handleUpdateQuestionIsRequired(props.questionData.id, value);
    setSelectedIsRequired(!selectedIsRequired);
    props.handleUpdateLastEdited();
  }

  const handleAddOption = async (id, iterCount, finalCount) => {
    let obj = {};
    obj["formItemsId"] = id;
    obj["value"] = "";
    if(finalCount != null && finalCount == iterCount) return;
    if(!finalCount) {
      iterCount = 0;
      finalCount = 1;
    }
    while(finalCount && iterCount < finalCount) {
      await axios({
        method: "post",
        url: `${BASE_URL}/api/v1/forms/add-answer-selection/${id}`,
        data: obj,
        headers: { "Content-Type": "application/json" },
      });
      iterCount = iterCount + 1;
    }
    props.handleUpdateLastEdited();
  };

  const handleRemoveOption = (optionId) => {
    if(arrayOptions.length <= 1) return;
    axios({
      method: "delete",
      url: `${BASE_URL}/api/v1/forms/remove-answer-selection/${optionId}`,
    }).then((res) => {
      props.handleUpdateLastEdited();
    });
  };

  const handleResetOption = (id) => {
    try {
      axios({
        method: "delete",
        url: `${BASE_URL}/api/v1/forms/remove-all-answer-selection/${id}`,
      }).then(() => {
        handleOptionList(id, []);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleOptionList = (id, data) => {
    setArrayOptions(arrayOptions => {
      if(data.length == 0){
        handleAddOption(id, null, null);
      } else {
        if(arrayOptions.length == 0 || data.length != arrayOptions.length) return data;
      }
      return arrayOptions;
    });
  };

  const handleUpdateQuestionInput = (event) => {
    let currentForm = props.questionData;
    currentForm["questionContent"] = event.target.value;
    try {
      axios({
        method: "put",
        url: `${BASE_URL}/api/v1/forms/update-form-items/${props.questionData.id}`,
        data: currentForm,
        headers: { "Content-Type": "application/json" },
      }).then(() => {
        props.handleUpdateLastEdited();
      });
    } catch (error) {
      console.log(error);
    }
    setQuestionContent((content) => {
      console.log("content", event.target.value);
      return event.target.value;
    })
  };

  const handleUpdateQuestionType = (event) => {
    let currentForm = props.questionData;
    currentForm["questionType"] = event.value;
    try {
      axios({
        method: "put",
        url: `${BASE_URL}/api/v1/forms/update-form-items/${props.questionData.id}`,
        data: currentForm,
        headers: { "Content-Type": "application/json" },
      }).then(() => {
        props.handleUpdateLastEdited();
      });
    } catch (error) {
      console.log(error);
    }
    setQuestionType((type) => {
      return event.value;
    })
  };

  const handleUpdateQuestionIsRequired = (value) => {
    let currentForm = props.questionData;
    currentForm["isRequired"] = value;
    try {
      axios({
        method: "put",
        data: currentForm,
        url: `${BASE_URL}/api/v1/forms/update-form-items/${props.questionData.id}`,
        headers: { "Content-Type": "application/json" },
      }).then(() => {
        props.handleUpdateLastEdited();
      })
    } catch(error) {
      console.log(error);
    }
  };

  const displayQuestion = () => {
    let textareaId = "question-input-" + props.questionData.id;
    let elem = document.getElementById("question-" + props.questionData.id);
    return (
      <React.Fragment>
        <div className="question-area">
          <div id={"blocker-" + props.questionData.id} className="blocker">Currently editing</div>
          <div id="question-title-font">
            <AutoHeightTextarea
              className="question-input"
              id={textareaId}
              name="inputted-question"
              placeholder="Please type your question..."
              rows="14"
              cols="5"
              wrap="soft"
              onChange={(e) => {
                handleUpdateQuestionInput(e);
              }}
            />
            <div id="border"></div>
            <br />
            <div className="char-counter">
              <span style={props.questionData && questionContent && questionContent.length <= 255 ? {color: "gray"} : {color: "red"}}>{props.questionData && questionContent? questionContent.length : null}</span>
            </div>
          </div>
          <div id="question-selection">
            <Select
              value={questionOptions.map((option) => {
                if (questionType == "")
                  return questionOptions[0];
                if (option.value == questionType)
                  return option;
              })}
              options={questionOptions}
              id="questionSelection"
              onChange={(e) => {
                if (
                  !(
                    questionType == "MC" && e.value == "CB"
                  ) &&
                  !(questionType == "CB" && e.value == "MC")
                ) {
                  handleResetOption(props.questionData.id);
                }
                handleUpdateQuestionType(e);
              }}
            />
          </div>
        </div>
        <div className="form-item-separator">
          {branchingState ? "Branching options" : null}
        </div>
        {selectedQuestionOption == "MC" && multipleChoiceOption()}
        {selectedQuestionOption == "SA" && shortAnswerOption()}
        {selectedQuestionOption == "CB" && checkBoxOption()}
        {selectedQuestionOption == "LS" && linearScaleOption()}
        <div className="question-padding">
          <div className="question-isOptional-spacer"></div>
          <div className="question-isOptional-container">
            <div className="question-isOptional-icon">
                <i
                  className={selectedIsRequired ? "fa fa-check-circle-o" : "fa fa-circle-o"}
                  onClick={handleIsRequired}
                />
            </div>
            <div className="question-isOptional-text">is Required?</div>
          </div>
          <div
            className="question-settings"
            id="popUpContainer"
            // onClick={}
          >
            <Popup
              trigger={(open) => <i className="fa fa-ellipsis-v"></i>}
              position="right center"
            >
              {/* isi dari popup, konten yg mau dishow */}
              <div className="popup-wrapper">
                {questionType == "MC" ? (
                  <React.Fragment>
                    <div
                      className="popup-content"
                      onClick={() => handleShowBranching()}>
                      {!branchingState ? `Enable branching` : `Disable branching`}
                    </div>
                    <div className="popup-divider"></div>
                  </React.Fragment>
                ) : null}
                <div
                  className="popup-content"
                  onClick={() => {
                    props.onRemove(props.questionData.id);
                  }}
                >
                  Remove Card
                </div>
              </div>
            </Popup>
          </div>
        </div>
      </React.Fragment>
    );
  };

  const multipleChoiceOption = () => {
    return (
      <React.Fragment key={uuid()}>
        <div id="answer-selection-container">
          {arrayOptions && arrayOptions.length > 0
            ? arrayOptions.map((obj, idx) => {
                let optionId =
                  "question-" + props.questionData.id + "-options-" + obj.id;
                // this.handleUpdateTextarea(obj);
                return (
                  <React.Fragment key={optionId}>
                    <Option 
                      key={uuid()}
                      idx={idx}
                      optionId={optionId}
                      obj={obj}
                      branchingState={branchingState}
                      branchingSelection={branchingSelection}
                      prevBranchSelection={prevBranchSelection}
                      handleRemoveOption={handleRemoveOption}
                      handleStyling={handleStyling}
                      questionType={questionType}
                      formItems={props.formItems}
                      arrayOptions={arrayOptions}
                      handleUpdateLastEdited={props.handleUpdateLastEdited}
                    />
                  </React.Fragment>
                );
              })
            : null}
          <div className="answer-selection">
            {displayNewOptionMultipleChoice()}
          </div>
        </div>
      </React.Fragment>
    );
  };

  const displayNewOptionMultipleChoice = () => {
    return (
      <React.Fragment key={uuid()}>
        <input type="radio" className="answerSelection" disabled />
        <input
          className="inputText"
          type="text"
          placeholder="Add new option..."
          wrap="soft"
          readOnly
          onClick={() => {
            handleAddOption(props.questionData.id, null, null);
          }}
        />
      </React.Fragment>
    );
  };

  const checkBoxOption = () => {
    // console.log(uuid());
    return (
      <React.Fragment key={uuid()}>
        <div id="answer-selection-container">
          {/* nilai true untuk pertama kali */}
          {arrayOptions
            ? arrayOptions.map((obj, idx) => {
                let optionId =
                  "question-" + props.questionData.id + "-options-" + obj.id;
                return (
                  <Option 
                    key={uuid()}
                    idx={idx}
                    optionId={optionId}
                    obj={obj}
                    handleRemoveOption={handleRemoveOption}
                    handleStyling={handleStyling}
                    questionType={questionType}
                    arrayOptions={arrayOptions}
                    handleUpdateLastEdited={props.handleUpdateLastEdited}
                  />
                );
              })
            : null}
          <div className="answer-selection">{displayNewOptionCheckbox()}</div>
        </div>
      </React.Fragment>
    );
  };

  const displayNewOptionCheckbox = () => {
    return (
      <React.Fragment>
        <input type="checkbox" className="answerSelection" disabled />
        <input
          className="inputText"
          type="text"
          placeholder="Add new option..."
          wrap="soft"
          readOnly
          onClick={() => {
            handleAddOption(props.questionData.id, null, null);
          }}
        />
      </React.Fragment>
    );
  };

  const linearScaleOption = () => {
    return (
      <React.Fragment key={uuid()}>
        <div className="linear-container">
          <div className="linear-input-container">
            <div className="linear-title" id="linear-title-input">
              Input
            </div>
            <div id="linear-input-box">
              <Select
                options={inputOptions}
                value={
                  inputOptions.map((opt) => {
                    if(opt.value == arrayOptions.length) return opt;
                  }
                )}
                placeholder="Select"
                id="questionSelection"
                onChange={(e) => {
                  let prevValue = arrayOptions.length;
                  let nextValue = e.value;
                  let difference = nextValue - prevValue;
                  if(difference > 0) handleAddOption(props.questionData.id, 0, difference);
                  else {
                    let newLength = (difference + prevValue) - 1;
                    arrayOptions.map((opt, idx) => {
                      if(idx <= newLength) return;
                      handleRemoveOption(opt.id);
                    })
                  }
                }}
              />
            </div>
          </div>
          <br />
          <div className="linear-label-container">
            <div className="linear-title" id="linear-title-label">
              Label
            </div>
            <div className="linear-label-loop">
              {arrayOptions.map((obj, idx) => {
                let optionId =
                  "question-" + props.questionData.id + "-options-" + obj.id;
                return (
                  <Option 
                    key={uuid()}
                    idx={idx}
                    optionId={optionId}
                    obj={obj}
                    questionType={questionType}
                    arrayOptions={arrayOptions}
                    labelOptions={inputOptions}
                    handleStyling={handleStyling}
                    handleUpdateLastEdited={props.handleUpdateLastEdited}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  };

  const shortAnswerOption = () => {
    return (
      <div id="shortanswer-container" key={uuid()}>
        <input
          type="text"
          className="inputText"
          name="shortanswer-field"
          placeholder="The answer will be on here..."
          disabled
        />
      </div>
    );
  };

  const displayAdd = () => {
    return (
      <React.Fragment>
        <div className="addNewItem">
          <div id="btn-addItem">+</div>
          <div id="btn-addItem2">Add Question</div>
        </div>
        <div className="addquestion-padding"></div>
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      {props.mode ? displayQuestion() : displayAdd()}
    </React.Fragment>
  );
}

export default Question;