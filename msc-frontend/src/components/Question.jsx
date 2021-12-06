import React, { Component } from "react";
import Select from "react-select";
import AutoHeightTextarea from "./functional-components/AutoheightTextarea";

class Question extends React.Component {
  // constructor() {
  //   super();
  //   this.handleInputChange = this.handleInputChange.bind(this);
  // }

  state = {
    optionCounter: 0,
    selectedQuestionOption: "DEFAULT",
    selectedInputOption: 2,
    // inputtedLabel: [{ value: null, label: null }],
  };

  questionOptions = [
    { value: "DEFAULT", label: "Multiple choice" },
    { value: "SA", label: "Short answer" },
    { value: "CB", label: "Checkbox" },
    { value: "LS", label: "Linear scale" },
  ];

  // multiple choice & checkbox

  arrayOptions = [];

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
    this.arrayOptions = [];
    for (let i = 1; i < this.state.optionCounter; i++) {
      this.arrayOptions.push("Option " + i);
    }
    return (
      <React.Fragment>
        <div className="question-area">
          <div id="question-title-font">
            <AutoHeightTextarea
              id="question-input"
              name="inputted-question"
              placeholder="Please type your question..."
              multiline={true}
              rows="14"
              cols="10"
              wrap="soft"
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
              onChange={(data) => this.handleQuestionChange(data)}
            />
          </div>
        </div>
        {this.state.selectedQuestionOption == "DEFAULT" &&
          this.multipleChoiceOption()}
        {this.state.selectedQuestionOption == "SA" && this.shortAnswerOption()}
        {this.state.selectedQuestionOption == "CB" && this.checkBoxOption()}
        {this.state.selectedQuestionOption == "LS" && this.linearScaleOption()}
        <div className="question-padding" />
      </React.Fragment>
    );
  }

  handleQuestionChange(data) {
    this.setState({ selectedQuestionOption: data.value });
  }

  handleInputChange(data) {
    this.setState({ selectedInputOption: data.value });
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

  multipleChoiceOption() {
    return (
      <React.Fragment>
        <div id="answer-selection-container">
          {this.arrayOptions.map((value) => {
            return (
              <div className="answer-selection">
                <input className="answerSelectionRadio" type="radio" disabled />
                <AutoHeightTextarea
                  className="inputText"
                  type="text"
                  placeholder={value}
                  wrap="soft"
                />
              </div>
            );
          })}
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
          onClick={(event) => {
            let count = this.state.optionCounter + 1;
            this.setState({ optionCounter: count });
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
          {this.arrayOptions.map((value) => {
            return (
              <div className="answer-selection">
                <input
                  className="answerSelectionCheckbox"
                  type="checkbox"
                  disabled
                />
                <AutoHeightTextarea
                  className="inputText"
                  type="text"
                  placeholder={value}
                  wrap="soft"
                />
              </div>
            );
          })}
          <div className="answer-selection">
            {this.displayNewOptionCheckbox()}
          </div>
        </div>
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

  displayNewOptionCheckbox() {
    return (
      <React.Fragment>
        <input type="checkbox" className="answerSelection" disabled />
        {/* ambil value buat nanti ditampilin di question */}
        <input
          className="inputText"
          type="text"
          placeholder="Add new option..."
          wrap="soft"
          readOnly
          onClick={(event) => {
            let count = this.state.optionCounter + 1;
            this.setState({ optionCounter: count });
          }}
        />
        {/* {this.state.isAnswerFilled ? this.displayNewOption() : null} */}
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

  displayAdd() {
    return (
      <React.Fragment>
        <div className="addNewItem">
          <div id="btn-addItem">+</div>
          <div id="btn-addItem2">Add Question</div>
        </div>
        <div className="addquestion-padding" />
      </React.Fragment>
    );
  }
}

export default Question;
