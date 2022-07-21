import React, { Component } from "react";
import PageItems from "./PageItems";
import SearchField from "react-search-field";
import Popup from "reactjs-popup";
import axios from "axios";

const APP_URL = "http://localhost:3001";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.displayPage1 = this.displayPage1.bind(this);
    this.displayPage2 = this.displayPage2.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.searchOnChange = this.searchOnChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updatePopupData = this.updatePopupData.bind(this);
    this.handleFormUpdate = this.handleFormUpdate.bind(this);
    this.checkLoggedInUser = this.checkLoggedInUser.bind(this);
  }

  state = {
    selectedPage: 1,
    isAdd: false,
    isRequired: false,
    formCounter: 0,
    searchValue: null,
    invFilterValue: null,
    title: "",
    description: "",
    privacySetting: "",
    forms: [],
    invitedForms: [],
    loggedInUser: "",
    nullFlag: 0,
    isRefreshed: false,
  };

  handleClickPage1() {
    this.setState({ selectedPage: 1 });
    this.setState({ nullFlag : 0 });
  }

  handleClickPage2() {
    this.setState({ selectedPage: 2 });
    this.setState({ nullFlag : 0 });
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

  checkLoggedInUser() {
    let tempUser = localStorage.getItem("loggedInUser");
    let currentUser = this.state.loggedInUser;
    if (tempUser) {
      tempUser = JSON.parse(tempUser);
      if(tempUser != currentUser && tempUser != "") {
        this.setState({loggedInUser: tempUser});
      }
    }
  }

  componentDidMount() {
    setInterval(() => {
      if(!this.state.isRefreshed) this.checkLoggedInUser();
    }, 500);
    let tempBreadcrumbs = localStorage.getItem("breadcrumbs");
    if(tempBreadcrumbs){
      tempBreadcrumbs = JSON.parse(tempBreadcrumbs);
      if(tempBreadcrumbs.length >= 1) {
        while(tempBreadcrumbs.slice(-1)[0] && tempBreadcrumbs.slice(-1)[0].page != "/"){
          tempBreadcrumbs.pop();
        }
      }
    } else tempBreadcrumbs = [];
    tempBreadcrumbs.push({
      page: "Home",
      path: window.location.href,
    });
    localStorage.setItem("breadcrumbs", JSON.stringify(tempBreadcrumbs));
    let listSelection = document.querySelectorAll(".page-button");
    listSelection.forEach((item) => {
      item.addEventListener('click', (e) => {
        this.handleCurrentSelection(e.target);
      })
    });
  }

  componentDidUpdate(prevProps, prevState){
    let body = document.getElementById("body");
    if(this.props.openedPopup) return;
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
    if(this.state.loggedInUser != "" && this.state.loggedInUser != prevState.loggedInUser){
      localStorage.setItem("selectedForm", JSON.stringify([]));
      this.setState({forms: JSON.parse(localStorage.getItem("formLists"))});
      this.setState({invitedForms: JSON.parse(localStorage.getItem("invitedFormLists"))});
      this.setState({ isRefreshed : true });
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
                <div className="page-filter">
                  {
                    this.state.selectedPage == 2 ?
                    <Popup
                      trigger={(open) => 
                        <ion-icon name="filter-outline" id="page-filter"></ion-icon>
                      }
                      position="bottom center"
                    >
                      <div className="popup-wrapper">
                        <div className="popup-content" onClick={() => this.filterOnChange("unanswered")}>
                          <div className="popup-text" style={{ fontWeight : this.state.invFilterValue == 'unanswered' ? 'bold' : '' }}>Show only unanswered forms</div>
                        </div>
                        <div className="popup-content" onClick={() => this.filterOnChange("answered")}>
                          <div className="popup-text" style={{ fontWeight: this.state.invFilterValue == 'answered' ? 'bold' : '' }}>Show only answered forms</div>
                        </div>
                        <div className="popup-content" onClick={() => this.filterOnChange(null)}>
                          <div className="popup-text" style={{ fontWeight: !this.state.invFilterValue ? 'bold' : ''}}>Show all</div>
                        </div>
                      </div>
                    </Popup>
                      : null
                  }
                </div>
                <img src="" alt="" id="history-btn" />
              </div>
            </div>
            {this.state.nullFlag == 0 ? 
              <div className="list-container">{page}</div> 
              : this.nullText()
            }
          </div>
        </div>
        {this.state.isAdd ? this.displayPopUp() : null}
      </React.Fragment>
    );
  }

  nullText() {
    let nullValue = this.state.nullFlag;
    if(nullValue == 1){
      return (
        <div className="home-form-is-null">The form you are looking for is unavailable. Maybe try other keywords?</div>
      )
    } else if (nullValue == 2){
      return (
        <div className="home-form-is-null">You're not invited to fill any form yet. Feel free to continue your work!</div>
      )
    } else if (nullValue == 3){
      return (
        <div className="home-form-is-null">There are no matches form yet :(</div>
      )
    }
  }

  searchData(data){
    if(!this.state.searchValue) return data;
    const search = this.state.searchValue.toLowerCase();
    let searchedData = data.filter((d) => {
      const dataName = d.title.toLowerCase();
      return dataName.includes(search);
    });
    return searchedData;
  }

  filterData(data){
    if(!this.state.invFilterValue) return data;
    let filteredData = data;
    if(this.state.invFilterValue == "answered"){
      filteredData = filteredData.filter((d) => {
        return d.submitDate != null;
      })
    }
    else if(this.state.invFilterValue == "unanswered"){
      filteredData = filteredData.filter((d) => {
        return d.submitDate == null;
      })
    }
    return filteredData;
  }

  getData(data) {
    if(!data) return;
    let nullValue = 0;
    let res = null;
    if(this.state.selectedPage == 1){
      if(data.length == 0) return data;
      res = this.searchData(data);
      if(res.length == 0) nullValue = 1;
    } else if(this.state.selectedPage == 2){
      if(data.length == 0) nullValue = 2;
      else {
        res = this.filterData(data);
        if(res.length == 0) nullValue = 3;
        else {
          res = this.searchData(res);
          if(res.length == 0) nullValue = 1;
        }
      }
    }
    if(nullValue != 0 && this.state.nullFlag != nullValue) this.setState({ nullFlag: nullValue });
    return res;
  }

  searchOnChange(value) {
    this.setState((prevState) => {
      return { searchValue: value };
    });
    this.setState({ nullFlag: 0 });
  }

  filterOnChange(value){
    this.setState({ invFilterValue: value });
    this.setState({ nullFlag : 0 });
  }

  async handleFormUpdate() {
    let tempUser = JSON.parse(localStorage.getItem("loggedInUser"));
    await this.props.updateUserdata(tempUser);
    let tempList = JSON.parse(localStorage.getItem("formLists"));
    this.setState({ forms: tempList });
    let tempInvList = JSON.parse(localStorage.getItem("invitedFormLists"));
    this.setState({ invitedForms: tempInvList });
  }

  displayPage1() {
    let formsData = this.getData(this.state.forms);
    return (
      <React.Fragment>
        {formsData ? formsData.map((data) => (
          <PageItems
            key={data.formId}
            data={data}
            handleFormUpdate={this.handleFormUpdate}
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
    let invitedFormsData = this.getData(this.state.invitedForms);
    return (
      <React.Fragment>
        {invitedFormsData ? invitedFormsData.map((data) => (
          <PageItems 
            key={data.formId} 
            data={data} 
            handleFormUpdate={this.handleFormUpdate}
            currentPage={2} 
          />
        )) : null}
      </React.Fragment>
    );
  }

  handleSubmit(e) {
    let body = document.getElementById("body");
    e.preventDefault();
    if (this.state.title == "" || this.state.description == "" || this.state.privacySetting == "") {
      this.setState({ isRequired: true }); 
    } else {
      this.setState({ isRequired: false });
      let obj = {};
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
