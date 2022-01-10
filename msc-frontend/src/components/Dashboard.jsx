import react, { createRef, Fragment, useEffect } from "react";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import Question from "./Question";
import iconMenubarGrey from "./images/menubarGrey.png";
import iconVisibility from "./images/visibility.png";
import iconSettings from "./images/settings.png";
// import { TextInput } from "react-native-paper";
// import { Dropdown } from "react-bootstrap";

class Dashboard extends React.Component {
  constructor() {
    super();
    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleRemoveItem = this.handleRemoveItem.bind(this);
    this.handleQuestion = this.handleQuestion.bind(this);
  }

  state = {
    openVisibility: false,
    openSettings: false,
    privacyCheck: true,
    formItems: [],
    formCounter: 0,
  };

  componentDidMount() {
    this.setState({ formItems: this.props.formItems_data });
    let body = document.getElementById("body");
    let menuBtn = document.getElementById("menu-icon");
    menuBtn.addEventListener("click", () => {
      body.classList.toggle("openMenu");
    });
  }

  handleVisibility() {
    this.setState({ openVisibility: !this.state.openVisibility });
  }

  handleSettings() {
    this.setState({ openSettings: !this.state.openSettings });
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

  handleAddItem() {
    let currentStateData = this.state.formItems;
    this.setState({ formCounter: this.state.formCounter + 1 }, () => {
      // let id = "question-" + this.state.formCounter;
      let newItem = {
        id: this.state.formCounter,
        question: "",
        questionType: "",
        options: [],
      };
      currentStateData.push(newItem);
      this.setState({ formItems: currentStateData }, () => {
        // this.state.formItems.map((obj) => {
        //   this.handleUpdateQuestionTextarea(obj);
        // });
      });
    });
  }

  handleRemoveItem(deletedQuestionId) {
    console.log("Enter handle remove item " + deletedQuestionId);

    let newFormItems = this.state.formItems.filter((element) => {
      return element.id != deletedQuestionId;
    });

    this.setState(
      {
        formItems: newFormItems,
      },
      () => {
        this.state.formItems.map((obj) => {
          this.handleUpdateQuestionTextarea(obj);
        });
        console.log(this.state.formItems);
      }
    );
  }

  handleQuestion(id, value, isQuestionContentChanged, isQuestionTypeChanged) {
    let changedFormItem = this.state.formItems;
    let index = changedFormItem.findIndex((element) => element.id === id);
    let obj = { ...changedFormItem[index] };

    if (isQuestionContentChanged) {
      obj.question = value;
    } else if (isQuestionTypeChanged) {
      obj.questionType = value;
    }
    changedFormItem[index] = obj;

    this.setState({ formItems: changedFormItem }, () => {
      this.state.formItems.map((obj) => {
        this.handleUpdateQuestionTextarea(obj);
      });
      console.log(this.state.formItems);
    });
  }

  handleUpdateQuestionTextarea(obj) {
    // this.state.arrayOptions.map((obj) => {
    let id = "question-input-" + obj.id;
    console.log("Enter handle update question textarea");
    let textarea = document.getElementById(id);
    // console.log(textarea);
    if (textarea) {
      if (obj.question != "") {
        textarea.value = obj.question;
        // console.log("Masuk sini");
      } else {
        console.log("obj.value is null");
        textarea.value = "";
      }
    }

    if (obj.options) {
    }

    // });
  }

  render() {
    return (
      <React.Fragment>
        <div className="title-container">
          <div
            className="menu-icon"
            id="menu-icon" >
            <img id="menu-icon-img" src={iconMenubarGrey} alt="" />
          </div>
          <div className="page-title" id="page-title-home">
            Dashboard
          </div>
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
          <div className="questions-container">{this.displayQuestion()}</div>
        </div>
      </React.Fragment>
    );
  }

  displayQuestion() {
    return (
      <React.Fragment>
        {this.state.formItems.map((res) => {
          return (
            <React.Fragment>
              <div className="separator" />
              <div className="question">
                <Question
                  id={res.id}
                  mode={true}
                  QuestionContent={this.handleQuestion}
                  QuestionType={this.handleQuestion}
                  onRemove={this.handleRemoveItem}
                />
                {console.log("Already rendered")}
              </div>
            </React.Fragment>
          );
        })}
        <div className="separator" />
        <div
          className="question"
          id="addQuestion"
          onClick={() => this.handleAddItem()}
        >
          <Question mode={false} />
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
