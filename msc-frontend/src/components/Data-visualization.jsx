import React, { Component } from "react";
import { Link } from "react-router-dom";
import iconMenubarGrey from "./images/menubarGrey.png";
import iconVisibility from "./images/visibility.png";
import iconSettings from "./images/settings.png";
import Select from "react-select";
import Summary from "./Summary.jsx";
import Responses from "./Responses.jsx";
import ReactToPrint from "react-to-print";

class DataVisualization extends React.Component {
  constructor(props) {
    super(props);
    this.handleMenu = this.handleMenu.bind(this);
    this.handlePageSelection = this.handlePageSelection.bind(this);
    this.handleExportSelection = this.handleExportSelection.bind(this);
    this.displayExportToPdf = this.displayExportToPdf.bind(this);
  }
  state = {
    openMenu: false,
    openVisibility: false,
    openSettings: false,
    activePage: 1,
    selectedExportOptions: "pdf",
    summaryRef: null,
    summaryPage: null,
  };

  exportOptions = [
    { value: "pdf", label: ".pdf" },
    { value: "csv", label: ".csv" },
    { value: "xls", label: ".xls" },
  ];

  componentDidMount() {

    let breadcrumbs = this.state.breadcrumbs;
    breadcrumbs.push(
      {
        // simpen currentformdata
        page: "formId",
      },
      {
        page: "Data Visualization",
        // path: `${BASE_URL}/design/formId/:formId`,
        path: `item1/show-results`,
      }
    )
    this.setState({breadcrumbs});

    this.setState({ formItems: this.props.formItems_data });
    let body = document.getElementById("body");
    let menuBtn = document.getElementById("menu-icon");
    menuBtn.addEventListener("click", () => {
      body.classList.toggle("openMenu");
    });
  }

  handleMenu() {
    this.setState({ openMenu: !this.state.openMenu });
  }

  handlePageSelection(pageNumber) {
    this.setState({ activePage: pageNumber });
  }

  handleExportSelection(data) {
    this.setState({ selectedExportOptions: data.value });
  }

  render() {
    console.log("masuk");
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
            id="menu-icon"
            onClick={() => this.handleMenu()}
          >
            <img src={iconMenubarGrey} alt="" />
          </div>
          <div className="page-title" id="page-title-home">
            Data Visualization
          </div>
          <div className="dashboard-icon">
            <img src={iconVisibility} alt="" className="icon-image" />
            <img src={iconSettings} alt="" className="icon-image" />
            {this.state.openSettings ? this.displaySettings() : null}
          </div>
        </div>
        <div className="data-visualization-container">
          <div className="page-selection">
            <ul>
              <li
                onClick={() => {
                  this.handlePageSelection(1);
                }}
              >
                SUMMARY
              </li>
              <li
                onClick={() => {
                  this.handlePageSelection(2);
                }}
              >
                RESPONSES
              </li>
              <li
                onClick={() => {
                  this.handlePageSelection(3);
                }}
              >
                EXPORT
              </li>
            </ul>
          </div>
          {loadPage}
        </div>
      </React.Fragment>
    );
  }

  displaySummaryPage() {
    console.log(this.props.formItems_data);
    return (
      <React.Fragment>
        <Summary
          ref={(ref) => (this.componentRef = ref)}
          formItems_data={this.props.formItems_data}
        />
      </React.Fragment>
    );
  }

  displayResponsePage() {
    return <Responses formItems_data={this.props.formItems_data} />;
  }

  displayExportPage() {
    let button;
    if (this.state.selectedExportOptions == "pdf") {
      button = this.displayExportToPdf();
    }
    return (
      <React.Fragment>
        <div id="export-container">
          <div id="export-selection-container">
            <div id="export-selection-text">Export your results in:</div>
            <div id="export-selection-dropdown">
              <Select
                value={this.exportOptions.value}
                options={this.exportOptions}
                defaultValue={this.exportOptions[0]}
                id="exportSelection"
                onChange={(data) => this.handleExportSelection(data)}
              />
            </div>
          </div>
          {button}
        </div>
      </React.Fragment>
    );
  }

  displayExportToPdf() {
    return (
      <React.Fragment>
        <div className="preview-box">
          <div className="preview" ref={(ref) => (this.componentRef = ref)}>
            <Summary formItems_data={this.props.formItems_data} />
          </div>
        </div>
        <ReactToPrint
          content={() => this.componentRef}
          trigger={() => (
            <div id="export-save-box">
              <div id="export-save-button">SAVE</div>
            </div>
          )}
        />
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

export default DataVisualization;
