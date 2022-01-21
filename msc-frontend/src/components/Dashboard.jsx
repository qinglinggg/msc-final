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
  constructor(props) {
    super(props);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleRemoveItem = this.handleRemoveItem.bind(this);
    this.handleUpdateQuestionType = this.handleUpdateQuestionType.bind(this);
    this.handleResetOption = this.handleResetOption.bind(this);
    this.handleAddOption = this.handleAddOption.bind(this);
    this.handleRemoveOption = this.handleRemoveOption.bind(this);
    this.handleOptionValue = this.handleOptionValue.bind(this);
    this.handleUpdateQuestionInput = this.handleUpdateQuestionInput.bind(this);
    this.handleOptionCount = this.handleOptionCount.bind(this);
  }

  state = {
    testing: false,
    openVisibility: false,
    openSettings: false,
    privacyCheck: true,
    formItems: [],
    formCounter: 0,
  };

  componentDidMount() {
    // this.setState({ formItems: this.props.formItems_data });
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
        arrayOptions: [],
        optionCounter: 0,
      };
      currentStateData.push(newItem);
      this.setState({ formItems: currentStateData });
      // console.log(currentStateData);
    });
  }

  handleRemoveItem(deletedQuestionId) {
    let formItems = [...this.state.formItems];
    let newFormItems = formItems.filter((element) => {
      return element.id != deletedQuestionId;
    });
    this.setState({
      formItems: newFormItems,
    });
  }

  handleUpdateQuestionInput(questionId, event) {
    let formItems = [...this.state.formItems];
    let currentForm = formItems.filter((elem) => {
      return elem.id == questionId;
    });
    currentForm = currentForm[0];
    currentForm["question"] = event.target.value;
    formItems = formItems.map((elem) => {
      if (questionId == elem.id) {
        return currentForm;
      }
      return elem;
    });
    this.setState({ formItems });
  }

  handleUpdateQuestionType(questionId, event) {
    let formItems = [...this.state.formItems];
    let currentForm = formItems.filter((elem) => {
      return elem.id == questionId;
    });
    currentForm = currentForm[0];
    currentForm["questionType"] = event.value;
    // console.log(event.value);
    formItems = formItems.map((elem) => {
      if (questionId == elem.id) {
        return currentForm;
      }
      return elem;
    });
    this.setState({ formItems });
  }

  handleResetOption(id) {
    let formItems = [...this.state.formItems];
    let currentForm = formItems.filter((elem) => {
      return elem.id == id;
    });
    currentForm = currentForm[0];
    currentForm["optionCounter"] = 0;
    currentForm["arrayOptions"] = [];
    formItems = formItems.map((elem) => {
      if (elem.id == id) {
        return currentForm;
      }
      return elem;
    });
    this.setState({ formItems });
  }

  handleAddOption(id) {
    // console.log("Handle Add Option: " + id);
    let formItems = [...this.state.formItems];
    let currentForm = formItems.filter((elem) => {
      return elem.id == id;
    });
    console.log(currentForm);
    currentForm = currentForm[0];
    currentForm["optionCounter"] += 1;
    console.log(currentForm);
    let obj = {};
    obj["id"] = currentForm["optionCounter"];
    obj["label"] = "Option " + currentForm["optionCounter"];
    obj["value"] = "";
    currentForm["arrayOptions"].push(obj);
    formItems = formItems.map((elem) => {
      if (elem.id == id) {
        return currentForm;
      }
      return elem;
    });
    // console.log("Final: ");
    // console.log(formItems);
    this.setState({ formItems });
  }

  handleRemoveOption(questionId, objId, obj) {
    let formItems = [...this.state.formItems];
    let currentForm = formItems.filter((elem) => {
      return elem.id == questionId;
    });
    currentForm = currentForm[0];
    let arrayOptions = currentForm["arrayOptions"];
    arrayOptions = arrayOptions.filter((elem) => {
      return elem.id != objId;
    });
    currentForm["arrayOptions"] = arrayOptions;
    formItems = formItems.map((elem) => {
      if (elem.id == questionId) {
        return currentForm;
      }
      return elem;
    });
    this.setState({ formItems });
  }

  handleOptionValue(questionId, event, object) {
    let formItems = [...this.state.formItems];
    let currentForm = formItems.filter((elem) => {
      return elem.id == questionId;
    });
    currentForm = currentForm[0];
    let arrayOptions = currentForm["arrayOptions"];
    arrayOptions.map((elem) => {
      if (elem.id == object.id) {
        elem.value = event.target.value;
      }
    });
    formItems = formItems.map((elem) => {
      if (elem.id == questionId) {
        return currentForm;
      }
      return elem;
    });
    this.setState({ formItems });
  }

  handleOptionCount(questionId, event) {
    let formItems = [...this.state.formItems];
    let currentForm = formItems.filter((elem) => {
      return elem.id == questionId;
    });
    currentForm = currentForm[0];
    currentForm["optionCounter"] = event.value;
    formItems = formItems.map((elem) => {
      if (elem.id == questionId) {
        return currentForm;
      }
      return elem;
    });
    this.setState({ formItems });
  }

  render() {
    return (
      <React.Fragment>
        <div className="title-container">
          <div className="menu-icon" id="menu-icon">
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
          // console.log(res);
          return (
            <React.Fragment>
              <div className="separator" />
              <div className="question">
                <Question
                  key={"question-" + res.id}
                  questionData={res}
                  mode={true}
                  arrayOptions={res["arrayOptions"]}
                  onRemove={this.handleRemoveItem}
                  handleAddOption={this.handleAddOption}
                  handleRemoveOption={this.handleRemoveOption}
                  handleOptionValue={this.handleOptionValue}
                  handleUpdateQuestionInput={this.handleUpdateQuestionInput}
                  handleUpdateQuestionType={this.handleUpdateQuestionType}
                  handleResetOption={this.handleResetOption}
                  handleOptionCount={this.handleOptionCount}
                />
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
