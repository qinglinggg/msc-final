import react from "react";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Fragment } from "react";
import Page1Items from "./Page1Items";
import Dashboard from "./Dashboard";
import SearchField from "react-search-field";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleButton = this.handleButton.bind(this);
    this.searchOnChange = this.searchOnChange.bind(this);
  }

  state = {
    isPage1: true,
    isAdd: false,
    isRequired: false,

    formCounter: 0,
    searchValue: null,
  };

  handleClickPage1() {
    this.setState({ isPage1: true });
  }

  handleClickPage2() {
    this.setState({ isPage1: false });
  }

  handleAddItem() {
    this.setState({ isAdd: !this.state.isAdd });
    // console.log(this.state.isAdd);
  }

  handleButton(obj) {
    // console.log("msuk");
    // obj.id = formCounter;
    // obj.formItems = [];
    // let currentForms = [];
    // if (this.props.Parent.state.forms)
    //   currentForms = this.props.Parent.state.forms;
    // currentForms.push(obj);
    // this.props.Parent.setState({ forms: currentForms }, () => {
    //   console.log(this.props.Parent.state);
    // });
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
          <div className="page-container">
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
            {this.state.isAdd ? this.displayPopUp() : null}
          </div>
        </div>
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
    let dataShowed = this.filterData(this.props.page1_data);

    return (
      <React.Fragment>
        {dataShowed.map((data) => (
          <Page1Items key={data.formId} data={data} />
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

  displayPopUp() {
    let body = document.getElementById("body");
    body.classList.toggle("openPopup");

    let obj = {};
    obj.name = "";
    obj.desc = "";
    obj.privacy = "";
    obj.formItems = [];

    let nameTextarea = document.getElementById("nameInput");
    if (nameTextarea && nameTextarea.value) obj.name = nameTextarea.value;

    let descTextarea = document.getElementById("descInput");
    if (descTextarea && descTextarea.value) obj.desc = descTextarea.value;

    let privacyTextarea = document.getElementById("privacyInput");
    if (privacyTextarea && privacyTextarea.value)
      obj.privacy = privacyTextarea.value;

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
                body.classList.toggle("openPopup");
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
                    if (e.target.value != "") obj.name = e.target.value;
                    {
                      console.log(obj);
                    }
                  }}
                />
              </label>
              <br />
              {this.state.isRequired && obj.name == "" ? warningElement : null}
              <br />
              <br />
              <label>
                <span>Description</span>
                <input
                  id="descInput"
                  type="text"
                  name="desc"
                  onChange={(e) => {
                    if (e.target.value != "") obj.desc = e.target.value;
                    {
                      console.log(obj);
                    }
                  }}
                />
              </label>
              <br />
              {this.state.isRequired && obj.desc == "" ? warningElement : null}
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
                      id="anonymous"
                      value="anonymous"
                      onClick={() => {
                        obj.privacy = "anonymous";
                        {
                          console.log(obj);
                        }
                      }}
                    />
                    <label for="anonymous">Anonymous</label>
                  </div>
                  <div>
                    <input
                      id="privacyInput"
                      type="radio"
                      name="privacy"
                      id="not-anonymous"
                      value="not-anonymous"
                      onClick={() => {
                        obj.privacy = "not anonymous";
                        {
                          console.log(obj);
                        }
                      }}
                    />
                    <label for="not-anonymous">Not Anonymous</label>
                    <br />
                  </div>
                  <br />
                </div>
              </label>
              {this.state.isRequired && obj.privacy == ""
                ? warningElement
                : null}
              <br />
              <br />
              <Link to="/item1/dashboard">
                <button
                  // onClick={() => {
                  //   this.handleButton(obj);
                  // }}
                  onClick={(e) => {
                    body.classList.toggle("openPopup");
                    // validation
                    console.log(obj);
                    if (obj.name == "" || obj.desc == "" || obj.privacy == "") {
                      this.setState({ isRequired: true });
                      e.preventDefault();
                    } else {
                      this.setState({ isRequired: false });
                      this.props.createNewForm(obj);
                    }
                  }}
                >
                  Confirm
                </button>
              </Link>
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Home;
