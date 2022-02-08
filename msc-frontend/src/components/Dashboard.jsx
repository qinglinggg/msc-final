import react, { createRef, Fragment, useEffect, useState } from "react";
import React, { Component } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Question from "./Question";
import iconMenubarGrey from "./images/menubarGrey.png";
import iconVisibility from "./images/visibility.png";
import iconSettings from "./images/settings.png";

const BASE_URL = "http://localhost:8080";

function Dashboard(props) {
  const [testing, setTesting] = useState(false);
  const [openVisibility, setOpenVisibility] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [privacyCheck, setPrivacyCheck] = useState(true);
  const [formItems, setFormItems] = useState([]);
  const [optionCheck, setOptionCheck] = useState(false);
  const [formCounter, setFormCounter] = useState(0);
  const [currentFormData, setCurrentFormData] = useState();
  const [timeout, setTimeout] = useState(0);
  const { formId } = useParams();

  useEffect(() => {
    setCurrentFormData(
      props.forms.map((formData) => {
        if (formData.formId == formId) {
          return formData;
        }
      })
    );
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
    let menuBtn = document.getElementById("menu-icon");
    menuBtn.addEventListener("click", () => {
      body.classList.toggle("openMenu");
    });
  });

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
    setFormCounter(formCounter + 1);
    try {
      let newItem = {
        itemNumber: formCounter,
        questionContent: "",
        questionType: "",
        arrayOptions: [],
        optionCounter: 0,
      };
      axios({
        method: "post",
        url: `${BASE_URL}/api/v1/forms/add-form-items/${formId}`,
        data: newItem,
        headers: { "Content-Type": "application/json" },
      }).then((res) => {
        console.log(res.data);
        newItem = {
          itemNumber: res.data.itemNumber,
          questionContent: res.data.content,
          questionType: res.data.type,
          arrayOptions: [],
          optionCounter: 0,
        };
        currentStateData.push(newItem);
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
        console.log(newFormItems);
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
    console.log(currentForm);
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
        console.log(tempFormItems);
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
        console.log(tempFormItems);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleResetOption = (id) => {
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
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleOptionList = (id, obj) => {
    // console.log("Handle Add Option: " + id);
    let tempFormItems = [...formItems];
    let currentForm = tempFormItems.filter((elem) => {
      return elem.id == id;
    });
    currentForm = currentForm[0];
    currentForm["optionCounter"] += 1;
    currentForm["arrayOptions"].push(obj);

    tempFormItems = tempFormItems.map((elem) => {
      if (elem.id == id) {
        return currentForm;
      }
      return elem;
    });

    setFormItems(tempFormItems);
  };

  const handleAddOption = (id) => {
    // console.log("Handle Add Option: " + id);
    let tempFormItems = [...formItems];
    let currentForm = tempFormItems.filter((elem) => {
      return elem.id == id;
    });
    currentForm = currentForm[0];
    // currentForm["optionCounter"] += 1;
    let obj = {};
    obj["formItemsId"] = id;
    // obj["optionCounter"] = currentForm["optionCounter"];
    // obj["no"] = currentForm["optionCounter"];
    // obj["label"] = "Option " + currentForm["optionCounter"];
    obj["value"] = "";
    // console.log(obj);
    // return new Promise(
    axios({
      method: "post",
      url: `${BASE_URL}/api/v1/forms/add-answer-selection/${currentForm["id"]}`,
      data: obj,
      headers: { "Content-Type": "application/json" },
    }).then((res) => {
      currentForm["arrayOptions"].push(res.data);
      // console.log(res.data);
      // console.log("currentForm:");
      // console.log(currentForm);
      tempFormItems = tempFormItems.map((elem) => {
        if (elem.id == id) {
          return currentForm;
        }
        return elem;
      });
      // console.log(tempFormItems);
      setFormItems(tempFormItems);
    });
    // );
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

  const handleOptionValue = async (questionId, event, object) => {
    if (timeout != 0) clearTimeout(timeout);

    let value = event.target.value;

    setTimeout(() => {
      // console.log("questionId: ");
      // console.log(questionId);
      // console.log("event: ");
      // console.log(value);
      // console.log("object: ");
      // console.log(object);
      let tempFormItems = [...formItems];
      let currentForm = tempFormItems.filter((elem) => {
        return elem.id == questionId;
      });
      currentForm = currentForm[0];

      let arrayOptions = currentForm["arrayOptions"];
      let answerSelection;

      arrayOptions.map((elem) => {
        if (elem.id == object.id) {
          elem.value = value;
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
    }, 5000);
  };

  const handleUpdateOptionLabel = (formItemsId, value) => {
    // let tempFormItems = [...formItems];
    // let currentForm = tempFormItems.filter((elem) => {
    //   return elem.id == formItemsId;
    // });
    // currentForm = currentForm[0];
    console.log("handleUpdateOptionLabel");
    // let arrayOptions = currentForm["arrayOptions"];

    // let idx = 0;
    // currentForm["arrayOptions"] = arrayOptions.map((options) => {
    //   console.log("masuk");
    //   idx++;
    //   options.label = "Label " + idx;
    //   options.no = idx;
    //   try {
    //     axios({
    //       method: "put",
    //       url: `${BASE_URL}/api/v1/forms/update-answer-selection-label/${options.id}`,
    //       data: idx,
    //       headers: { "Content-Type": "application/json" },
    //     });
    //   } catch (error) {
    //     console.log(error);
    //   }
    // });

    // tempFormItems = tempFormItems.map((elem) => {
    //   if (elem.id == formItemsId) {
    //     return currentForm;
    //   }
    //   return elem;
    // });
    // setFormItems(tempFormItems);

    try {
      axios({
        method: "put",
        url: `${BASE_URL}/api/v1/forms/update-all-answer-selection-label/${formItemsId}`,
        data: value,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.log(error);
    }
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
    return (
      <React.Fragment>
        {formItems.map((res) => {
          // console.log(res);
          return (
            <React.Fragment>
              <div className="separator" />
              <div className="question">
                <Question
                  key={"question-" + res.id}
                  formItemsLength={formItems.length}
                  questionData={res}
                  mode={true}
                  arrayOptions={res["arrayOptions"]}
                  onRemove={handleRemoveItem}
                  handleAddOption={handleAddOption}
                  handleRemoveOption={handleRemoveOption}
                  handleOptionValue={handleOptionValue}
                  handleUpdateQuestionInput={handleUpdateQuestionInput}
                  handleUpdateQuestionType={handleUpdateQuestionType}
                  handleResetOption={handleResetOption}
                  handleOptionCount={handleOptionCount}
                  handleOptionList={handleOptionList}
                  handleUpdateOptionLabel={handleUpdateOptionLabel}
                />
              </div>
            </React.Fragment>
          );
        })}
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
                    setPrivacyCheck(!privacyCheck);
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
                    setPrivacyCheck(!privacyCheck);
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
  };

  return (
    <React.Fragment>
      <div className="title-container">
        <div className="menu-icon" id="menu-icon">
          <img id="menu-icon-img" src={iconMenubarGrey} alt="" />
        </div>
        <div className="page-title" id="page-title-home">
          Dashboard
        </div>
        {/* <div className="title">Dashboard</div> */}
        <div className="dashboard-icon">
          <img
            className="icon-image"
            onClick={() => handleVisibility()}
            src={iconVisibility}
            alt=""
          />
          <img
            className="icon-image"
            onClick={() => handleSettings()}
            src={iconSettings}
            alt=""
          />
          {openSettings ? displaySettings() : null}
        </div>
      </div>
      {/* kondisi kalo udah ada question, tampilin question dulu, baru AddQuestion*/}
      {/* kalo belum ada, lgsg tombol Add Question aja */}
      {/* AddQuestion -> tombol dulu baru kalo dipencet muncul menu tambahan */}
      <div id="page-content">
        <div className="questions-container">{displayQuestion()}</div>
      </div>
    </React.Fragment>
  );
}

export default Dashboard;
