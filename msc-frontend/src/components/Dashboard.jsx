import react, { createRef, Fragment, useEffect, useState } from "react";
import React, { Component } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Question from "./Question";
import iconMenubarGrey from "./images/menubarGrey.png";
import iconVisibility from "./images/visibility.png";
import iconInvisible from './images/visibility2.png';
import iconSettings from "./images/settings.png";
import Respondent from "./Respondent";
import Loading from "./Loading";
import DateTimeService from "./functional-components/services/DateTimeService";

const BASE_URL = "http://10.61.38.193:8081";
function Dashboard(props) {
  const [showTutorial, setShowTutorial] = useState(false);
  const [openVisibility, setOpenVisibility] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [updated, setUpdated] = useState([])
  const [formItems, setFormItems] = useState([]);
  const [optionCheck, setOptionCheck] = useState(false);
  const { formId } = useParams();
  const [currentStep, setCurrentStep] = useState([]);
  const [openSettings, setOpenSettings] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [privacyCheck, setPrivacyCheck] = useState(false);
  const [lastEdited, setLastEdited] = useState({});
  const [intervalObj, setIntervalObj] = useState([]);

  useEffect(() => {
    console.log("dashboard mounted");
    localStorage.setItem("formLength", JSON.stringify(0));
    props.isAuthor(formId);
    props.handleUpdateCurrentPage(formId);
    let body = document.getElementById("body");
    let menuBtn = document.getElementById("menu-icon");
    menuBtn.addEventListener("click", () => {
      body.classList.toggle("openMenu");
    });
    try { 
      axios({
        method: "get",
        url: `${BASE_URL}/api/v1/forms/${formId}`
      }).then((res) => {
          if(!res.data) return;
          setTitle(res.data.title);
          setDescription(res.data.description);
          setPrivacyCheck(res.data.privacyCheck);
          let tempBreadcrumbs = localStorage.getItem("breadcrumbs");
          tempBreadcrumbs = JSON.parse(tempBreadcrumbs);
          if(tempBreadcrumbs.length >= 2) {
            while(tempBreadcrumbs.slice(-1)[0] && !(tempBreadcrumbs.slice(-1)[0].page == "Home" || tempBreadcrumbs.slice(-1)[0].page == "/")){
              tempBreadcrumbs.pop();
            }
          }
          let selectedForm = res.data;
          if(tempBreadcrumbs){
            tempBreadcrumbs.push({page: "Dashboard - " + selectedForm['title'], path: window.location.href});
            setCurrentStep(tempBreadcrumbs);
            localStorage.setItem("breadcrumbs", JSON.stringify(tempBreadcrumbs));
          }
      });
    } catch (error) {
      console.log(error);
    }
    getFormItems();
    getLastEdited();
    let checkTutorial = localStorage.getItem("showTutorial");
    if(!checkTutorial) {
      setShowTutorial(true);
    }
    let el = document.querySelectorAll("#loading-transition");
    if (el) {
      el.forEach((i) => {
        i.classList.add("loading-transition-onload");
        i.addEventListener('webkitAnimationEnd', () => {
          i.classList.remove("loading-transition-onload");
          i.classList.add("loading-transition-done");
        });
      });
    }
  }, []); // run once

  const getLastEdited = async () => {
    let prevLastEdited = lastEdited;
    let lastEditedTable = {
      formAuthorId: "",
      userFullname: "",
      modifyDate: ""
    }
    let flag = false;
    await axios({
      method: "get",
      url: `${BASE_URL}/api/v1/forms/get-last-edited/${formId}`
    }).then((res) => {
      if(!res.data) return;
      if(prevLastEdited.modifyDate == res.data.modifyDate){
        flag = true;
        return;
      } 
      lastEditedTable.formAuthorId = res.data.formAuthorId;
      lastEditedTable.modifyDate = res.data.modifyDate;
    }).finally(async () => {
      if(flag) return;
      await axios({
        method: "get",
        url: `${BASE_URL}/api/v1/user-profiles/${lastEditedTable.formAuthorId}`
      }).then((res) => {
        if(res.data) lastEditedTable.userFullname = res.data.fullname;
      }).finally(() => {
        if(flag) return;
        const convertedDateTime = DateTimeService("convertToDateTime", lastEditedTable.modifyDate);
        let text = "Last edited: " + convertedDateTime.date + " at " + convertedDateTime.time + " by " + lastEditedTable.userFullname;
        let lastEditedObj = {
          modifyDate: lastEditedTable.modifyDate,
          text: text
        }
        setLastEdited(lastEditedObj);
      })
    })
  }

  const getFormItems = () => {
    axios({
      method: "get",
      url: `${BASE_URL}/api/v1/forms/get-form-items/${formId}`,
    }).then((res) => {
      let currentLength = localStorage.getItem("formLength");
      if(!currentLength) currentLength = 0;
      else currentLength = JSON.parse(currentLength);
      if(res.data.length == currentLength) return;
      console.log("currentLength: ", currentLength, " res.data.length: ", res.data.length);
      let tempItems = [];
      res.data.map((newData) => {
        let newItem = {
          id: newData.id,
          itemNumber: newData.itemNumber,
          questionContent: newData.content,
          questionType: newData.type,
          isRequired: newData.isRequired
        };
        tempItems.push(newItem);
      });
      console.log("form update");
      localStorage.setItem("formLength", JSON.stringify(tempItems.length));
      setFormItems(tempItems);
    });
  }

  useEffect(() => {
    if(!isLoaded) return;
    let el = document.querySelectorAll("#loading-transition");
    el.forEach((i) => {
      if(i.classList.contains("loading-transition-onload")) {
        i.style.animation = "done-trans 2s forwards"
      }
    });
  }, [isLoaded])

  useEffect(() => {
    if(!formItems || formItems.length == 0) return;
    let updateArray = [];
    for(let i=0; i<formItems.length; i++) updateArray.push(false);
    setUpdated(updateArray);
    // removeInterval();
  }, [formItems]);

  // useEffect(() => {
  //   if(intervalObj.length != 0) return;
  //   let currentInterval = [...intervalObj];
  //   // let interval = setInterval(() => {
  //     getFormItems();
  //   // }, 500);
  //   currentInterval.push(interval);
  //   setIntervalObj(currentInterval);
  // }, [intervalObj]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     console.log("useeffect jalan")
  //     getFormItems();
  //     setFlag(!flag);
  //   }, 500);
  // });

  useEffect(() => {
    if(!updated || updated.length != formItems.length) return;
    let validator = true;
    updated.forEach((upd) => {
      if(upd == true) {
        validator = false;
        return;
      }
    })
    if (validator) setTimeout(() => setIsLoaded(true), 2000);
  }, [updated]);

  useEffect(() => {
    let body = document.getElementById("body");
    let closePopup = document.querySelector(".closePopup");
    if(openSettings == false){
        body.classList.remove("openPopup");
    } else {
      body.classList.add("openPopup");
    }
  }, [openSettings])

  const handleVisibility = () => {
    setOpenVisibility(!openVisibility);
  };

  const handleSettings = () => {
    setOpenSettings(!openSettings);
  };

  const validateInput = (event) => {
    if (event.target.value.length > 0) {
      return true;
    }
  };

  const handleOptionChecked = () => {
    setOptionCheck(!optionCheck);
  };

  const handleUpdatedList = (idx, value) => {
    let tempUpdated = [...updated];
    tempUpdated[idx] = value;
    setUpdated(tempUpdated);
  }

  const handleUpdateLastEdited = () => {
    let selectedForm = JSON.parse(localStorage.getItem("selectedForm"));
    props.updateLastEdited(selectedForm);
  } 

  const handleAddItem = () => {
    let currentStateData = [...formItems];
    let formItemId;
    try {
      let newItem = {
        itemNumber: -1,
        questionContent: "",
        questionType: "MC"
      };
      axios({
        method: "post",
        url: `${BASE_URL}/api/v1/forms/add-form-items/${formId}`,
        data: newItem,
        headers: { "Content-Type": "application/json" },
      }).then((res) => {
        newItem = {
          id: res.data.id,
          itemNumber: res.data.itemNumber,
          questionContent: res.data.content,
          questionType: res.data.type
        };
        currentStateData.push(newItem);
        formItemId = res.data.id;
      }).finally(() => {
        setFormItems(currentStateData);
        handleUpdateLastEdited();
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveItem = (deletedQuestionId) => {
    let tempFormItems = [...formItems];
    let newFormItems = tempFormItems.filter((element) => {
      return element.id != deletedQuestionId;
    });
    try {
      axios({
        method: "delete",
        url: `${BASE_URL}/api/v1/forms/remove-form-items/${deletedQuestionId}`,
      }).then((res) => {
        setFormItems(newFormItems);
        handleUpdateLastEdited();
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateQuestionInput = (questionId, event) => {
    let tempFormItems = [...formItems];
    let currentForm = tempFormItems.filter((elem) => {
      return elem.id == questionId;
    });
    currentForm = currentForm[0];
    currentForm["questionContent"] = event.target.value;
    tempFormItems = tempFormItems.map((elem) => {
      if (questionId == elem.id) {
        return currentForm;
      }
      return elem;
    });
    try {
      axios({
        method: "put",
        url: `${BASE_URL}/api/v1/forms/update-form-items/${questionId}`,
        data: currentForm,
        headers: { "Content-Type": "application/json" },
      }).then((res) => {
        setFormItems(tempFormItems);
        handleUpdateLastEdited();
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateQuestionType = (questionId, event) => {
    let tempFormItems = [...formItems];
    let currentForm = tempFormItems.filter((elem) => {
      return elem.id == questionId;
    });
    currentForm = currentForm[0];
    currentForm["questionType"] = event.value;
    tempFormItems = tempFormItems.map((elem) => {
      if (questionId == elem.id) {
        return currentForm;
      }
      return elem;
    });
    console.log(currentForm);
    try {
      axios({
        method: "put",
        url: `${BASE_URL}/api/v1/forms/update-form-items/${questionId}`,
        data: currentForm,
        headers: { "Content-Type": "application/json" },
      }).then((res) => {
        setFormItems(tempFormItems);
        handleUpdateLastEdited();
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateQuestionIsRequired = (questionId, value) => {
    let tempFormItems = [...formItems];
    let currentForm = tempFormItems.filter((elem) => {
      return elem.id == questionId;
    })
    currentForm = currentForm[0];
    currentForm["isRequired"] = value;
    tempFormItems = tempFormItems.map((elem) => {
      if(elem.id == questionId){
        return currentForm;
      }
      return elem;
    })
    try {
      axios({
        method: "put",
        data: currentForm,
        url: `${BASE_URL}/api/v1/forms/update-form-items/${questionId}`,
        headers: { "Content-Type": "application/json" },
      }).then((res) => {
        setFormItems(tempFormItems);
        handleUpdateLastEdited();
      })
    } catch(error) {
      console.log(error);
    }
  };

  const removeInterval = () => {
    intervalObj.map((value) => clearInterval(value));
    setIntervalObj([]);
  }

  const displayQuestion = () => {
    return (
      <React.Fragment>
        <div id="loading-transition">{isLoaded ? null : "Loading your contents..."}</div>
        {formItems ? formItems.map((res, idx) => {
          return (
            <React.Fragment key={"questionItem-" + res.id}>
              <div className="separator" />
              <div className="question">
                <Question
                  key={"questionInner-" + res.id}
                  formItems={formItems}
                  questionData={res}
                  mode={true}
                  onRemove={handleRemoveItem}
                  handleUpdatedList={handleUpdatedList}
                  handleUpdateQuestionInput={handleUpdateQuestionInput}
                  handleUpdateQuestionType={handleUpdateQuestionType}
                  handleUpdateQuestionIsRequired={handleUpdateQuestionIsRequired}
                  handleUpdateLastEdited={handleUpdateLastEdited}
                />
              </div>
            </React.Fragment>
          )
        }) : null}
        <div className="separator" />
        <div
          className="question"
          id="addQuestion"
          onClick={() => handleAddItem()}
        >
          <Question mode={false} key={"addItems"}/>
        </div>
      </React.Fragment>
    );
  };

  const updateForm = () => {
    let selectedForm = JSON.parse(localStorage.getItem("selectedForm"));
    selectedForm.title = document.getElementById("input-title").value;
    selectedForm.description = document.getElementById("input-desc").value;
    selectedForm.privacySetting = privacyCheck;
    try {
      axios({
        method: "put",
        data: selectedForm,
        url: `${BASE_URL}/api/v1/forms/${formId}`
      }).then((res) => {
        localStorage.setItem("selectedForm", JSON.stringify(selectedForm));
      }).finally(() => {
        handleUpdateLastEdited();
      })
    } catch(error) {
      console.log(error);
    }
    
  }

  const displaySettings = () => {
    let selectedForm = JSON.parse(localStorage.getItem("selectedForm"));
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
              <input className="form-alignright" 
                id="input-title" 
                type="text" 
                name="name" 
                value={title}
                onChange={(e) => setTitle(e.value)}
              />
            </label>
            <br />
            <br />
            <label>
              Description
              <input className="form-alignright" 
                id="input-desc" 
                type="text" 
                name="desc" 
                value={description}
                onChange={(e) => setDescription(e.value)}
              />
            </label>
            <br />
            <br />
            <label>
              Respondent Privacy
              <div className="form-alignright">
                <div>
                  <input
                    type="radio"
                    name="privacy"
                    id="anonymous"
                    value="anonymous"
                    checked={privacyCheck ? true : false}
                    onClick={() => {
                      setPrivacyCheck(!privacyCheck);
                    }}
                  />
                  <label for="anonymous">Anonymous</label>
                </div>
                <div>
                  <input
                    type="radio"
                    name="privacy"
                    id="not-anonymous"
                    value="not-anonymous"
                    checked={privacyCheck ? false : true}
                    onClick={() => {
                      setPrivacyCheck(!privacyCheck);
                    }}
                  />
                  <label for="not-anonymous">Not Anonymous</label>
                </div>
                <br />
              </div>
              <br />
            </label>
            <br />
            <br />
            <div 
              className="button"
              onClick={() => {
                updateForm();
                handleSettings();
              }}
            >
              <Link 
                to={`/dashboard/formId/${formId}`}
                id="confirm-button"
              >
                Confirm
              </Link>
            </div>
          </form>
        </div>
      </React.Fragment>
    );
  };

  const displayPreview = () => {
    return (
      <Respondent
        previewMode={true}
      />
    )
  }

  const displayDashboard = () => {
    return (
      <React.Fragment>
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
        <div id="page-content">
          <div className="questions-container">
            {displayQuestion()}
          </div>
        </div>
      </React.Fragment>
    );
  }

  const handleShowTutorial = () => {
    localStorage.setItem("showTutorial", JSON.stringify(true));
    setShowTutorial(false);
  }

  const displayTutorial = () => {
    return (
      <React.Fragment>
        <div className="tutorial-container">
          <div className="icon-background">
            <ion-icon name="stop-outline"></ion-icon>
            <ion-icon name="stop-outline"></ion-icon>
            <ion-icon name="stop-outline"></ion-icon>
          </div>
          <div className="icon-tutorial">
            <ion-icon name="navigate-outline"></ion-icon>
          </div>
          <div className="desc-tutorial">
            <span>Navigate between items using shift + mouse scroll.</span>
          </div>
          <div className="btn-container-tutorial">
            <button className="btn-tutorial" onClick={() => handleShowTutorial()}>
              <ion-icon name="arrow-forward-outline"></ion-icon>
            </button>
          </div>
        </div>
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      { showTutorial ? displayTutorial() : null }
      <div className="title-container">
        <div className="menu-icon" id="menu-icon">
          <img id="menu-icon-img" src={iconMenubarGrey} alt="" />
        </div>
        <div className="page-title" id="page-title-home">
          {openVisibility? "Preview" : "Dashboard"}
        </div>
        <div className="dashboard-icon">
          <img
            className="icon-image"
            onClick={() => handleVisibility()}
            src={openVisibility ? iconInvisible : iconVisibility}
            alt=""
          />
          <img
            className="icon-image"
            id="icon-settings"
            onClick={() => handleSettings()}
            src={iconSettings}
            alt=""
          />
          {openSettings ? displaySettings() : null}
        </div>
      </div>
      {openVisibility ? displayPreview() : displayDashboard()}
    </React.Fragment>
  );
}

export default Dashboard;
