import React, { Component } from "react";
import Select from "react-select";
import AutoHeightTextarea from "./functional-components/AutoheightTextarea";
import Popup from "reactjs-popup";
import axios from "axios";
import { useState, useEffect, useRef } from "react";

const BASE_URL = "http://10.61.38.193:8080";

function Question(props) {
  const [selectedQuestionOption, setSelectedQuestionOption] = useState("");
  const [selectedInputOption, setSelectedInputOption] = useState(2);
  const [selectedIsRequired, setSelectedIsRequired] = useState(false);
  const [branchingState, setBranchingState] = useState(false);
  const [branchingSelection, setBranchingSelection] = useState([]);
  const prevBranchSelection = useRef();

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
    el.style.height = "25px";
    el.style.height = (el.scrollHeight)+"px";
    console.log("Auto Scroll height: " + el.scrollHeight);
  }

  useEffect(() => {
    if(props.questionData) {
      let questionContent = document.getElementById("question-input-" + props.questionData.id);
      questionContent.value = "";
      if(props.questionData.questionContent) questionContent.value = props.questionData.questionContent;
    }
    if (props.mode) {
      if (props.questionData.questionType != "") {
        setSelectedQuestionOption(props.questionData.questionType);
      } else {
        setSelectedQuestionOption("MC");
      }
      axios({
        method: "get",
        url: `${BASE_URL}/api/v1/forms/get-answer-selection/${props.questionData.id}`,
      }).then((res) => {
        props.handleOptionList(props.questionData.id, res.data);
      });
    }
  }, []);

  useEffect(() => {
    let stateLogger = JSON.parse(localStorage.getItem("stateLoggerQuestion"));
    if(props.questionData && !stateLogger) {
      let questionContent = document.getElementById("question-input-" + props.questionData.id);
      questionContent.value = "";
      if(props.questionData.questionContent) {
        questionContent.value = props.questionData.questionContent;
        questionContent.style.minHeight = "15px";
        autoResizeContent(questionContent);
        localStorage.setItem("stateLoggerQuestion", true);
      }
    }
  }, [props.questionData]);

  useEffect(() => {
    let stateLogger = JSON.parse(localStorage.getItem("stateLoggerAnswer"));
    if(props.arrayOptions && !stateLogger) {
      props.arrayOptions.map((obj) => {
        let optionId =
        "question-" + props.questionData.id + "-options-" + obj.id;
        let el = document.getElementById(optionId);
        el.value = obj.value;
        console.log(obj.value);
        autoResizeContent(el);
        localStorage.setItem("stateLoggerAnswer", true);
      })
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

  // useEffect((prevState) => {
  //   if(prevState.selectedIsRequired != selectedIsRequired){
  //     let value;
  //     if(selectedIsRequired) value = 1;
  //     else value = 0;
  //     props.handleUpdateQuestionIsRequired(props.questionData.id, value);
  //   }
  // }, [selectedIsRequired]);

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
                <div
                  className="popup-content"
                  onClick={() => handleShowBranching()}>
                  {!branchingState ? `Enable branching` : `Disable branching`}
                </div>
                <div className="popup-divider"></div>
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
            ? props.arrayOptions.map((obj) => {
                let optionId =
                  "question-" + props.questionData.id + "-options-" + obj.id;
                // this.handleUpdateTextarea(obj);
                return (
                  <React.Fragment>
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
            ? props.arrayOptions.map((obj) => {
                let optionId =
                  "question-" + props.questionData.id + "-options-" + obj.id;
                return (
                  <div className="answer-selection">
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
                        props.handleOptionValue(props.questionData.id, e, obj);
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
    let labelIdx = 0;
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
                  // inputOptions[0].value
                }
                defaultValue={inputOptions[0]}
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
              {props.questionData.arrayOptions.map((object) => {
                let optionId =
                  "question-" + props.questionData.id + "-options-" + object.id;
                labelIdx = labelIdx + 1;
                return (
                  <div className="linear-label-row">
                    <div className="linear-label-userinput">
                      <AutoHeightTextarea
                        key={optionId}
                        id={optionId}
                        className="inputText"
                        type="text"
                        placeholder="Insert label..."
                        wrap="soft"
                        onChange={(e) => {
                          props.handleOptionValue(
                            props.questionData.id,
                            e,
                            object
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
                            ? labelOptions[labelIdx-1].label
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
