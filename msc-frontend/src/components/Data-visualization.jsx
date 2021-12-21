import React, { Component } from 'react';
import { Link } from "react-router-dom";
import iconMenubarGrey from "./images/menubarGrey.png";
import iconVisibility from "./images/visibility.png";
import iconSettings from "./images/settings.png";
import Graph from "./functional-components/Graph";

class DataVisualization extends React.Component {

    state = {
        openVisibility: false,
        openSettings: false,
        activePage: 1
    }

    handlePageSelection(pageNumber) {
      this.setState({activePage : pageNumber});
    }

    render() {
      let loadPage = null;
      if (this.state.activePage == 1) {
        loadPage = this.displaySummaryPage();
      } else if (this.state.activePage == 2) {
        loadPage = this.displayResponsePage();
      } else if (this.state.activePage == 3) {
        loadPage = this.displayExportPage();
      }
      return (
        <React.Fragment>
        <div className="title-container">
            <div
                className="menu-icon"
                id="menu-icon">
                <img src={iconMenubarGrey} alt="" />
            </div>
            <div className="page-title" id="page-title-home">
                Data Visualization
            </div>
          <div className="dashboard-icon">
              <img src={iconVisibility} alt="" className="icon-image"/>
              <img src={iconSettings} alt="" className="icon-image"/>
              {this.state.openSettings ? this.displaySettings() : null}
          </div>
        </div>
  
        <div className="data-visualization-container">
            <div className="page-selection">
                <ul>
                    <li onClick={() => {this.handlePageSelection(1)}}>SUMMARY</li>
                    <li onClick={() => {this.handlePageSelection(2)}}>RESPONSES</li>
                    <li onClick={() => {this.handlePageSelection(3)}}>EXPORT</li>
                </ul>
            </div>
            {loadPage}
        </div>
        </React.Fragment>
      );
    }
  
  displaySummaryPage() {
    return (
      <React.Fragment>
      {this.props.formItems_data.map((data) => {
        return (
        <div className="result-container">
          <div className="question-field">
            {data}
          </div>
          <div className="graph-section">
            <div className="graph">
              <Graph />
            </div>
            <div className="sub-graph"></div>
            </div>
          </div>
        );
      })}
      </React.Fragment>
    );
  }

  displayResponsePage() {
  
  }

  displayExportPage() {

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
 
export default DataVisualization;