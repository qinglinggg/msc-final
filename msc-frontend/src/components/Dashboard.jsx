import react, { createRef, useEffect } from "react";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Question from "./Question";
import iconMenubarGrey from "./images/menubarGrey.png";
import iconMenubarWhite from "./images/menubarWhite.png";
import iconVisibility from "./images/visibility.png";
import iconSettings from "./images/settings.png";
// import { TextInput } from "react-native-paper";
// import { Dropdown } from "react-bootstrap";

class Dashboard extends React.Component {
  constructor() {
    super();
    this.handleMenu = this.handleMenu.bind(this);
    this.elementRef = createRef();
  }

  state = {
    openMenu: false,
    openVisibility: false,
    openSettings: false,
    isAdd: false,
    optionCounter: 1,
    optionCheck: false,
    privacyCheck: true,
  };

  handleMenu() {
    this.setState({ openMenu: !this.state.openMenu });
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

  render() {
    let mode = true;
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
              <div className="separator"/>
              <div className="question">
                <Question data={mode}></Question>
              </div>
              <div className="separator"/>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  displayMenu() {
    return <React.Fragment></React.Fragment>;
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
