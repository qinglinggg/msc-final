import React, { Component } from "react";
import iconMenubarGrey from "./images/menubarGrey.png";

class Preview extends Component {
  constructor(props) {
    super(props);
    this.handleBack = this.handleBack.bind(this);
    this.handleNext = this.handleNext.bind(this);
  }

  state = {
    index: 1,
  };

  componentDidMount() {
    let body = document.getElementById("body");
    let menuBtn = document.getElementById("menu-icon");
    menuBtn.addEventListener("click", () => {
      body.classList.toggle("openMenu");
    });
  }

  handleNext() {
    this.setState({ index: this.state.index + 1 });
  }

  handleBack() {
    this.setState({ index: this.state.index - 1 });
  }

  render() {
    let questions = this.props.formItems_data;
    let lastIndex = questions.length;
    let currentQuestion = questions.find(
      (question) => question.id == this.state.index
    );

    return (
      <React.Fragment>
        <div className="title-container">
          <div className="menu-icon" id="menu-icon">
            <img id="menu-icon-img" src={iconMenubarGrey} alt="" />
          </div>
          <div className="page-title" id="page-title-home">
            Preview
          </div>
        </div>
        {this.displayQuestion(currentQuestion, lastIndex)}
      </React.Fragment>
    );
  }

  displayQuestion(current, lastIndex) {
    let loadAnswerField;
    return (
      <div className="preview-container">
        {this.state.index == 1 ? (
          <div id="preview-back-null" />
        ) : (
          <div id="preview-back-icon-animation">
            <ion-icon
              name="chevron-back-outline"
              id="preview-back-icon"
              onClick={this.handleBack}
            />
          </div>
        )}
        <div className="preview-flex">
          <div className="preview-field">
            {this.state.index}. {current.question}
          </div>
          <div className="answer-field">
            {current.questionType == "LS"
              ? (loadAnswerField = this.loadLinearScale(current.arrayOptions))
              : current.questionType == "MC"
              ? (loadAnswerField = this.loadMultipleChoice(
                  current.arrayOptions
                ))
              : current.questionType == "CB"
              ? (loadAnswerField = this.loadCheckbox(current.arrayOptions))
              : current.questionType == "SA"
              ? (loadAnswerField = this.loadShortAnswer())
              : null}
          </div>
        </div>
        {this.state.index == lastIndex ? (
          <div id="preview-next-null" />
        ) : (
          <div id="preview-next-icon-animation">
            <ion-icon
              name="chevron-forward-outline"
              id="preview-next-icon"
              onClick={this.handleNext}
            />
          </div>
        )}
      </div>
    );
  }

  loadLinearScale(arrayOptions) {
    return (
      <React.Fragment>
        <div id="preview-linear-scale">
          {arrayOptions.map((options) => {
            return (
              <div id="preview-option-container">
                <div id="preview-input-ls-container">
                  <input
                    className="answerSelection"
                    id="option-ls"
                    type="radio"
                    name="options"
                  />
                  <label id="option-ls-label" for="options">
                    {options.value}
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </React.Fragment>
    );
  }

  loadMultipleChoice(arrayOptions) {
    return (
      <React.Fragment>
        <div id="preview-multiple-choice">
          {arrayOptions.map((options) => {
            return (
              <div id="preview-option-container">
                <div id="preview-input-mc-cb-container">
                  <input
                    className="answerSelection"
                    id="option-mc-cb"
                    type="radio"
                    name="options"
                  />
                  <label id="option-label" for="options">
                    {options.value}
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </React.Fragment>
    );
  }

  loadCheckbox(arrayOptions) {
    return (
      <React.Fragment>
        {arrayOptions.map((options) => {
          return (
            <div id="preview-option-container">
              <div id="preview-input-mc-cb-container">
                <input
                  className="answerSelection"
                  id="option-mc-cb"
                  type="checkbox"
                  name="options"
                />
                <label id="option-label" for="options">
                  {options.value}
                </label>
              </div>
            </div>
          );
        })}
      </React.Fragment>
    );
  }

  loadShortAnswer() {
    return (
      <React.Fragment>
        <div id="preview-short-answer">
          <div id="preview-sa-text">Your answer</div>
        </div>
      </React.Fragment>
    );
  }
}

export default Preview;
