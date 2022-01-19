import React, { Component } from "react";
import Select from "react-select";
import AutoHeightTextarea from "./functional-components/AutoheightTextarea";
import Popup from "reactjs-popup";

class Question extends React.Component {
  constructor(props) {
    super(props);
    this.displayQuestion = this.displayQuestion.bind(this);
  }

  state = {
    selectedQuestionOption: "",
    selectedInputOption: 2,
    selectedIsOptional: false
  };

  questionOptions = [
    { value: "MC", label: "Multiple choice" },
    { value: "SA", label: "Short answer" },
    { value: "CB", label: "Checkbox" },
    { value: "LS", label: "Linear scale" },
  ];

  componentDidMount() {
    if (this.props.questionData) {
      if(this.props.questionData.questionType != ""){
        console.log("in 1");
        this.setState({ selectedQuestionOption : this.props.questionData.questionType });
      } else {
        console.log("in 2");
        this.setState({ selectedQuestionOption : "MC" });
      }
    }
    console.log(this.state);
  }

  // linear scale

  inputOptions = [
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

  labelOptions = [];

  render() {
    return (
      <React.Fragment>
        {this.props.mode ? this.displayQuestion() : this.displayAdd()}
      </React.Fragment>
    );
  }

  displayQuestion() {
    let textareaId = "question-input-" + this.props.questionData.id;
    return (
      <React.Fragment>
        <div className="question-area">
          <div id="question-title-font">
            <AutoHeightTextarea
              className="question-input"
              id={textareaId}
              value={this.props.questionData.question}
              name="inputted-question"
              placeholder="Please type your question..."
              rows="14"
              cols="10"
              wrap="soft"
              onChange={(e) => {this.props.handleUpdateQuestionInput(this.props.questionData.id, e);}}
            />
            <div id="border"></div>
            <br />
          </div>
          <div id="question-selection">
            <Select
              value={this.questionOptions.map(option => {
                  if(this.props.questionData.questionType == "") return this.questionOptions[0];
                  if (option.value == this.props.questionData.questionType) return option;
                }  
              )}
              options={this.questionOptions}
              id="questionSelection"
              defaultValue={this.questionOptions[0]}
              onChange={(e) => {
                this.props.handleResetOption(this.props.questionData.id)
                this.props.handleUpdateQuestionType(this.props.questionData.id, e);
                this.setState({selectedQuestionOption : this.props.questionData.questionType});
              }}
            />
          </div>
        </div>
        {this.state.selectedQuestionOption == "MC" &&
          this.multipleChoiceOption()}
        {this.state.selectedQuestionOption == "SA" && this.shortAnswerOption()}
        {this.state.selectedQuestionOption == "CB" && this.checkBoxOption()}
        {this.state.selectedQuestionOption == "LS" && this.linearScaleOption()}
        <div className="question-padding">
          <div className="question-isOptional-spacer"></div>
          <div className="question-isOptional-container">
            <div className="question-isOptional-icon">
              {this.state.selectedIsOptional ? (
                <i
                  className="fa fa-check-circle-o"
                  onClick={() => this.setState({ selectedIsOptional: false })}
                />
              ) : (
                <i
                  className="fa fa-circle-o"
                  onClick={() => this.setState({ selectedIsOptional: true })}
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
                <div className="popup-content">Question Settings</div>
                <div className="popup-divider"></div>
                <div
                  className="popup-content"
                  onClick={() => {
                    this.props.onRemove(this.props.questionData.id);
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
  }

  handleUpdateTextarea(obj) {
    let optionId = "question-" + this.props.questionData.id + "-options-" + obj.id;
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
  }

  multipleChoiceOption() {
    return (
      <React.Fragment>
        <div id="answer-selection-container">
          {
            this.props.arrayOptions
              ? this.props.arrayOptions.map((obj) => {
                  let optionId =
                    "question-" + this.props.questionData.id + "-options-" + obj.id;
                  // this.handleUpdateTextarea(obj);
                  return (
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
                          this.props.handleOptionValue(this.props.questionData.id, e, obj);
                        }}
                      />
                      <div
                        className="dashboard-remove-options-button"
                        onClick={() => {
                          this.props.handleRemoveOption(this.props.questionData.id, obj.id, obj);
                        }}
                      >
                        <i className="fas fa-times"></i>
                      </div>
                    </div>
                  );
                })
              : null
          }
          <div className="answer-selection">
            {this.displayNewOptionMultipleChoice()}
          </div>
        </div>
      </React.Fragment>
    );
  }

  displayNewOptionMultipleChoice() {
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
            this.props.handleAddOption(this.props.questionData.id);
          }}
        />
      </React.Fragment>
    );
  }

  checkBoxOption() {
    return (
      <React.Fragment>
        <div id="answer-selection-container">
          {/* nilai true untuk pertama kali */}
          {this.props.arrayOptions
            ? this.props.arrayOptions.map((obj) => {
                let optionId =
                  "question-" + this.props.questionData.id + "-options-" + obj.id;
                console.log(obj);
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
                        this.props.handleOptionValue(this.props.questionData.id, e, obj);
                      }}
                    />
                    <div
                      className="dashboard-remove-options-button"
                      onClick={() => {
                        this.props.handleRemoveOption(this.props.questionData.id, obj.id, obj);
                      }}
                    >
                      <i className="fas fa-times"></i>
                    </div>
                  </div>
                );
              })
            : null}
          <div className="answer-selection">
            {this.displayNewOptionCheckbox()}
          </div>
        </div>
      </React.Fragment>
    );
  }

  displayNewOptionCheckbox() {
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
            this.props.handleAddOption(this.props.questionData.id);
          }}
        />
      </React.Fragment>
    );
  }

  linearScaleOption() {
    this.labelOptions = [];
    for (let i = 0; i <= this.props.questionData.optionCounter; i++) {
      this.labelOptions.push({value: i, label: i});
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
                options={this.inputOptions}
                value={this.labelOptions.map(option => {
                  if(this.props.questionData.optionCounter == option.value){
                    return option;
                  }})
                }
                defaultValue={this.inputOptions[0]}
                id="questionSelection"
                onChange={(e) => {
                  this.props.handleOptionCount(this.props.questionData.id, e);
                  this.props.handleResetOption(this.props.questionData.id);
                  for(let i=0; i < e.value; i++){
                    this.props.handleAddOption(this.props.questionData.id);
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
              {this.props.questionData.arrayOptions.map((object) => {
                let optionId = "question-" + this.props.questionData.id + "-options-" + object.id;
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
                          this.props.handleOptionValue(this.props.questionData.id, e, object);
                        }}
                      />
                    </div>
                    <div id="linear-label-select">
                      <div id="linear-label-select-box">
                        <div id="linear-label-select-value">{(this.labelOptions.length > 0) ? this.labelOptions[object.id].label : null}</div>
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
  }

  displayNewOptionLinearLabel() {
    return (
      <React.Fragment>
        <div className="linear-label-row">
          <div className="linear-label-userinput">
            <AutoHeightTextarea
              className="inputText"
              type="text"
              placeholder="Insert label..."
              wrap="soft"
              onClick={(e) => {
                this.props.handleAddOption(this.props.questionData.id)
              }}
            />
          </div>
          <div id="linear-label-select">
          </div>
        </div>
      </React.Fragment>
    );
  }

  shortAnswerOption() {
    if(this.props.questionData.arrayOptions.length == 0) this.props.handleAddOption(this.props.questionData.id);
    return (
      <div id="shortanswer-container">
        <input
          type="text"
          className="inputText"
          name="shortanswer-field"
          placeholder="Input your answer..."
          value={this.props.questionData.arrayOptions[0].value}
          onChange={(e) => this.props.handleOptionValue(this.props.questionData.id, e, {"id" : 1})}
        />
      </div>
    );
  }

  displayAdd() {
    return (
      <React.Fragment>
        <div className="addNewItem">
          <div id="btn-addItem">+</div>
          <div id="btn-addItem2">Add Question</div>
        </div>
        <div className="addquestion-padding"></div>
      </React.Fragment>
    );
  }
}

export default Question;
