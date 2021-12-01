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
    isAnswerFilled: false,
    optionCounter: 1,
    optionCheck: false,
    privacyCheck: true,
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

  validateInput(event) {
    // if (document.form.question.value == "") return null;
    if (event.target.value.length > 0) {
      return true;
    }
  }

  handleOptionChecked() {
    this.setState({ optionCheck: !this.state.optionCheck });
  }

  // handleUserInput(event) {
  //   this.setState({ value: event.target.value });
  //   console.log(event.target.value);
  // }

  // initializingTextField() {
  //   this.setState({ isAnswerFilled: false });
  // }

  render() {
    return (
      <React.Fragment>
        <div className="container" id="dashboard-home">
          <div className="title-container">
            <div className="menu-icon" onClick={() => this.handleMenu()}>
              <img id="menu-icon" src={iconMenubarGrey} alt="" />
              {/* belum diimplement */}
              {this.state.openMenu ? this.displayMenu() : null}
            </div>
            <div className="page-title">Dashboard</div>
            {/* <div className="title">Dashboard</div> */}
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
          <div id="page-content">
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
        </div>
      </React.Fragment>
    );
  }

  displayMenu() {
    return <React.Fragment></React.Fragment>;
  }

  displayNewQuestion() {
    let arrayOptions = [];
    for (let i = 1; i < this.state.optionCounter; i++) {
      arrayOptions.push("Option " + i);
    }

    return (
      <React.Fragment>
        <div className="question-area">
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
            <div id="border"></div>
            <br />
          </div>
          <div id="question-selection">
              <Select
                value={this.questionOptions.value}
                options={this.questionOptions}
                defaultValue={this.questionOptions[0]}
                className="questionSelection"
              />
          </div>
        </div>
        <div id="answer-selection">
          {/* nilai true untuk pertama kali */}
          {arrayOptions.map((value) => {
            return (
              <div>
                <input
                  name="answerSelection"
                  type="radio"
                  checked={this.state.check}
                  onClick={() => this.handleChecked()}
                />
                <input
                  className="inputText"
                  type="text"
                  placeholder={value}
                  wrap="soft"
                />
              </div>
            );
          })}
          {this.displayNewOption()}
        </div>
      </React.Fragment>
    );
  }

  displayNewOption() {
    // this.initializingTextField();
    return (
      <React.Fragment>
        <input
          type="radio"
          checked={this.state.check}
          onClick={() => this.handleChecked()}
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
          }}
        />
        {/* {this.state.isAnswerFilled ? this.displayNewOption() : null} */}
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
                  checked={this.state.privacyCheck ? true : false}
                  onClick={() => {
                    this.setState({ privacyCheck: true });
                  }}
                />
                <label for="anonymous">Anonymous</label>
                <input
                  type="radio"
                  name="privacy"
                  id="not-anonymous"
                  value="not-anonymous"
                  checked={this.state.privacyCheck ? false : true}
                  onClick={() => {
                    this.setState({ privacyCheck: false });
                  }}
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
