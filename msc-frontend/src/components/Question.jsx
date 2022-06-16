import React, { Component } from "react";
import Select from "react-select";
import AutoHeightTextarea from "./functional-components/AutoheightTextarea";
import Popup from "reactjs-popup";
import axios from "axios";
import { useState, useEffect, useRef } from "react";

const BASE_URL = "http://10.61.38.193:8080";

function Question(props) {
  const [selectedQuestionOption, setSelectedQuestionOption] = useState("");
  const [selectedIsRequired, setSelectedIsRequired] = useState(false);
  const [branchingState, setBranchingState] = useState(false);
  const [branchingSelection, setBranchingSelection] = useState([]);
  const prevBranchSelection = useRef();
  const [intervalId, setIntervalId] = useState(0);
  const [questionContent, setQuestionContent] = useState("");

  const resetBranchingSelection = () => {
    if(branchingSelection.length > 0) prevBranchSelection.current = branchingSelection;
    setBranchingSelection([]);
  }

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
    let branch_check = false;
    for(let x=0; x<props.questionData.arrayOptions.length; x++){
      let currentData = props.questionData.arrayOptions[x];
      if (currentData.nextItem != -1) branch_check = true;
    }
    if (branch_check && !branchingState) handleShowBranching();
  }, [branchingSelection]);

  useEffect(() => {
    if(props.questionData) resetBranchingSelection();
  }, [props.formItems]);

  const questionOptions = [
    { value: "MC", label: "Multiple choice" },
    { value: "SA", label: "Short answer" },
    { value: "CB", label: "Checkbox" },
    { value: "LS", label: "Linear scale" },
  ];

  const inputOptions = [
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

  const autoResizeContent = (el) => {
    el.style.height = "15px";
    el.style.height = (el.scrollHeight)+"px";
  }

  useEffect(() => {
    if(props.questionData) {
      let questionContentTextarea = document.getElementById("question-input-" + props.questionData.id);
      questionContentTextarea.value = "";
      if(questionContent) questionContentTextarea.value = questionContent;
      if(props.questionData.isRequired){
        if(props.questionData.isRequired == 1) setSelectedIsRequired(true);
        else setSelectedIsRequired(false);
      }
    }
    if (props.mode) {
      if (props.questionData.questionType != "") {
        setSelectedQuestionOption(props.questionData.questionType);
      } else {
        setSelectedQuestionOption("MC");
      }
      getAnswerSelection();
      let interval = setInterval(() => {
        updateQuestionContent();
      }, 250);
      setIntervalId(interval);
    }

    return (() => {
      clearInterval(intervalId);
    })
  }, []);

  const getAnswerSelection = () => {
    axios({
      method: "get",
      url: `${BASE_URL}/api/v1/forms/get-answer-selection/${props.questionData.id}`,
    }).then((res) => {
      props.handleOptionList(props.questionData.id, res.data);
    });
  }

  useEffect(() => {
    if(questionContent) {
      let questionContentTextarea = document.getElementById("question-input-" + props.questionData.id);
      questionContentTextarea.value = "";
      if(questionContent) {
        questionContentTextarea.value = questionContent;
        questionContentTextarea.style.height = "25px";
        autoResizeContent(questionContentTextarea);
      }
    }
  }, [questionContent]);

  useEffect(() => {
    if(!props.arrayOptions) return;
    if(props.arrayOptions.length > 0) {
      props.arrayOptions.map((obj) => {
        let optionId =
        "question-" + props.questionData.id + "-options-" + obj.id;
        let el = document.getElementById(optionId);
        if(el){
          if (props.questionData.questionType != "LS") el.value = obj.value;
          else el.value = obj.label;
          autoResizeContent(el);
        }
      });
    }
  }, [props.arrayOptions])

  useEffect(() => {
    if(!prevBranchSelection.current) return;
    if (branchingState && prevBranchSelection.current.length > 0 && props.mode) {
      props.questionData.arrayOptions.forEach(obj => {
        props.handleOptionValue(props.questionData.id, -1, obj, true);
      });
    }
  }, [branchingState]);

  const updateQuestionContent = () => {
    axios({
      method: "get",
      url: `${BASE_URL}/api/v1/forms/get-a-form-item/${props.questionData.id}`,
    }).then((res) => {
      let content = res.data.content;
      if(questionContent != content) setQuestionContent(content);
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
  }

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
              <span style={props.questionData && questionContent.length <= 255 ? {color: "gray"} : {color: "red"}}>{props.questionData ? questionContent.length : null}</span>
            </div>
          </div>
          <div id="question-selection">
            <Select
              value={questionOptions.map((option) => {
                if (props.questionData.questionType == "")
                  return questionOptions[0];
                if (option.value == props.questionData.questionType)
                  return option;
              })}
              options={questionOptions}
              id="questionSelection"
              defaultValue={questionOptions[0]}
              onChange={(e) => {
                if (
                  !(
                    props.questionData.questionType == "MC" && e.value == "CB"
                  ) &&
                  !(props.questionData.questionType == "CB" && e.value == "MC")
                ) {
                  props.handleResetOption(props.questionData.id);
                }
                props.handleUpdateQuestionType(props.questionData.id, e);
                setSelectedQuestionOption(props.questionData.questionType);
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
                {props.questionData.questionType == "MC" ? (
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
      <React.Fragment>
        <div id="answer-selection-container">
          {props.arrayOptions
            ? props.arrayOptions.map((obj, idx) => {
                let optionId =
                  "question-" + props.questionData.id + "-options-" + obj.id;
                // this.handleUpdateTextarea(obj);
                return (
                  <React.Fragment key={"mc-" + idx}>
                    <div className="answer-selection">
                      <input
                        className="answerSelection"
                        type="radio"
                        disabled
                      />
                      <AutoHeightTextarea
                        key={optionId}
                        className="inputText"
                        id={optionId}
                        type="text"
                        placeholder={obj.label}
                        wrap="soft"
                        onChange={(e) => {
                          props.handleOptionValue(
                            props.questionData.id,
                            e, obj, false
                          );
                        }} />
                      {branchingState ? (
                        <Select
                          className="branching-selection"
                          options={branchingSelection}
                          defaultValue={() => {
                            if(obj.nextItem != -1) {
                              let defaultVal = null;
                              let tempBranch = null;
                              if (branchingSelection.length > 0) tempBranch = branchingSelection;
                              else tempBranch = prevBranchSelection.current;
                              if (tempBranch) tempBranch.forEach((sel) => {
                                if(sel.value == obj.nextItem) {
                                  defaultVal = sel;
                                }
                              });
                              return defaultVal;
                            } else {
                              return null;
                            }
                          }}
                          onChange={(e) => {
                            // console.log(e);
                            props.handleOptionValue(
                              props.questionData.id,
                              e, obj, true
                            );
                          }}/>
                      ) : null}
                      <div className="form-item-remove"
                        onClick={() => {
                          props.handleRemoveOption(
                            props.questionData.id,
                            obj.id,
                            obj
                          );
                      }}>
                        <ion-icon name="close-outline"></ion-icon>
                      </div>
                    </div>
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
      <React.Fragment>
        <input type="radio" className="answerSelection" disabled />
        <input
          className="inputText"
          type="text"
          placeholder="Add new option..."
          wrap="soft"
          readOnly
          onClick={() => {
            props.handleAddOption(props.questionData.id, null, null);
          }}
        />
      </React.Fragment>
    );
  };

  const checkBoxOption = () => {
    return (
      <React.Fragment>
        <div id="answer-selection-container">
          {/* nilai true untuk pertama kali */}
          {props.arrayOptions
            ? props.arrayOptions.map((obj, idx) => {
                let optionId =
                  "question-" + props.questionData.id + "-options-" + obj.id;
                return (
                  <div className="answer-selection" key={"cb-" + idx}>
                    <input
                      className="answerSelection"
                      type="checkbox"
                      disabled
                    />
                    <AutoHeightTextarea
                      key={optionId}
                      className="inputText"
                      id={optionId}
                      type="text"
                      placeholder={obj.label}
                      wrap="soft"
                      onChange={(e) => {
                        props.handleOptionValue(props.questionData.id, e, obj, false);
                      }}
                    />
                    <div
                      className="dashboard-remove-options-button"
                      onClick={() => {
                        props.handleRemoveOption(
                          props.questionData.id,
                          obj.id,
                          obj
                        );
                      }}
                    >
                      <i className="fas fa-times"></i>
                    </div>
                  </div>
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
            props.handleAddOption(props.questionData.id, null, null);
          }}
        />
      </React.Fragment>
    );
  };

  const linearScaleOption = () => {
    let labelOptions = [];
    for (let i = 0; i < props.questionData.optionCounter; i++) {
      labelOptions.push({ value: i+1, label: i+1 });
    }
    return (
      <React.Fragment>
        <div className="linear-container">
          <div className="linear-input-container">
            <div className="linear-title" id="linear-title-input">
              Input
            </div>
            <div id="linear-input-box">
              <Select
                options={inputOptions}
                value={
                  labelOptions.map((option) => {
                    if (props.questionData.optionCounter == option.value) {
                      return option;
                    }
                  })
                }
                placeholder="Select inputs..."
                id="questionSelection"
                onChange={(e) => {
                  props.handleResetOption(props.questionData.id, 0, e.value - 1);
                  props.handleOptionCount(props.questionData.id, e.value);
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
              {props.questionData.arrayOptions.map((object, idx) => {
                let optionId =
                  "question-" + props.questionData.id + "-options-" + object.id;
                return (
                  <div className="linear-label-row" key={"ls-" + idx}>
                    <div className="linear-label-userinput">
                      <AutoHeightTextarea
                        key={optionId}
                        id={optionId}
                        className="inputText"
                        type="text"
                        placeholder={object.label}
                        wrap="soft"
                        defaultValue={object.label ? object.label : null}
                        onChange={(e) => {
                          console.log(object);
                          props.handleOptionLabel(
                            props.questionData.id,
                            e,
                            object,
                            idx+1
                          );
                        }}
                      />
                    </div>
                    <div id="linear-label-select">
                      <div id="linear-label-select-box">
                        <div id="linear-label-select-value">
                          {/* {console.log("Current Label IDX:")}
                          {console.log(labelIdx)} */}
                          {labelOptions.length > 0
                            ? labelOptions[idx].value
                            : null}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  };

  // const displayNewOptionLinearLabel = () => {
  //   return (
  //     <React.Fragment>
  //       <div className="linear-label-row">
  //         <div className="linear-label-userinput">
  //           <AutoHeightTextarea
  //             className="inputText"
  //             type="text"
  //             placeholder="Insert label..."
  //             wrap="soft"
  //             onClick={(e) => {
  //               props.handleAddOption(props.questionData.id, null, null);
  //             }}
  //           />
  //         </div>
  //         <div id="linear-label-select"></div>
  //       </div>
  //     </React.Fragment>
  //   );
  // };

  const shortAnswerOption = () => {
    return (
      <div id="shortanswer-container">
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
