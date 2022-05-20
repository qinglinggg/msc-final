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

const BASE_URL = "http://10.61.38.193:8080";

function Dashboard(props) {
  const [testing, setTesting] = useState(false);
  const [openVisibility, setOpenVisibility] = useState(false);
  
  const [formItems, setFormItems] = useState([]);
  const [optionCheck, setOptionCheck] = useState(false);
  const [formCounter, setFormCounter] = useState(0);
  const [timeout, setTimeout] = useState(0);
  const { formId } = useParams();
  const [currentStep, setCurrentStep] = useState([]);

  const [openSettings, setOpenSettings] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [privacyCheck, setPrivacyCheck] = useState(false);

  useEffect(() => {
    // console.log("Test Form Id: " + formId);
    props.handleUpdateCurrentPage(formId);
    let body = document.getElementById("body");
    let menuBtn = document.getElementById("menu-icon");
    menuBtn.addEventListener("click", () => {
      body.classList.toggle("openMenu");
    });
    let loadData = JSON.parse(
      localStorage.getItem("formLists")
    );
    loadData.map((data) => {
      if (data.formId == formId) {
        localStorage.setItem("selectedForm", JSON.stringify(data));
        return data;
      }
    });
    let tempBreadcrumbs = localStorage.getItem("breadcrumbs");
    tempBreadcrumbs = JSON.parse(tempBreadcrumbs);
    if(tempBreadcrumbs.length >= 2) {
      while(tempBreadcrumbs.slice(-1)[0] && tempBreadcrumbs.slice(-1)[0].page != "Home" && tempBreadcrumbs.slice(-1)[0].page != "/"){
        tempBreadcrumbs.pop();
      }
    }
    let selectedForm = JSON.parse(localStorage.getItem("selectedForm"));
    setTitle(selectedForm.title);
    setDescription(selectedForm.description);
    setPrivacyCheck(selectedForm.privacyCheck);
    tempBreadcrumbs.push({page: "Dashboard - " + selectedForm['title'], path: window.location.href});
    setCurrentStep(tempBreadcrumbs);
    localStorage.setItem("breadcrumbs", JSON.stringify(tempBreadcrumbs));
    try {
      axios({
        method: "get",
        url: `${BASE_URL}/api/v1/forms/get-form-items/${formId}`,
      }).then((res) => {
        let currentStateData = [...formItems];
        res.data.map((data) => {
          let newItem = {
            id: data.id,
            itemNumber: data.itemNumber,
            questionContent: data.content,
            questionType: data.type,
            arrayOptions: [],
            optionCounter: 0,
            isRequired: data.isRequired
          };
          currentStateData.push(newItem);
        });
        setFormItems(currentStateData);
      });
    } catch (error) {
      console.log(error);
    }
  }, []); // run once

  useEffect(() => {
    let body = document.getElementById("body");
    let closePopup = document.querySelector(".closePopup");
    if(openSettings == false){
      // if(closePopup) {
        body.classList.remove("openPopup");
      // }
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
    // if (document.form.question.value == "") return null;
    if (event.target.value.length > 0) {
      return true;
    }
  };

  const handleOptionChecked = () => {
    setOptionCheck(!optionCheck);
  };

  const handleAddItem = () => {
    let currentStateData = [...formItems];
    let formItemId;
    setFormCounter(formCounter + 1);
    try {
      let newItem = {
        itemNumber: -1,
        questionContent: "",
        questionType: "MC",
        arrayOptions: [],
        optionCounter: 0,
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
          questionType: res.data.type,
          arrayOptions: [],
          optionCounter: 0,
          // isRequired: 0,
        };
        currentStateData.push(newItem);
        formItemId = res.data.id;
      }).finally(() => {
        setFormItems(currentStateData);
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
    try {
      axios({
        method: "put",
        url: `${BASE_URL}/api/v1/forms/update-form-items/${questionId}`,
        data: currentForm,
        headers: { "Content-Type": "application/json" },
      }).then((res) => {
        setFormItems(tempFormItems);
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
      })
    } catch(error) {
      console.log(error);
    }
  };

  const handleResetOption = (id, iterCount, finalCount) => {
    let tempFormItems = [...formItems];
    let currentForm = tempFormItems.filter((elem) => {
      return elem.id == id;
    });
    currentForm = currentForm[0];
    currentForm["optionCounter"] = 0;
    currentForm["arrayOptions"] = [];
    tempFormItems = tempFormItems.map((elem) => {
      if (elem.id == id) {
        return currentForm;
      }
      return elem;
    });
    try {
      axios({
        method: "delete",
        url: `${BASE_URL}/api/v1/forms/remove-all-answer-selection/${id}`,
      }).then((res) => {
        tempFormItems = tempFormItems.map((elem) => {
          if (elem.id == id) {
            return currentForm;
          }
          return elem;
        });
        setFormItems(tempFormItems);
        handleAddOption(id, iterCount, finalCount);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleOptionList = (id, data) => {
    // console.log("Handle Add Option: " + id);
    let tempFormItems = [...formItems];
    let currentForm = tempFormItems.filter((elem) => {
      return elem.id == id;
    });
    currentForm = currentForm[0];
    currentForm["optionCounter"] = 0;
    currentForm["arrayOptions"] = [];
    if(data.length == 0) handleAddOption(id, null, null);
      data.map((obj) => {
        currentForm["optionCounter"] += 1;
        currentForm["arrayOptions"].push(obj);
      })
    tempFormItems = tempFormItems.map((elem) => {
      if (elem.id == id) {
        return currentForm;
      }
      return elem;
    });
    setFormItems(tempFormItems);
  };

  const handleAddOption = (id, iterCount, finalCount) => {
    // console.log("Handle Add Option: " + id);
    let tempFormItems = [...formItems];
    let currentForm = tempFormItems.filter((elem) => {
      return elem.id == id;
    });
    currentForm = currentForm[0];
    let obj = {};
    obj["formItemsId"] = id;
    obj["value"] = "";
    axios({
      method: "post",
      url: `${BASE_URL}/api/v1/forms/add-answer-selection/${currentForm["id"]}`,
      data: obj,
      headers: { "Content-Type": "application/json" },
    }).then((res) => {
      currentForm["arrayOptions"].push(res.data);
      tempFormItems = tempFormItems.map((elem) => {
        if (elem.id == id) {
          return currentForm;
        }
        return elem;
      });
      setFormItems(tempFormItems);
      if (finalCount && iterCount < finalCount){
        handleAddOption(id, iterCount + 1, finalCount);
      }
    });;
  };

  const handleRemoveOption = (questionId, objId, obj) => {
    let tempFormItems = [...formItems];
    let currentForm = tempFormItems.filter((elem) => {
      return elem.id == questionId;
    });
    currentForm = currentForm[0];
    let arrayOptions = currentForm["arrayOptions"];
    arrayOptions = arrayOptions.filter((elem) => {
      return elem.id != objId;
    });
    currentForm["arrayOptions"] = arrayOptions;
    axios({
      method: "delete",
      url: `${BASE_URL}/api/v1/forms/remove-answer-selection/${objId}`,
    }).then((res) => {
      tempFormItems = tempFormItems.map((elem) => {
        if (elem.id == questionId) {
          return currentForm;
        }
        return elem;
      });
      setFormItems(tempFormItems);
    });
  };

  const handleOptionValue = async (questionId, event, object, nextToggle) => {
    if (timeout != 0) clearTimeout(timeout);
    let value = null;
    if(event.target){
      value = event.target.value;
    } else {
      value = event.value;
    }
    setTimeout(() => {
      let tempFormItems = [...formItems];
      let currentForm = tempFormItems.filter((elem) => {
        return elem.id == questionId;
      });
      currentForm = currentForm[0];
      let arrayOptions = currentForm["arrayOptions"];
      let answerSelection;
      arrayOptions.map((elem) => {
        if (elem.id == object.id) {
          if (nextToggle == true) elem.nextItem = value;
          else elem.value = value;
          answerSelection = elem;
        }
      });
      currentForm["arrayOptions"] = arrayOptions;
      //  answerSelectionId -> object.id
      axios({
        method: "put",
        url: `${BASE_URL}/api/v1/forms/update-answer-selection/${object.id}`,
        data: answerSelection,
        headers: { "Content-Type": "application/json" },
      }).then((res) => {
        tempFormItems = tempFormItems.map((elem) => {
          if (elem.id == questionId) {
            return currentForm;
          }
          return elem;
        });
        setFormItems(tempFormItems);
      });
    }, 3000);
  };

  const handleOptionLabel = async (questionId, event, object, index) => {
    if (timeout != 0) clearTimeout(timeout);
    let value = event.target.value;
    if(value.length <= 0) value = "Label " + index;
    setTimeout(() => {
      let tempFormItems = [...formItems];
      let currentForm = tempFormItems.filter((elem) => {
        return elem.id == questionId;
      });
      currentForm = currentForm[0];
      let arrayOptions = currentForm["arrayOptions"];
      let answerSelection;
      arrayOptions.map((elem) => {
        console.log(elem);
        if (elem.id == object.id) {
          elem.label = value;
          elem.value = index;
          answerSelection = elem;
          return answerSelection;
        }
        return elem;
      });
      axios({
        method: "put",
        url: `${BASE_URL}/api/v1/forms/update-answer-selection/${object.id}`,
        data: answerSelection,
        headers: { "Content-Type": "application/json" },
      }).then((res) => {
        tempFormItems = tempFormItems.map((elem) => {
          if (elem.id == questionId) {
            return currentForm;
          }
          return elem;
        });
        setFormItems(tempFormItems);
      });
    }, 3000);
  };

  const handleOptionCount = (questionId, value) => {
    let tempFormItems = [...formItems];
    let currentForm = tempFormItems.filter((elem) => {
      return elem.id == questionId;
    });
    currentForm = currentForm[0];
    currentForm["optionCounter"] = value;
    tempFormItems = tempFormItems.map((elem) => {
      if (elem.id == questionId) {
        return currentForm;
      }
      return elem;
    });
    setFormItems(tempFormItems);
  };

  const displayQuestion = () => {
    let counter = 0;
    return (
      <React.Fragment>
        {formItems ? formItems.map((res) => {
          counter += 1;
          return (
            <React.Fragment>
              <div className="separator" />
              <div className="question">
                <Question
                  key={"question-" + res.id}
                  formItems={formItems}
                  questionData={res}
                  mode={true}
                  arrayOptions={res["arrayOptions"]}
                  onRemove={handleRemoveItem}
                  handleAddOption={handleAddOption}
                  handleRemoveOption={handleRemoveOption}
                  handleOptionValue={handleOptionValue}
                  handleOptionLabel={handleOptionLabel}
                  handleUpdateQuestionInput={handleUpdateQuestionInput}
                  handleUpdateQuestionType={handleUpdateQuestionType}
                  handleUpdateQuestionIsRequired={handleUpdateQuestionIsRequired}
                  handleResetOption={handleResetOption}
                  handleOptionCount={handleOptionCount}
                  handleOptionList={handleOptionList}
                />
              </div>
            </React.Fragment>
          );
        }) : null}
        <div className="separator" />
        <div
          className="question"
          id="addQuestion"
          onClick={() => handleAddItem()}
        >
          <Question mode={false} />
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
        <div id="page-content">
          <div className="questions-container">{displayQuestion()}</div>
        </div>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
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
