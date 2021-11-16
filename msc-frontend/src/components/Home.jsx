import react from "react";
import React, { Component } from "react";
import { Fragment } from "react";
import Page1Items from "./Page1Items";

class Home extends React.Component {
  state = {
    isPage1: true,
    isAdd: false,
  };

  handleClickPage1() {
    this.setState({ isPage1: true });
  }

  handleClickPage2() {
    this.setState({ isPage1: false });
  }

  handleClickAddItem() {
    this.setState({ isAdd: true });
  }

  handleCloseAddItem() {
    this.setState({ isAdd: false });
  }

  handleClickConfirm() {
    // item1 -> digenerate dari UUID tiap kuesioner, jadi hrusnya {itemUUID}
    this.props.history.push("/item1/dashboard"); // ada passing data g ya
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
          <div className="page-title">Home</div>
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
              <div id="search-box">
                <form className="form-inline">
                  <input
                    className="form-control mr-sm-2"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                  />
                  <button
                    className="btn btn-outline-success my-2 my-sm-0"
                    type="submit"
                  >
                    Search
                  </button>
                </form>
              </div>
              <img src="" alt="" id="history-btn" />
            </div>
          </div>
          <div className="list-container">{page}</div>
        </div>
      </React.Fragment>
    );
  }

  displayPage1() {
    const isAdd = this.state.isAdd;
    let popup;

    if (isAdd) {
      popup = this.displayPopUp();
    }

    return (
      <React.Fragment>
        {this.props.page1_data.map((data) => (
          <Page1Items key={data.id} data={data} />
        ))}
        <div className="item-container">
          <div onClick={() => this.handleClickAddItem()} id="addNewItem">
            <div id="btn-addItem">+</div>
            <div id="btn-addItem2">Add new Item</div>
            {popup}
          </div>
        </div>
      </React.Fragment>
    );
  }

  displayPage2() {
    return (
      <React.Fragment>
        <span>This is page 2.</span>
      </React.Fragment>
    );
  }

  displayPopUp() {
    return (
      <React.Fragment>
        <div className="popup" id="popup-addItem">
          <span
            className="closePopup"
            onClick={() => this.handleCloseAddItem()}
          >
            &times;
          </span>
          <form>
            <h1>Make A New Questionnaire</h1>
            <label>
              Name
              <input type="text" name="name" />
            </label>
            <br />
            <label>
              Description
              <input type="text" name="desc" />
            </label>
            <br />
            <label>
              Respondent Privacy
              <input
                type="radio"
                name="privacy"
                id="anonymous"
                value="anonymous"
              />
              <label for="anonymous">Anonymous</label>
              <input
                type="radio"
                name="privacy"
                id="not-anonymous"
                value="not-anonymous"
              />
              <label for="not-anonymous">Not Anonymous</label>
              <br />
            </label>
            <br />
            <input
              type="submit"
              value="Confirm"
              onClick={() => this.handleClickConfirm()}
            />
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default Home;
