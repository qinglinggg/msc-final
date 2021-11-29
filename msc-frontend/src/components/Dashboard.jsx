import react from "react";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import iconMenubarGrey from "./images/menubarGrey.png";
import iconMenubarWhite from "./images/menubarWhite.png";
import iconVisibility from "./images/visibility.png";
import iconSettings from "./images/settings.png";
// import { TextInput } from "react-native-paper";
// import { Dropdown } from "react-bootstrap";
import Select from "react-select";

class Dashboard extends React.Component {
  constructor() {
    super();
    this.handleMenu = this.handleMenu.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
  }

  state = {
    openMenu: false,
    openVisibility: false,
    openSettings: false,
    isAdd: false,
    typeQuestion: false,
    isAnswerFilled: true,
  };

  questionOptions = [
    { value: "DEFAULT", label: "Question type" },
    { value: "Short answer", label: "Short answer" },
    { value: "Multiple choice", label: "Multiple choice" },
    { value: "Checkbox", label: "Checkbox" },
    { value: "Linear scale", label: "Linear scale" },
  ];

  handleMenu() {
    this.setState({ openMenu: !this.state.openMenu });
  }

  handleVisibility() {
    this.setState({ openVisibility: !this.state.openVisibility });
  }

  handleSettings() {
    this.setState({ openSettings: !this.state.openSettings });
  }

  handleAddItem() {
    this.setState({ isAdd: !this.state.isAdd });
  }

  validateInput() {
    // if (document.form.question.value == "") return null;
  }

  handleUserInput(event) {
    this.setState({ value: event.target.value });
  }

  handleTextField() {
    this.setState({ isAnswerFilled: !this.state.isAnswerFilled });
  }

  render() {
    return (
      <React.Fragment>
        <div className="container">
          <div className="title-container">
            <div className="icon-image" onClick={() => this.handleMenu()}>
              <img id="menu-icon" src={iconMenubarGrey} alt="" />
              {/* belum diimplement */}
              {this.state.openMenu ? this.displayMenu() : null}
            </div>
            <div className="title">Dashboard</div>
            <div className="dashboard-icon">
              <img
                className="icon-image"
                onClick={() => this.handleVisibility()}
                src={iconVisibility}
                alt=""
              />
              <img
                className="icon-image"
                onClick={() => this.handleSettings()}
                src={iconSettings}
                alt=""
              />
              {this.state.openSettings ? this.displaySettings() : null}
            </div>
          </div>

          {/* kondisi kalo udah ada question, tampilin question dulu, baru AddQuestion*/}
          {/* kalo belum ada, lgsg tombol Add Question aja */}
          {/* AddQuestion -> tombol dulu baru kalo dipencet muncul menu tambahan */}
          <div className="questions-container">
            <div className="question">
              {/* apakah ada data?
              insert data here 
              note: kayanya perlu implement index untuk munculin icon next > dan back < */}
              {this.state.isAdd
                ? this.displayNewQuestion()
                : this.displayAddQuestion()}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  displayMenu() {
    return <React.Fragment></React.Fragment>;
  }

  displayNewQuestion() {
    let answerFilled = this.state.isAnswerFilled;
    if (answerFilled) {
    }
    return (
      <React.Fragment>
        <div id="question-title-font">
          <textarea
            id="question-input"
            type="textarea"
            name="inputted-question"
            placeholder="Please type your question..."
            multiline={true}
            rows="14"
            cols="10"
            wrap="soft"
          />
          <div id="question-selection">
            <Select
              value={this.questionOptions.value}
              options={this.questionOptions}
              defaultValue={this.questionOptions[0]}
            />
          </div>
        </div>
        <div id="border"></div>
        <br />
        <div id="answer-selection">
          {/* nilai true untuk pertama kali */}
          {this.state.isAnswerFilled ? this.displayNewOption() : null}
        </div>
      </React.Fragment>
    );
  }

  displayNewOption() {
    return (
      <React.Fragment>
        <input type="radio" value="{option1}" checked={false} />
        {/* ambil value buat nanti ditampilin di question */}
        <input
          class="inputText"
          type="text"
          placeholder="Please type answer choices..."
          wrap="soft"
          onChange={() => this.handleUserInput()}
        />
      </React.Fragment>
    );
  }

  displayAddQuestion() {
    return (
      <React.Fragment>
        <div className="addNewItem" onClick={() => this.handleAddItem()}>
          <div id="btn-addItem">+</div>
          <div id="btn-addItem2">Add Question</div>
        </div>
      </React.Fragment>
    );
  }

  displaySettings() {
    return (
      <React.Fragment>
        <div className="popup" id="popup-addItem">
          <span className="closePopup" onClick={() => this.handleSettings()}>
            &times;
          </span>
          <form className="form-components">
            <h1>Settings</h1>
            <br />
            <label>
              Name
              <input className="form-alignright" type="text" name="name" />
            </label>
            <br />
            <br />
            <label>
              Description
              <input className="form-alignright" type="text" name="desc" />
            </label>
            <br />
            <br />
            <label>
              Respondent Privacy
              <div className="form-alignright">
                <input
                  type="radio"
                  name="privacy"
                  id="anonymous"
                  value="anonymous"
                />
                <label for="anonymous">Anonymous</label>
              </div>
              <div className="form-alignright">
                <input
                  type="radio"
                  name="privacy"
                  id="not-anonymous"
                  value="not-anonymous"
                />
                <label for="not-anonymous">Not Anonymous</label>
                <br />
              </div>
              <br />
            </label>
            <br />
            <br />
            {/* <input
              type="submit"
              value="Confirm"
              onClick={() => this.handleClickConfirm.bind(this)}
            /> */}
            <Link to="/item1/dashboard">
              <button>Confirm</button>
            </Link>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default Dashboard;
