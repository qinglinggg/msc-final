import React, { Component } from "react";
import Select from "react-select";
import AutoHeightTextarea from "./functional-components/AutoheightTextarea";

class QuestionItems extends React.Component {
  state = {
    optionCounter: 0,
    isAdd: false,
  }

  questionOptions = [
    { value: "DEFAULT", label: "Question type" },
    { value: "Short answer", label: "Short answer" },
    { value: "Multiple choice", label: "Multiple choice" },
    { value: "Checkbox", label: "Checkbox" },
    { value: "Linear scale", label: "Linear scale" },
  ];

  render() {
    return (
      <React.Fragment>
        {this.props.data ? this.displayQuestion() : this.displayAdd()}
      </React.Fragment>
    )
  }

  displayQuestion() {
    let arrayOptions = [];
    for (let i = 1; i < this.state.optionCounter; i++) {
      arrayOptions.push("Option " + i);
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
          />
        </div>
      </div>
      <div id="answer-selection-container">
        {/* nilai true untuk pertama kali */}
        {arrayOptions.map((value) => {
          return (
            <div className="answer-selection">
              <input
                className="answerSelection"
                type="radio"
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
          {this.displayNewOption()}
        </div>
      </div>
      <div className="question-padding"/>
    </React.Fragment>
    );
  }

  displayNewOption() {
    return (
      <React.Fragment>
        <input
          type="radio"
          className="answerSelection"
          disabled
        />
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
          }}/>
        {/* {this.state.isAnswerFilled ? this.displayNewOption() : null} */}
      </React.Fragment>
    );
  }

  handleAddItem() {
    this.setState({ isAdd: !this.state.isAdd });
  }

  displayAdd() {
    return (
      <React.Fragment>
        <div className="addNewItem" onClick={() => this.handleAddItem()}>
          <div id="btn-addItem">+</div>
          <div id="btn-addItem2">Add Question</div>
        </div>
        <div className="addquestion-padding"/>
      </React.Fragment>
    );
  }
}

export default QuestionItems;
