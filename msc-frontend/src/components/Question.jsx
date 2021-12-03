import React, { Component } from "react";
import Select from "react-select";
import AutoHeightTextarea from "./functional-components/AutoheightTextarea";

class Question extends React.Component {
  state = {
    optionCounter: 0,
    selectedOption: "DEFAULT",
  }

  questionOptions = [
    { value: "DEFAULT", label: "Multiple choice" },
    { value: "SA", label: "Short answer" },
    { value: "CB", label: "Checkbox" },
    { value: "LS", label: "Linear scale" },
  ];

  arrayOptions = [];

  render() {
    return (
      <React.Fragment>
        {this.props.mode ? this.displayQuestion() : this.displayAdd()}
      </React.Fragment>
    )
  }

  displayQuestion() {
    this.arrayOptions = []
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
              onChange={(data) => this.handleSelectionChange(data)}
            />
          </div>
        </div>
        {this.state.selectedOption == "DEFAULT" &&
          this.multipleChoiceOption()
        }
        {this.state.selectedOption == "SA" &&
          this.shortAnswerOption()
        }
        {this.state.selectedOption == "CB" &&
          this.checkBoxOption()
        }
        {this.state.selectedOption == "LS" &&
          this.linearScaleOption()
        }
      </React.Fragment>
    );
  }

  handleSelectionChange(data) {
    this.setState({selectedOption: data.value});
  }

  shortAnswerOption() {
    return (
      <div id="shortanswer-container">
        <input type="text" className="inputText" name="shortanswer-field"
        placeholder="Input your answer..."/>
      </div>
    );
  }

  multipleChoiceOption() {
    return (
      <React.Fragment>
      <div id="answer-selection-container">
        {/* nilai true untuk pertama kali */}
        {this.arrayOptions.map((value) => {
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

  checkBoxOption() {
    return (
      <div>Hiyaaa</div>
    );
  }

  linearScaleOption() {
    return (
      <div>Hiyaaa</div>
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

  displayAdd() {
    return (
      <React.Fragment>
        <div className="addNewItem">
          <div id="btn-addItem">+</div>
          <div id="btn-addItem2">Add Question</div>
        </div>
        <div className="addquestion-padding"/>
      </React.Fragment>
    );
  }
}

export default Question;
