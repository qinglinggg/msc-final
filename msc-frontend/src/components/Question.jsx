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
      setQuestionContent(props.questionData.questionContent);
      setQuestionType(props.questionData.questionType);
      handleInterval();
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
      console.log(currentData);
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

  useEffect(() => {
    console.log(intervalObj);
  }, [intervalObj]);

  const handleInterval = () => {
    let interval = setInterval(() => {
      updateQuestion();
      getAnswerSelection();
    }, 500);
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
      // console.log("Test", res.data);
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
          // console.log("content refresh", content != questionContent);
          if(content != questionContent){
            props.handleUpdateLastEdited();
            return content;
          } 
          return questionContent;
        });
        setQuestionType(questionType => {
          let type = res.data.type;
          // console.log("type refresh", type != questionType);
          if(questionType != type){
            props.handleUpdateLastEdited();
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
    props.handleUpdateQuestionIsRequired(props.questionData.id, value);
    setSelectedIsRequired(!selectedIsRequired);
    props.handleUpdateLastEdited();
  }

  const handleAddOption = async (id, iterCount, finalCount) => {
    let obj = {};
    obj["formItemsId"] = id;
    obj["value"] = "";
    if(!finalCount) {
      iterCount = 0;
      finalCount = 1;
    }
    while(finalCount && iterCount < finalCount) {
      console.log("test");
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
    axios({
      method: "delete",
      url: `${BASE_URL}/api/v1/forms/remove-answer-selection/${optionId}`,
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
      if(data.length == 0 && props.questionData.questionType != "LS"){
        handleAddOption(id, null, null);
      } else {
        if(arrayOptions.length == 0 || data.length != arrayOptions.length) return data;
      }
      return arrayOptions;
    });
  };

  const displayQuestion = () => {
    let textareaId = "question-input-" + props.questionData.id;
    return (
      <React.Fragment>
        <div className="question-area">
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
                props.handleUpdateQuestionInput(props.questionData.id, e);
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
                console.log("onchangee");
                props.handleUpdateQuestionType(props.questionData.id, e);
                setSelectedQuestionOption(e.value);
                setQuestionType(e.value);
                props.handleUpdateLastEdited();
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
                      questionData={props.questionData}
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
                    questionData={props.questionData}
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
                value={inputOptions.map((opt) => {
                  if(opt.value == arrayOptions.length) return opt;
                })}
                placeholder="Select"
                id="questionSelection"
                onChange={(e) => {
                  handleResetOption(props.questionData.id);
                  handleAddOption(props.questionData.id, 0, e.value);
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
                    questionData={props.questionData}
                    arrayOptions={arrayOptions}
                    labelOptions={inputOptions}
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
