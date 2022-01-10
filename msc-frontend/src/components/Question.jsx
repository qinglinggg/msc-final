import React, { Component } from "react";
import Select from "react-select";
import AutoHeightTextarea from "./functional-components/AutoheightTextarea";
import Popup from "reactjs-popup";

class Question extends React.Component {
  constructor(props) {
    super(props);
    // this.handleRemoveQuestion = this.handleRemoveQuestion.bind(this);
  }

  state = {
    selectedQuestionOption: "MC",
    selectedInputOption: 2,
    selectedIsOptional: false,

    // multiple choice & checkbox
    optionCounter: 0,
    arrayOptions: [],
  };

  questionOptions = [
    { value: "MC", label: "Multiple choice" },
    { value: "SA", label: "Short answer" },
    { value: "CB", label: "Checkbox" },
    { value: "LS", label: "Linear scale" },
  ];

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
    // this.arrayOptions = [];
    // for (let i = 1; i < this.state.optionCounter; i++) {
    //   let obj = [];
    //   obj["id"] = i;
    //   obj["label"] = "Option " + i;
    //   this.arrayOptions.push(obj);
    //   console.log(this.arrayOptions);
    //   // this.arrayOptions.push("Option " + i);
    // }
    let textareaId = "question-input-" + this.props.id;
    return (
      <React.Fragment>
        <div className="question-area">
          <div id="question-title-font">
            <AutoHeightTextarea
              className="question-input"
              id={textareaId}
              name="inputted-question"
              placeholder="Please type your question..."
              multiline={true}
              rows="14"
              cols="10"
              wrap="soft"
              onKeyUp={(event) => {
                this.props.QuestionContent(
                  this.props.id,
                  event.target.value,
                  true,
                  false
                );
                // console.log(event.target.value);
              }}
            />
            <div id="border"></div>
            <br />
          </div>
          <div id="question-selection">
            <Select
              value={this.questionOptions.value}
              options={this.questionOptions}
              defaultValue={this.questionOptions[0]}
              id="questionSelection"
              onChange={(data) => this.handleQuestionTypeChange(data)}
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
                    console.log("on the way to remove id: " + this.props.id);
                    this.props.onRemove(this.props.id);
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

  handleQuestionTypeChange(data) {
    this.setState({ selectedQuestionOption: data.value });
    this.props.QuestionType(this.props.id, data.value, false, true);
  }

  handleInputChange(data) {
    this.setState({ selectedInputOption: data.value });
  }

  // handleRemoveQuestion() {
  //   this.props.onRemove = true;
  // }

  handleAddOption() {
    this.setState({ optionCounter: this.state.optionCounter + 1 }, () => {
      let obj = [];
      obj["id"] = this.state.optionCounter;
      obj["label"] = "Option " + this.state.optionCounter;
      obj["value"] = "";
      // this.arrayOptions.push(obj);
      this.setState({ arrayOptions: [...this.state.arrayOptions, obj] }, () => {
        console.log(this.state.arrayOptions);
        this.state.arrayOptions.map((obj) => {
          this.handleUpdateTextarea(obj);
        });
      });
    });
  }

  handleRemoveOption(id) {
    console.log("Enter remove option...");
    let deletedId = id;
    this.setState(
      {
        arrayOptions: this.state.arrayOptions.filter((element) => {
          return element.id != deletedId;
        }),
      },
      () => {
        console.log(this.state.arrayOptions);
        this.state.arrayOptions.map((obj) => {
          this.handleUpdateTextarea(obj);
        });
      }
    );
    // this.setState({ optionCounter: this.state.optionCounter - 1 });
  }

  handleOptionValue(event, object) {
    // console.log("Changing option value...");
    let idx = this.state.arrayOptions.indexOf(object);
    // console.log("the index is " + idx);
    let changedArrayValue = this.state.arrayOptions;
    changedArrayValue[idx].value = event.target.value;
    console.log(changedArrayValue);
    this.setState({ arrayOptions: changedArrayValue }, () => {
      this.state.arrayOptions.map((obj) => {
        this.handleUpdateTextarea(obj);
      });
    });
    // event.target.value = "";
  }

  handleUpdateTextarea(obj) {
    // this.state.arrayOptions.map((obj) => {
    let optionId = "dashboard-options-" + obj.id;
    let textarea = document.getElementById(optionId);
    if (textarea) {
      if (obj.value != "") {
        textarea.value = obj.value;
      } else {
        // console.log("obj.value is null");
        textarea.value = "";
      }
    }
    // });
  }

  multipleChoiceOption() {
    return (
      <React.Fragment>
        <div id="answer-selection-container">
          {this.state.arrayOptions
            ? this.state.arrayOptions.map((obj) => {
                let optionId = "dashboard-options-" + obj.id;
                console.log(obj);
                // if (obj.value != undefined) this.handleUpdateTextarea();
                this.handleUpdateTextarea(obj);
                // console.log(optionId);
                return (
                  <div className="answer-selection">
                    <input
                      className="answerSelectionRadio"
                      type="radio"
                      disabled
                    />
                    <AutoHeightTextarea
                      className="inputText"
                      id={optionId}
                      type="text"
                      placeholder={obj.label}
                      wrap="soft"
                      onKeyUp={(e) => this.handleOptionValue(e, obj)}
                    />
                    {/* {obj.value
                      ? (document.getElementById({ optionId }).value =
                          obj.value)
                      : null} */}
                    <div
                      className="dashboard-remove-options-button"
                      onClick={() => this.handleRemoveOption(obj.id)}
                    >
                      <i className="fas fa-times"></i>
                    </div>
                  </div>
                );
              })
            : null}
          <div className="answer-selection">
            {this.displayNewOptionMultipleChoice()}
          </div>
          {/* {console.log(this.arrayOptions)} */}
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
            this.handleAddOption();
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
          {this.state.arrayOptions
            ? this.state.arrayOptions.map((obj) => {
                let optionId = "dashboard-options-" + obj.id;
                console.log(obj);
                this.handleUpdateTextarea(obj);
                // if (obj.value != undefined) this.handleUpdateTextarea();
                return (
                  <div className="answer-selection">
                    <input
                      className="answerSelectionRadio"
                      type="radio"
                      disabled
                    />
                    <AutoHeightTextarea
                      className="inputText"
                      id={optionId}
                      type="text"
                      placeholder={obj.label}
                      wrap="soft"
                      onKeyUp={(e) => this.handleOptionValue(e, obj)}
                    />
                    <div
                      className="dashboard-remove-options-button"
                      onClick={() => this.handleRemoveOption(obj.id)}
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
            this.handleAddOption();
          }}
        />
      </React.Fragment>
    );
  }

  linearScaleOption() {
    this.labelOptions = [];
    for (let i = 1; i <= this.state.selectedInputOption; i++) {
      this.labelOptions.push({ value: i, label: i });
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
                value={this.inputOptions.value}
                options={this.inputOptions}
                defaultValue={this.inputOptions[0]}
                id="questionSelection"
                onChange={(data) => this.handleInputChange(data)}
              />
            </div>
          </div>
          <br />
          <div className="linear-label-container">
            <div className="linear-title" id="linear-title-label">
              Label
            </div>
            <div className="linear-label-loop">
              {this.labelOptions.map((object) => {
                return (
                  <div className="linear-label-row">
                    <div className="linear-label-userinput">
                      <AutoHeightTextarea
                        className="inputText"
                        type="text"
                        placeholder="Insert label..."
                        wrap="soft"
                      />
                    </div>
                    <div id="linear-label-select">
                      <div id="linear-label-select-box">
                        <div id="linear-label-select-value">{object.label}</div>
                      </div>
                      {/* <Select
                        value={this.labelOptions.value}
                        options={this.labelOptions}
                        defaultValue={this.labelOptions[0]}
                        id="questionSelection"
                      /> */}
                    </div>
                  </div>
                );
              })}
              {/* {this.displayNewOptionLinearLabel()} */}
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
              onClick={(event) => {
                let count = this.state.optionCounter + 1;
                if (count > this.state.selectedInputOption)
                  count = this.state.selectedInputOption;
                this.setState({ optionCounter: count });
              }}
            />
          </div>
          <div id="linear-label-select">
            {/* <Select
              value={this.labelOptions.value}
              options={this.labelOptions}
              defaultValue={this.labelOptions[0]}
              id="questionSelection"
              // onChange={(data) => this.handleInputChange(data)}
            /> */}
          </div>
        </div>
      </React.Fragment>
    );
  }

  shortAnswerOption() {
    return (
      <div id="shortanswer-container">
        <input
          type="text"
          className="inputText"
          name="shortanswer-field"
          placeholder="Input your answer..."
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
