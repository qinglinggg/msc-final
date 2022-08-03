import React, { Component, useEffect, useRef, useState } from "react";
import ReactDOMServer from 'react-dom/server';
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
import html2pdf from "html2pdf.js";
import { scryRenderedComponentsWithType } from "react-dom/test-utils";

const BASE_URL = "http://10.61.42.160:8080";

function DataVisualization(props) {
  const [openMenu, setOpenMenu] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [selectedExport, setSelectedExport] = useState("pdf");
  const [currentStep, setCurrentStep] = useState([]);
  const [inLoading, setInLoading] = useState(true);
  const [itemList, setItemList] = useState([]);
  const [countData, setCountData] = useState([]);
  const [answerList, setAnswerList] = useState([]);
  const [responses, setResponses] = useState([]);
  const [temporarySum, setTemporarySum] = useState();

  const [selectedVersion, setSelectedVersion] = useState(JSON.parse(localStorage.getItem("selectedForm")).versionNo);
  const [changeVersionPopup, setChangeVersionPopup] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [versionOptions, setVersionOptions] = useState([]);

  let componentRef = useRef();
  let renderCount = 0;
  const { formId } = useParams();

  const exportOptions = [
    { value: "pdf", label: ".pdf" },
    { value: "csv", label: ".csv" },
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
      url: `${BASE_URL}/api/v1/forms/get-form-items/${selectedForm.formId}/${selectedVersion}`
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

  useEffect(() => {
    setTemporarySum(displaySummaryPage());
  }, [inLoading]);

  async function processResponses() {
    setInLoading(true);
    let selectedForm = JSON.parse(localStorage.getItem("selectedForm"));
    let listOfFormItems = [];
    let tempResp = [];
    await axios({
      method: "get",
      url: `${BASE_URL}/api/v1/forms/get-form-items/${selectedForm.formId}/${selectedVersion}`
    }).then(async (res) => {
      listOfFormItems = res.data;
    }).finally(() => {
      setItemList(listOfFormItems);
    });
    await axios({
      method: "get",
      url: `${BASE_URL}/api/v1/forms/get-resp/${selectedForm.formId}/${selectedVersion}`
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
    let tempOptions = [];
    for(let i=1; i<=selectedForm.versionNo; i++){
      tempOptions.push({
        value: i,
        label: i
      });
    }
    setVersionOptions(tempOptions);
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
  }, []);

  useEffect(() => {
    if (activePage == 1) processData();
    else if (activePage == 2) processResponses();
    else if(activePage == 3) {
      processData();
      processResponses();
    }
  }, [activePage, selectedVersion]);

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
    setSelectedExport(data.value);
  }

  const displaySummaryPage = () => {
    renderCount = renderCount + 1;
    return (
      <React.Fragment>
        {inLoading ? (<Loading text="Memuat data ringkasan..."/>) : (
        <Summary
          data={itemList}
          answerList={answerList}
          countData={countData}
          renderCount={renderCount}
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

  const generateDocHeader = () => {
    let currentForm = localStorage.getItem("selectedForm");
    if(!currentForm) return;
    currentForm = JSON.parse(currentForm);
    return (
      <React.Fragment>
        <div className="title">Form Results on</div>
        <div className="h1">{currentForm.title}</div>
        <div className="h2">{currentForm.description}</div>
        <div className="doc-separator"/>
      </React.Fragment>
    )
  }

  const displayExportToCSV = () => {
    return (
      <React.Fragment>
        <div className="page-title">Export to CSV</div>
        <button id="export-save-box" onClick={() => {generateCsv()}}>Download CSV</button>
      </React.Fragment>
    )
  }

  const displayExportPage = () => {
    let container = document.getElementById("export-selection-container");
    return (
      <React.Fragment>
        <div id="export-container">
          <div id="export-selection-container">
            <div id="export-selection-text">Export your results in:</div>
            <div id="export-selection-dropdown">
              <Select
                value={exportOptions.map(option => option.value == selectedExport ? option : null)}
                options={exportOptions}
                id="exportSelection"
                onChange={(data) => handleExportSelection(data)}
              />
            </div>
          </div>
          <div style={{width: container ? (container.clientWidth + "px") : "450px", borderBottom: "2px solid gray", marginBottom: "15px"}}/>
          {selectedExport == "pdf" ? displayExportToPdf() : null}
          {selectedExport == "csv" ? displayExportToCSV() : null}
        </div>
      </React.Fragment>
    );
  }

  String.prototype.removeEnd = function() {
    let index = this.length-1;
    return this.substring(0, index);
  }

  const generateCsv = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    let selectedForm = localStorage.getItem("selectedForm");
    if(selectedForm) selectedForm = JSON.parse(selectedForm);
    let str = "";
    itemList.map((item, idx) => {
      str += item.content;
      if(idx < itemList.length - 1) str += ",";
    });
    str += "\n";
    let tempItems = [];
    let strArray = [];
    axios({
      method: "get",
      url: `${BASE_URL}/api/v1/forms/get-form-items/${selectedForm.formId}/${selectedVersion}`
    }).then((res) => {
      if(res.data) res.data.map(data => tempItems.push(data.id));
    }).finally(() => {
      responses.map((resp, outerIdx) => {
        strArray.push([]);
        // tempItems
        tempItems.map((data, innerIdx) => {
          let tempSelections = [];
          // answer Selection
          axios({
            method: "get",
            url: `${BASE_URL}/api/v1/forms/get-answer-selection/${data}`,
          }).then((res2) => {
            if(res2.data) res2.data.map(data2 => {
              tempSelections.push(data2.id);
            });
          }).finally(() => {
            // get responses by id
            let tempPicks = {}
            tempPicks.index = innerIdx;
            tempPicks.value = [];
            tempSelections.map((selection, selIdx) => {
              axios({
                method: "get",
                url: `${BASE_URL}/api/v1/forms/get-responses-by-id/${resp}/`
              }).then((res) => {
                if(!res.data) return;
                let keys = Object.keys(res.data);
                keys.forEach((key) => {
                  if(key == selection) {
                    tempPicks.value.push(res.data[key].answerSelectionValue);
                    return;
                  }
                });
                if(selIdx == tempSelections.length-1) strArray[outerIdx].push(tempPicks);
              }).finally(() => {
                if(outerIdx == responses.length-1 && innerIdx == tempItems.length-1 && selIdx == tempSelections.length-1){
                  setTimeout(() => {
                    // console.log("final results:", strArray);
                    strArray.map(obj => obj.sort((a, b) => {return a.index - b.index}));
                    str += strArray.map(e => e.map(e1 => e1.value.join(";")).join(',')).join('\n');
                    // console.log("To string joins:", str);
                    csvContent += str;
                    let encodedURI = encodeURI(csvContent);
                    window.open(encodedURI);
                  }, 3000);
                }
              });
            });
            // get responses by id
          });
          // answer Selection
        });
        // tempItems
      });
    });
  }

  const generatePdf = () => {
    let worker = html2pdf();
    let currentForm = localStorage.getItem("selectedForm");
    if (currentForm) currentForm = JSON.parse(currentForm);
    let elementToPrint = document.createElement('div');
    elementToPrint.setAttribute("class", "doc-to-print");
    elementToPrint.innerHTML = `
      <div id="doc-header">
        <div className="title" style="font-size: 20px;">Form Results on</div>
        <div className="h1" style="font-size: 40px; font-weight: 500;">${currentForm.title}</div>
        <div className="h2" style="font-weight: 300; font-size: 20px; font-style: italic;">${currentForm.description}</div>
        <div className="doc-separator" style="height: 20px;width: 100%;border-bottom: 2px dotted black;"/>
      </div>
    `;
    let structure = document.getElementById("preview");
    let resultContainer = structure.querySelectorAll('.result-container');
    resultContainer.forEach((item, idx) => {
      let field = item.querySelector(".question-field");
      let section = item.querySelector(".sub-graph");
      let graph = document.getElementById("graph-"+(idx+1));
      // elementToPrint.appendChild(copyCanvas(graph));
      let graph_url = "";
      if(graph) {
        graph.style.maxWidth = "500px";
        graph.style.width = "500px";
        graph.style.maxHeight = "300px";
        graph.style.height = "300px";
        graph_url = graph.toDataURL("image/png", 100);
      }
      elementToPrint.innerHTML += `
      <div class="result-container" style="width: 80%;height: fit-content; padding: 15px 15px 0 15px; border: .5px solid gray; margin: 15px; border-radius: 15px; align-self: center">
        <div class="question-field" style="width: 100%;font-size: 20px;color: black;">
          ${field.innerHTML}
        </div>
        <div class="graph-section" style="width: 100%;height: fit-content;font-size: 15px;color: black;display: flex;flex-direction: row; align-items: center; justify-content: center;">
          <img src=${graph_url} style="max-width: 50%; height: auto; width: 500px; display: flex; align-items: center; justify-content: center;"></img>
          <div class="sub-graph" style="width: 50%; display: flex; align-items: center; justify-content: center; color: black;">${section ? section.innerHTML : "No responses yet."}</div>
        </div>
      </div>
      `;
      graph.style.maxWidth = "50%";
      graph.style.maxHeight = "150px";
    });
    setTimeout(() => {
      worker.from(elementToPrint).toPdf().set({
        margin: [0, 0, 0, 0],
        filename: `[Form Results] - ${currentForm.title}.pdf`,
        pageBreak: { mode: 'css'},
        jsPDF: { orientation: 'portrait', format: 'a4'}
      }).save();
    }, 2000);
  }

  const displayExportToPdf = () => {
    return (
      <React.Fragment>
        <div className="page-title">Export to PDF</div>
        <div id="preview-box">
          <div id="preview">
            <div id="doc-header">
              {generateDocHeader()}
            </div>
            {temporarySum}
          </div>
          <span>Format size: A4 (1.4:1)</span>
        </div>
        <button id="export-save-box" onClick={() => generatePdf()}>
          Download PDF
        </button>
      </React.Fragment>
    );
  }

  const displayDataVisualization = () => {
    let loadPage = null;
    if (activePage == 1) {
      loadPage = temporarySum;
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
        <div className="has-response-container">
          <span>Please choose your preferred version:</span>
          <Select
            styles={{
              control: base => ({
                ...base,
                border: 0,
                borderBottom: '1px solid gray',
                borderRadius: 0,
                boxShadow: 'none',
                backgroundColor: 'transparent'
              })
            }}
            options={versionOptions}
            value={versionOptions.map((option) => option.value == selectedVersion ? option : null)}
            id="selected-version"
            onChange={(e) => setSelectedVersion(e.value)}
          />
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
