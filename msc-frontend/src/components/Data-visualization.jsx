import React, { Component, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
  const [activePage, setActivePage] = useState(1);
  const [selectedExport, setSelectionExport] = useState("pdf");
  const [currentStep, setCurrentStep] = useState([]);
  const [inLoading, setInLoading] = useState(true);
  const [itemList, setItemList] = useState([]);
  const [countData, setCountData] = useState([]);
  const [answerList, setAnswerList] = useState([]);
  const [responses, setResponses] = useState([]);
  let componentRef = useRef();
  const { formId } = useParams();

  const exportOptions = [
    { value: "pdf", label: ".pdf" },
    { value: "csv", label: ".csv" },
    { value: "xls", label: ".xls" },
  ];

  function activateLink(item) {
    if(currentStep && currentStep.length > 0){
      let step = [...currentStep];
      if(step.slice(-1)[0] && (step.slice(-1)[0] == "SUMMARY" || step.slice(-1)[0] == "RESPONSES" || step.slice(-1)[0] == "EXPORT")) step.pop();
      step.push({page: item.innerHTML.toLowerCase(), path: window.location.href});
      setCurrentStep(step);
    }
    let listPage = document.querySelectorAll(".sub-page-selection");
    listPage.forEach((i) => {
      i.classList.remove('active');
    });
    item.classList.add('active');
  }

  async function processData() {
    setInLoading(true);
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
          if(!resData || resData.length == 0) return;
          let listOfAnswers = [];
          resData.forEach(ri => {
            let validator = true;
            listOfAnswers.forEach(a => {
              if(a.toLowerCase() === ri.answerSelectionValue.toLowerCase()) validator = false;
            });
            if (validator) listOfAnswers.push(ri.answerSelectionValue);
          });
          tempAnswerList[fi] = listOfAnswers;
          if(count[fi].length === 0){
            for(let i=0; i < listOfAnswers.length; i++){
              if(item.type != "SA"){
                count[fi].push(0);
              }
              else count[fi].push({x: i+1, y: 0, r: 10, title: listOfAnswers[i]});
            }
          } 
          resData.forEach((ri) => {
            listOfAnswers.map((a, idx) => {
              if (ri.answerSelectionValue.toLowerCase() == a.toLowerCase()){
                if(item.type != "SA"){
                  count[fi][idx] += 1;
                }
                else {
                  let prevCount = count[fi][idx];
                  prevCount.y += 1;
                  prevCount.r += 5;
                }
              }
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
  }

  async function processResponses() {
    setInLoading(true);
    let selectedForm = JSON.parse(localStorage.getItem("selectedForm"));
    let listOfFormItems = [];
    let tempResp = [];
    await axios({
      method: "get",
      url: `${BASE_URL}/api/v1/forms/get-form-items/${selectedForm.formId}`
    }).then(async (res) => {
      listOfFormItems = res.data;
    }).finally(() => {
      setItemList(listOfFormItems);
    });
    await axios({
      method: "get",
      url: `${BASE_URL}/api/v1/forms/get-all-resp/${selectedForm.formId}`
    }).then(async (res) => {
      let currentRes = res.data;
      currentRes.map((data) => {
        tempResp.push(data);
      });
    }).finally(() => {
      setResponses(tempResp);
    });
  }

  useEffect(() => {
    props.isAuthor(formId);
    let tempBreadcrumbs = localStorage.getItem("breadcrumbs");
    if(tempBreadcrumbs) tempBreadcrumbs = JSON.parse(localStorage.getItem("breadcrumbs"));
    if(tempBreadcrumbs.length >= 2) {
      while(tempBreadcrumbs.slice(-1)[0] && !(tempBreadcrumbs.slice(-1)[0].page == "Home" || tempBreadcrumbs.slice(-1)[0].page == "/")){
        tempBreadcrumbs.pop();
      }
    }
    let selectedForm = JSON.parse(localStorage.getItem("selectedForm"));
    tempBreadcrumbs.push(
      {
        page: "Data Visualization - " + selectedForm['title'],
        path: window.location.href,
      }
    );
    localStorage.setItem("breadcrumbs", JSON.stringify(tempBreadcrumbs));
    setCurrentStep(tempBreadcrumbs);
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

  useEffect(() => {
    if(responses && inLoading == true)
      setTimeout(() => setInLoading(false), 3000);
  }, [responses])

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
    return (
      <React.Fragment>
        {inLoading ? (<Loading text="Memuat data responden..."/>) : (
          <Responses data={itemList} responses={responses}/>
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
        </div>
        <div className="page-breadcrumbs">
        {
          currentStep.map((b, idx) => {
            if(idx > 0) {
              return (
                <a href={b['path']} key={"bread-" + idx}>
                  <span>{">"}</span>
                  <span>{b['page']}</span>
                </a>
              );
            }
            return (
              <a href={b['path']} key={"bread-" + idx}>{b['page']}</a>
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
                }}
                className="sub-page-selection active"
              >
                SUMMARY
              </li>
              <li
                onClick={(e) => {
                  handlePageSelection(2);
                }}
                className="sub-page-selection"
              >
                RESPONSES
              </li>
              <li
                onClick={(e) => {
                  handlePageSelection(3);
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
