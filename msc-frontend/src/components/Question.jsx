import React, { Component } from "react";
import Select from "react-select";
import AutoHeightTextarea from "./functional-components/AutoheightTextarea";
import Popup from "reactjs-popup";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

const BASE_URL = "http://localhost:8080";

function Question(props) {
  const [selectedQuestionOption, setSelectedQuestionOption] = useState("");
  const [selectedInputOption, setSelectedInputOption] = useState(2);
  const [selectedIsOptional, setSelectedIsOptional] = useState(false);
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
  const labelOptions = [];

  useEffect(() => {
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
        res.data.map((data) => {
          props.handleOptionList(props.questionData.id, data);
        });
      });
    }
  }, []);

  const displayQuestion = () => {
    let textareaId = "question-input-" + props.questionData.id;
    return (
      <React.Fragment>
        <div className="question-area">
          <div id="question-title-font">
            <AutoHeightTextarea
              className="question-input"
              id={textareaId}
              value={props.questionData.questionContent}
              name="inputted-question"
              placeholder="Please type your question..."
              rows="14"
              cols="10"
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
                  // console.log("salah");
                }
                props.handleUpdateQuestionType(props.questionData.id, e);
                setSelectedQuestionOption(props.questionData.questionType);
              }}
            />
          </div>
        </div>
        {selectedQuestionOption == "MC" && multipleChoiceOption()}
        {selectedQuestionOption == "SA" && shortAnswerOption()}
        {selectedQuestionOption == "CB" && checkBoxOption()}
        {selectedQuestionOption == "LS" && linearScaleOption()}
        <div className="question-padding">
          <div className="question-isOptional-spacer"></div>
          <div className="question-isOptional-container">
            <div className="question-isOptional-icon">
              {selectedIsOptional ? (
                <i
                  className="fa fa-check-circle-o"
                  onClick={() => setSelectedIsOptional(false)}
                />
              ) : (
                <i
                  className="fa fa-circle-o"
                  onClick={() => setSelectedIsOptional(true)}
                />
              )}
            </div>
            <div className="question-isOptional-text">is Optional?</div>
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
                <div className="popup-content">Enable branching</div>
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

  const handleUpdateTextarea = (obj) => {
    let optionId = "question-" + props.questionData.id + "-options-" + obj.id;
    let textarea = document.getElementById(optionId);
    if (textarea) {
      // console.log(obj);
      if (obj.value != "" && obj.value != null) {
        // console.log("The object has value of " + obj.value);
        textarea.value = obj.value;
      } else {
        textarea.value = "";
      }
    }
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
                        value={obj.value}
                        wrap="soft"
                        onChange={(e) => {
                          props.handleOptionValue(
                            props.questionData.id,
                            e,
                            obj
                          );
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
            props.handleAddOption(props.questionData.id);
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
                      value={obj.value}
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
            props.handleAddOption(props.questionData.id);
          }}
        />
      </React.Fragment>
    );
  };

  const linearScaleOption = () => {
    let labelOptions = [];
    for (let i = 0; i <= props.questionData.optionCounter; i++) {
      labelOptions.push({ value: i, label: i });
    }

    let labelIdx = 0;
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
                  props.handleResetOption(props.questionData.id);
                  props.handleOptionCount(props.questionData.id, e.value);
                  for (let i = 1; i <= e.value; i++) {
                    props.handleAddOption(props.questionData.id);
                  }
                  props.handleUpdateOptionLabel(props.questionData.id, e.value);
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
                        value={object.value}
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
                          {labelOptions.length > 0
                            ? labelOptions[labelIdx].label
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
  //               props.handleAddOption(props.questionData.id);
  //             }}
  //           />
  //         </div>
  //         <div id="linear-label-select"></div>
  //       </div>
  //     </React.Fragment>
  //   );
  // };

  const shortAnswerOption = () => {
    console.log(props.questionData.arrayOptions);
    return (
      <div id="shortanswer-container">
        <input
          type="text"
          className="inputText"
          name="shortanswer-field"
          placeholder="The answer will be on here..."
          // value={
          //   "Input your answer..."
          //   // props.questionData.arrayOptions[0].value
          // }
          // onChange={(e) =>
          //   props.handleOptionValue(props.questionData.id, e, { id: 1 })
          // }
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
