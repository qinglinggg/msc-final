import react from "react";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Fragment } from "react";
import PageItems from "./PageItems";
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
    this.handleFormDeletion = this.handleFormDeletion.bind(this);
  }

  state = {
    selectedPage: 1,
    isAdd: false,
    isRequired: false,
    formCounter: 0,
    searchValue: null,
    title: "",
    description: "",
    privacySetting: "",
    forms: [],
    invitedForms: []
  };

  handleClickPage1() {
    this.setState({ selectedPage: 1 });
  }

  handleClickPage2() {
    this.setState({ selectedPage: 2 });
  }

  handleAddItem() {
    this.setState({ isAdd: !this.state.isAdd });
  }

  handleCurrentSelection(item) {
    let listSelection = document.querySelectorAll(".page-button");
    listSelection.forEach((i) => {
      i.classList.remove('clicked');
    });
    item.classList.add('clicked');
  }

  componentDidMount() {
    let tempBreadcrumbs = localStorage.getItem("breadcrumbs");
    tempBreadcrumbs = JSON.parse(tempBreadcrumbs);
    if(tempBreadcrumbs.length >= 1) {
      while(tempBreadcrumbs.slice(-1)[0] && tempBreadcrumbs.slice(-1)[0].page != "/"){
        tempBreadcrumbs.pop();
      }
    }
    tempBreadcrumbs.push({
      page: "Home",
      path: window.location.href,
    });
    localStorage.setItem("breadcrumbs", JSON.stringify(tempBreadcrumbs));
    this.setState({forms: JSON.parse(localStorage.getItem("formLists"))});
    this.setState({invitedForms: JSON.parse(localStorage.getItem("invitedFormLists"))});
    let listSelection = document.querySelectorAll(".page-button");
    listSelection.forEach((item) => {
      item.addEventListener('click', (e) => {
        this.handleCurrentSelection(e.target);
      })
    });
  }

  componentDidUpdate(){
    let body = document.getElementById("body");
    if (this.state.isAdd == true){
      let closePopup = document.querySelector(".closePopup");
      if (closePopup) {
        closePopup.addEventListener("click", () => {
          body.classList.remove("openPopup");
        });
      }
      body.classList.add("openPopup");
    } else {
      body.classList.remove("openPopup");
    }
  }

  render() {
    const selectedPage = this.state.selectedPage;
    let page;
    if (selectedPage == 1) {
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
                      this.searchOnChange(value);
                    }}
                    // searchText="Search..."
                    classNames="test-class"
                  />
                </div>
                <img src="" alt="" id="history-btn" />
              </div>
            </div>
            {this.state.selectedPage == 2 && !this.state.invitedForms ?
              <div className="home-form-is-null">You're not invited to fill any form yet. Feel free to continue your work!</div>
              : null
            }
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

  handleFormDeletion() {
    let tempList = localStorage.getItem("formLists");
    tempList = JSON.parse(tempList);
    this.setState({forms: tempList}); 
    console.log("deleted");
  }

  displayPage1() {
    let formsData = this.filterData(this.state.forms);
    // else {
    //   formsData = axios.get(`${BASE_URL}/api/v1/forms/owned-form/${this.state.loggedInUser}`).then((res) => {
    //     const forms = res.data;
    //     localStorage.setItem("formLists", JSON.stringify(forms));
    //   });
    //   localStorage.setItem("formLists", JSON.stringify(formsData));
    // }
    return (
      <React.Fragment>
        {formsData ? formsData.map((data) => (
          <PageItems 
            key={data.formId} 
            data={data}
            handleFormDeletion={this.handleFormDeletion}
            currentPage={1}
          />
        )) : null}
        <div className="item-wrapper">
          <div className="item-container">
            <div className="addNewItem" onClick={() => this.handleAddItem()}>
              <div id="btn-addItem">+</div>
              <div id="btn-addItem2">Add new Item</div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  displayPage2() {
    let invitedFormsData = this.filterData(this.state.invitedForms);

    return (
      <React.Fragment>
        {invitedFormsData ? invitedFormsData.map((data) => (
          <PageItems 
            key={data.formId} 
            data={data} 
            currentPage={2} 
          />
        )) : null}
      </React.Fragment>
    );
  }

  handleSubmit(e) {
    let body = document.getElementById("body");
    e.preventDefault();
    console.log(this.state);
    if (this.state.title == "" || this.state.description == "" || this.state.privacySetting == "") {
      this.setState({ isRequired: true }); 
    } else {
      this.setState({ isRequired: false });
      let obj = {};
      obj.authorUserId = this.props.loggedInUser;
      obj.title = this.state.title;
      obj.description = this.state.description;
      obj.privacySetting = this.state.privacySetting;
      obj.backgroundLink = null;
      obj.backgroundColor = "Default";
      this.props.handleCreateNewForm(obj);
    }
  }

  updatePopupData(){
    let nameTextarea = document.getElementById("nameInput");
    if (nameTextarea && nameTextarea.value != "") this.setState({title: nameTextarea.value});

    let descTextarea = document.getElementById("descInput");
    if (descTextarea && descTextarea.value != "") this.setState({description: descTextarea.value});

    let privacyTextarea = document.getElementById("privacyInput");
    if (privacyTextarea && privacyTextarea.value != "")
      this.setState({privacySetting: privacyTextarea.value});
  }

  displayPopUp() {
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
                    if (e.target.value != "") this.setState({title: e.target.value });
                  }}
                />
              </label>
              <br />
              {this.state.isRequired && this.state.title == "" ? warningElement : null}
              <br />
              <br />
              <label>
                <span>Description</span>
                <input
                  id="descInput"
                  type="text"
                  name="desc"
                  onChange={(e) => {
                    if (e.target.value != "") this.setState({description: e.target.value});
                  }}
                />
              </label>
              <br />
              {this.state.isRequired && this.state.description == "" ? warningElement : null}
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
                        this.setState({ privacySetting: "anonymous" });
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
                        this.setState({privacySetting: "not anonymous"});
                      }}
                    />
                    <label htmlFor="not-anonymous">Not Anonymous</label>
                    <br />
                  </div>
                  <br />
                </div>
              </label>
              {this.state.isRequired && this.state.privacySetting == ""
                ? warningElement
                : null}
              <br />
              <br />
              <button onClick={(e) => {
                this.handleSubmit(e);
                console.log(this.state.title);
                }}>
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
