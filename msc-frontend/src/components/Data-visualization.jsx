import React, { Component, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import iconMenubarGrey from "./images/menubarGrey.png";
import iconVisibility from "./images/visibility.png";
import iconSettings from "./images/settings.png";
import Select from "react-select";
import axios from "axios";
import Summary from "./Summary.jsx";
import Responses from "./Responses";
import ReactToPrint from "react-to-print";
import Loading from "./Loading";

const BASE_URL = "http://10.61.38.193:8080";

function DataVisualization(props) {
  const [openMenu, setOpenMenu] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [selectedExport, setSelectionExport] = useState("pdf");
  const [privacyCheck, setPrivacyCheck] = useState(false);
  const [currentStep, setCurrentStep] = useState([]);
  const [inLoading, setInLoading] = useState(true);
  const [itemList, setItemList] = useState([]);
  const [countData, setCountData] = useState([]);
  const [answerList, setAnswerList] = useState([]);
  let componentRef = useRef();

  const exportOptions = [
    { value: "pdf", label: ".pdf" },
    { value: "csv", label: ".csv" },
    { value: "xls", label: ".xls" },
  ];

  function activateLink(item) {
    setInLoading(true);
    let tempBreadcrumbs = localStorage.getItem("breadcrumbs");
    tempBreadcrumbs = JSON.parse(tempBreadcrumbs);
    if(tempBreadcrumbs.length >= 2){
      let selectedForm = JSON.parse(localStorage.getItem("selectedForm"))
      while(tempBreadcrumbs.slice(-1)[0] && tempBreadcrumbs.slice(-1)[0].page != `Data Visualization - ${selectedForm['title']}`){
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

  async function processData() {
    let selectedForm = JSON.parse(localStorage.getItem("selectedForm"));
    let listOfFormItems = [];
    let tempAnswerList = []
    let count = [];
    for(let i; i < listOfFormItems.length; i++) {
      count.push(i);
      tempAnswerList.push(i);
    }
    await axios({
      method: "get",
      url: `${BASE_URL}/api/v1/forms/get-form-items/${selectedForm.formId}`
    }).then((res) => {
      listOfFormItems = res.data;
      for(let i=0; i < listOfFormItems.length; i++) count.push([]);
      listOfFormItems.map(async (item, fi) => {
        await axios({
          method: "get",
          url: `${BASE_URL}/api/v1/forms/get-response/${item.id}`
        }).then((response) => {
          let resData = response.data;
          let listOfAnswers = [];
          resData.forEach(ri => {
            let validator = true;
            listOfAnswers.forEach(a => {
              if(a === ri.answerSelectionValue) validator = false;
            });
            if (validator && item.type != "SA") listOfAnswers.push(ri.answerSelectionValue);
            else if(item.type == "SA") listOfAnswers.push(ri.answerSelectionValue);
          });
          tempAnswerList[fi] = listOfAnswers;
          if(count[fi].length === 0) for(let i=0; i < listOfAnswers.length; i++) count[fi].push(0);
          console.log(count[fi].length);
          if(item.type == "SA") return;
          resData.forEach((ri) => {
            listOfAnswers.map((a, idx) => {
              if (ri.answerSelectionValue == a) count[fi][idx] += 1;
            })
          });
        });
      });
    }).finally(() => {
      setItemList(listOfFormItems);
      setAnswerList(tempAnswerList);
      setCountData(count);
      setTimeout(() => setInLoading(false), 2000);
    });
    return listOfFormItems, count;
  }

  async function processResponses() {
    let selectedForm = JSON.parse(localStorage.getItem("selectedForm"));
    let listOfFormItems = [];
    let responseData = [];
    await axios({
      method: "get",
      url: `${BASE_URL}/api/v1/forms/get-form-items/${selectedForm.formId}`
    }).then((res) => {
      listOfFormItems = res.data;
      listOfFormItems.map(async (item) => {
        await axios({
          method: "get",
          url: `${BASE_URL}/api/v1/forms/get-response/${item.id}`
        }).then((response) => {
          let currentRes = response.data;
          responseData.push(currentRes);
        });
      });
      setTimeout(() => setInLoading(false), 3000);
    });
    return listOfFormItems, responseData;
  }

  useEffect(() => {
    let tempBreadcrumbs = JSON.parse(localStorage.getItem("breadcrumbs"));
    if(tempBreadcrumbs.length >= 2) {
      while(tempBreadcrumbs.slice(-1)[0] && tempBreadcrumbs.slice(-1)[0].page != "Home" && tempBreadcrumbs.slice(-1)[0].page != "/"){
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

  useEffect(() => {
    if (activePage == 1) processData();
    else if (activePage == 2) processResponses();
  }, [activePage]);

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
        {inLoading ? (<Loading text="Memuat data ringkasan..."/>) : (
        <Summary
          ref={componentRef}
          data={itemList}
          answerList={answerList}
          countData={countData}
        />
        )}
      </React.Fragment>
    );
  }

  const displayResponsePage = () => {
    let listOfFormItems, responseData = processResponses();
    return (
      <React.Fragment>
        {inLoading ? (<Loading text="Memuat data responden..."/>) : (
          <Responses data={listOfFormItems} responseData={responseData} />
        )}
      </React.Fragment>
    );
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
