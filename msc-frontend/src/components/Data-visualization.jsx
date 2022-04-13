import React, { Component, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import iconMenubarGrey from "./images/menubarGrey.png";
import iconVisibility from "./images/visibility.png";
import iconSettings from "./images/settings.png";
import Select from "react-select";
import Summary from "./Summary.jsx";
import Responses from "./Responses.jsx";
import ReactToPrint from "react-to-print";

function DataVisualization(props) {
  const [formItems, setFormItems] = useState(props.formItems_data);
  const [openMenu, setOpenMenu] = useState(false);
  const [openVisibility, setOpenVisibility] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [selectedExport, setSelectionExport] = useState("pdf");
  const [summaryRef, setSummaryRef] = useState(null);
  const [summaryPage, setSummaryPage] = useState(null);
  const [privacyCheck, setPrivacyCheck] = useState(false);
  const [currentStep, setCurrentStep] = useState([]);
  let componentRef = useRef();

  const exportOptions = [
    { value: "pdf", label: ".pdf" },
    { value: "csv", label: ".csv" },
    { value: "xls", label: ".xls" },
  ];

  function activateLink(item) {
    let tempBreadcrumbs = localStorage.getItem("breadcrumbs");
    tempBreadcrumbs = JSON.parse(tempBreadcrumbs);
    if(tempBreadcrumbs.length >= 2){
      let selectedForm = JSON.parse(localStorage.getItem("selectedForm"))
      while(tempBreadcrumbs.slice(-1)[0].page != `Data Visualization - ${selectedForm['title']}`){
        tempBreadcrumbs.pop();
      }
    }
    tempBreadcrumbs.push(
      {
        page: item.innerText,
        path: window.location.href
      }
    );
    setCurrentStep(tempBreadcrumbs);
    localStorage.setItem("breadcrumbs", JSON.stringify(tempBreadcrumbs));
    let listPage = document.querySelectorAll(".sub-page-selection");
    listPage.forEach((i) => {
      i.classList.remove('active');
    });
    item.classList.add('active');
  }

  useEffect(() => {
    let tempBreadcrumbs = JSON.parse(localStorage.getItem("breadcrumbs"));
    if(tempBreadcrumbs.length >= 2) {
      while(tempBreadcrumbs.slice(-1)[0].page != "Home" && tempBreadcrumbs.slice(-1)[0].page != "/"){
        tempBreadcrumbs.pop();
      }
    }
    let selectedForm = JSON.parse(localStorage.getItem("selectedForm"));
    tempBreadcrumbs.push(
      {
        page: "Data Visualization - " + selectedForm['title'],
        path: window.location.href,
      }
    )
    setCurrentStep(tempBreadcrumbs);
    localStorage.setItem("breadcrumbs", JSON.stringify(tempBreadcrumbs));
    let body = document.getElementById("body");
    let menuBtn = document.getElementById("menu-icon");
    menuBtn.addEventListener("click", () => {
      body.classList.toggle("openMenu");
    });
    let listPage = document.querySelectorAll(".sub-page-selection");
    if (listPage){
      listPage.forEach((item) => {
        item.addEventListener('click', (e) => activateLink(e.target));
      });
    }
  }, [])

  const handleSettings = () => {
    setOpenSettings(!openSettings);
  }

  const handleMenu = () => {
    setOpenMenu(!openMenu);
  }

  const handlePageSelection = (pageNumber) => {
    setActivePage(pageNumber)
  }

  const handleExportSelection = (data) => {
    setSelectionExport(data.value);
  }

  const displaySummaryPage = () => {
    return (
      <React.Fragment>
        <Summary
          ref={componentRef}
          formItems_data={props.formItems_data}
        />
      </React.Fragment>
    );
  }

  const displayResponsePage = () => {
    return <Responses formItems_data={props.formItems_data} />;
  }

  const displayExportPage = () => {
    let button;
    if (selectedExport == "pdf") {
      button = displayExportToPdf();
    }
    return (
      <React.Fragment>
        <div id="export-container">
          <div id="export-selection-container">
            <div id="export-selection-text">Export your results in:</div>
            <div id="export-selection-dropdown">
              <Select
                value={exportOptions.value}
                options={exportOptions}
                defaultValue={exportOptions[0]}
                id="exportSelection"
                onChange={(data) => handleExportSelection(data)}
              />
            </div>
          </div>
          {button}
        </div>
      </React.Fragment>
    );
  }

  const displayExportToPdf = () => {
    return (
      <React.Fragment>
        <div className="preview-box">
          <div className="preview" ref={ref => componentRef = ref} >
            <Summary formItems_data={props.formItems_data}  />
          </div>
        </div>
        <ReactToPrint
          content={() => componentRef}
          trigger={() => (
            <div id="export-save-box">
              <div id="export-save-button">SAVE</div>
            </div>
          )}
        />
      </React.Fragment>
    );
  }

  const displaySettings = () => {
    return (
      <React.Fragment>
        <div className="popup" id="popup-addItem">
          <span className="closePopup" onClick={() => handleSettings()}>
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
                  checked={privacyCheck ? true : false}
                  onClick={() => {
                    setPrivacyCheck(true);
                  }}
                />
                <label for="anonymous">Anonymous</label>
                <input
                  type="radio"
                  name="privacy"
                  id="not-anonymous"
                  value="not-anonymous"
                  checked={privacyCheck ? false : true}
                  onClick={() => {
                    setPrivacyCheck(false);
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

  const displayDataVisualization = () => {
    let loadPage = null;
    if (activePage == 1) {
      loadPage = displaySummaryPage();
    } else if (activePage == 2) {
      loadPage = displayResponsePage();
    } else if (activePage == 3) {
      loadPage = displayExportPage();
    }
    return (
      <React.Fragment>
        <div className="title-container">
          <div
            className="menu-icon"
            id="menu-icon"
            onClick={() => handleMenu()}
          >
            <img src={iconMenubarGrey} alt="" />
          </div>
          <div className="page-title" id="page-title-home">
            Data Visualization
          </div>
          <div className="dashboard-icon">
            <img src={iconVisibility} alt="" className="icon-image" />
            <img src={iconSettings} alt="" className="icon-image" />
            {openSettings ? displaySettings() : null}
          </div>
        </div>
        <div className="page-breadcrumbs">
        {
          currentStep.map((b, idx) => {
            if(idx > 0) {
              return (
                <a href={b['path']}>
                  <span>{">"}</span>
                  <span>{b['page']}</span>
                </a>
              );
            }
            return (
              <a href={b['path']}>{b['page']}</a>
            );
          })
        }
        </div>
        <div className="data-visualization-container">
          <div className="page-selection">
            <ul>
              <li
                onClick={(e) => {
                  handlePageSelection(1);
                  activateLink(e.target);
                }}
                className="sub-page-selection active"
              >
                SUMMARY
              </li>
              <li
                onClick={(e) => {
                  handlePageSelection(2);
                  activateLink(e.target);
                }}
                className="sub-page-selection"
              >
                RESPONSES
              </li>
              <li
                onClick={(e) => {
                  handlePageSelection(3);
                  activateLink(e.target);
                }}
                className="sub-page-selection"
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

  return displayDataVisualization();
}

export default DataVisualization;
