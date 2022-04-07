import react from "react";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Fragment } from "react";
import Page1Items from "./Page1Items";
import Dashboard from "./Dashboard";
import SearchField from "react-search-field";
import axios from "axios";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.searchOnChange = this.searchOnChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updatePopupData = this.updatePopupData.bind(this);
  }

  state = {
    isPage1: true,
    isAdd: false,
    isRequired: false,
    formCounter: 0,
    searchValue: null
  };

  handleClickPage1() {
    this.setState({ isPage1: true });
  }

  handleClickPage2() {
    this.setState({ isPage1: false });
  }

  handleAddItem() {
    this.setState({ isAdd: !this.state.isAdd });
  }

  componentDidUpdate(prevState){
    let body = document.getElementById("body");
    if (this.state.isAdd == true){
      let closePopup = document.querySelector(".closePopup");
      console.log(closePopup);
      if (closePopup) {
        closePopup.addEventListener("click", () => {
          body.classList.remove("openPopup");
        });
      }
      body.classList.add("openPopup");
    } else {
      body.classList.remove("openPopup");
    }
    // this.updatePopupData();
  }

  render() {

    const isPage1 = this.state.isPage1;
    let page;
    if (isPage1) {
      page = this.displayPage1();
    } else {
      page = this.displayPage2();
    }
    return (
      <React.Fragment>
        <div className="container">
          <div className="title-container">
            <div className="page-title">Home</div>
          </div>
          <div id="page-content">
            <div className="menu-bar">
              <div id="page-selection">
                <div
                  onClick={() => this.handleClickPage1()}
                  className="page-button clicked"
                  id="btn-page1"
                >
                  Your Recent Questionnaire
                </div>
                <div
                  onClick={() => this.handleClickPage2()}
                  className="page-button"
                  id="btn-page2"
                >
                  Waiting to be Filled
                </div>
              </div>
              <div id="page-others">
                <div id="page-search">
                  <SearchField
                    id="page-search"
                    placeholder="Search..."
                    value=""
                    onChange={(value) => {
                      console.log(value);
                      this.searchOnChange(value);
                    }}
                    // searchText="Search..."
                    classNames="test-class"
                  />
                </div>
                <img src="" alt="" id="history-btn" />
              </div>
            </div>
            <div className="list-container">{page}</div>
          </div>
        </div>
        {this.state.isAdd ? this.displayPopUp() : null}
      </React.Fragment>
    );
  }

  filterData(data) {
    if (!this.state.searchValue) {
      return data;
    }
    return data.filter((d) => {
      const dataName = d.title.toLowerCase();
      return dataName.includes(this.state.searchValue);
    });
  }

  searchOnChange(value) {
    this.setState((prevState) => {
      return { searchValue: value };
    });
  }

  displayPage1() {
    let formsData = this.filterData(this.props.formsData);
    return (
      <React.Fragment>
        {formsData.map((data) => (
          <Page1Items key={data.formId} data={data}/>
        ))}
        <div className="item-container">
          <div className="addNewItem" onClick={() => this.handleAddItem()}>
            <div id="btn-addItem">+</div>
            <div id="btn-addItem2">Add new Item</div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  displayPage2() {
    let dataShowed = this.filterData(this.props.waitingForms);

    return (
      <React.Fragment>
        {dataShowed.map((data) => (
          <Page1Items key={data.formId} data={data} />
        ))}
      </React.Fragment>
    );
  }

  handleSubmit(e, obj) {
    let body = document.getElementById("body");
    e.preventDefault();
    if (obj['title'] == "" || obj['description'] == "" || obj['privacySetting'] == "") {
      this.setState({ isRequired: true });
    } else {
      this.setState({ isRequired: false });
      this.props.handleCreateNewForm(obj);
    }
  }

  updatePopupData(){
    let nameTextarea = document.getElementById("nameInput");
    if (nameTextarea && nameTextarea.value != "") this.setState(this.state.obj['title'] = nameTextarea.value);

    let descTextarea = document.getElementById("descInput");
    if (descTextarea && descTextarea.value != "") this.setState(this.state.obj['description'] = descTextarea.value);

    let privacyTextarea = document.getElementById("privacyInput");
    if (privacyTextarea && privacyTextarea.value != "")
      this.setState(this.state.obj['privacySetting'] = privacyTextarea.value);
  }

  displayPopUp() {
    let obj = {};
    obj.title = "";
    obj.description = "";
    obj.privacySetting = "";
    obj.backgroundLink = null;
    obj.backgroundColor = null;
    let warningElement = (
      <React.Fragment>
        <div id="form-warning">Please fill out the field!</div>
      </React.Fragment>
    );
    return (
      <React.Fragment>
        <div className="popup">
          <div className="popup-container" id="popup-addItem">
            <span
              className="closePopup"
              onClick={() => {
                this.handleAddItem();
              }}
            >
            &times;
            </span>
            <form className="form-components">
              <h1>Make A New Questionnaire</h1>
              <br />
              <label>
                <span>Name</span>
                <input
                  id="nameInput"
                  type="text"
                  name="name"
                  onChange={(e) => {
                    if (e.target.value != "") obj.title = e.target.value;
                  }}
                />
              </label>
              <br />
              {this.state.isRequired && obj.title == "" ? warningElement : null}
              <br />
              <br />
              <label>
                <span>Description</span>
                <input
                  id="descInput"
                  type="text"
                  name="desc"
                  onChange={(e) => {
                    if (e.target.value != "") obj.description = e.target.value;
                  }}
                />
              </label>
              <br />
              {this.state.isRequired && obj.description == "" ? warningElement : null}
              <br />
              <br />
              <label>
                <span>Respondent Privacy</span>
                <br />
                <div className="form-options">
                  <div>
                    <input
                      id="privacyInput"
                      type="radio"
                      name="privacy"
                      value="anonymous"
                      onClick={() => {
                        obj.privacySetting = "anonymous";
                      }}
                    />
                    <label htmlFor="anonymous">Anonymous</label>
                  </div>
                  <div>
                    <input
                      id="privacyInput"
                      type="radio"
                      name="privacy"
                      value="not-anonymous"
                      onClick={() => {
                        obj.privacySetting = "not anonymous";
                      }}
                    />
                    <label htmlFor="not-anonymous">Not Anonymous</label>
                    <br />
                  </div>
                  <br />
                </div>
              </label>
              {this.state.isRequired && obj.privacySetting == ""
                ? warningElement
                : null}
              <br />
              <br />
              <button onClick={(e) => this.handleSubmit(e, obj)}>
                Confirm
              </button>
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Home;
