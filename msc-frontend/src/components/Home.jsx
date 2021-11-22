import react from "react";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Fragment } from "react";
import Page1Items from "./Page1Items";
import Dashboard from "./Dashboard";

class Home extends React.Component {
  constructor() {
    super();
    this.handleAddItem = this.handleAddItem.bind(this);
  }

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

  handleAddItem() {
    this.setState({ isAdd: !this.state.isAdd });
  }

  // handleClickConfirm() {
  //   // item1 -> digenerate dari UUID tiap kuesioner, jadi hrusnya {itemUUID}
  //   const navigateTo = useNavigate().push("/item1/dashboard"); // ada passing data g ya
  // }

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
    // const isAdd = this.state.isAdd;
    // let popup;

    // if (isAdd) {
    //   popup = this.displayPopUp();
    // }

    return (
      <React.Fragment>
        {this.props.page1_data.map((data) => (
          <Page1Items key={data.id} data={data} />
        ))}
        <div className="item-container">
          <div className="addNewItem" onClick={() => this.handleAddItem()}>
            <div id="btn-addItem">+</div>
            <div id="btn-addItem2">Add new Item</div>
            {this.state.isAdd ? this.displayPopUp() : null}
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
          <span className="closePopup" onClick={() => this.handleAddItem()}>
            &times;
          </span>
          <form className="form-components">
            <h1>Make A New Questionnaire</h1>
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

export default Home;
