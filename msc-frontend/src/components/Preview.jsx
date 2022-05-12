import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import iconMenubarGrey from "./images/menubarGrey.png";
import { Link, useParams } from "react-router-dom";
import iconVisibility2 from "./images/visibility2.png";
import iconSettings from "./images/settings.png";

const BASE_URL = "http://10.61.38.193:8080";

function Preview(props) {
  const [openSettings, setOpenSettings] = useState(false);
  const [privacyCheck, setPrivacyCheck] = useState("");

  const [index, setIndex] = useState(1);
  const [formItems, setFormItems] = useState([]);
  const [answerSelection, setAnswerSelection] = useState([]);
  const { formId } = useParams();

  useEffect (() => {
    let body = document.getElementById("body");
    let menuBtn = document.getElementById("menu-icon");
    menuBtn.addEventListener("click", () => {
      body.classList.toggle("openMenu");
    });

    try {
      axios({
        method: "get",
        url: `${BASE_URL}/api/v1/forms/get-form-items/${formId}`,
      }).then((res) => {
        setFormItems(res.data);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleNext = () => {
    setIndex(index + 1);
  }

  const handleBack = () => {
    setIndex(index - 1);
  }

  const handleSettings = () => {
    setOpenSettings(!openSettings);
    window.location = `/settings/formId/${formId}`;
  }

  const getAnswerSelection = (current) => {
    let formItemId = current.id;

    try {
      axios({
        method: "get",
        url: `${BASE_URL}/api/v1/forms/get-answer-selection/${formItemId}`
      }).then((res) => {
        setAnswerSelection(res.data);
      })
    } catch(error) {
      
    }
  }

  const displayQuestion = () => {
    let questions = formItems;
    let length = formItems.length;

    return (
      <div className="display-container">
        {
          length == 0 ? (
            <div id="preview-empty-list">
              There is no question in the list
            </div>
          ) : displayQuestionCard(questions, length)
        }
      </div>
    )
  }

  // const displayQuestionCard = (questions, length) => {
  //   let current = questions.find(
  //     (question) => question.id == index
  //   );
  //   let loadAnswerField;

  //   return (
  //     <React.Fragment>
  //       <div className="title-container">
  //         <div className="menu-icon" id="menu-icon">
  //           <img id="menu-icon-img" src={iconMenubarGrey} alt="" />
  //         </div>
  //         <div className="page-title" id="page-title-home">
  //           Preview
  //         </div>
  //         <div className="dashboard-icon">
  //           <Link to="/item1/dashboard">
  //             <img className="icon-image" src={iconVisibility2} alt="" />
  //           </Link>
  //           <img
  //             className="icon-image"
  //             onClick={() => this.handleSettings()}
  //             src={iconSettings}
  //             alt=""
  //           />m
  //           {this.state.openSettings ? this.displaySettings() : null}
  //         </div>
  //       </div>
  //       {this.displayQuestion(currentQuestion, length)}
  //     </React.Fragment>
  //   );
  // }

  const displayQuestionCard = (questions, length) => {
    let loadAnswerField;
    let current = questions[index-1];
    getAnswerSelection(questions[index-1]);
    console.log(answerSelection);
    
    return (
      <div className="display-container">
        {index == 1 ? null : (
          <div id="preview-back-icon-animation">
            <ion-icon
              name="chevron-back-outline"
              id="preview-back-icon"
              onClick={handleBack}
            />
          </div>
        )}

        <div className="preview-flex">
          <div className="preview-field">
            <div id="preview-index">
              {index}. { }
            </div>
            {current.content == '' ? 
              <div id="preview-warning">Don't forget to type your question to see how it looks. </div> 
              : current.content
            }
          </div>
          <div className="answer-field">
            {current.type == "LS"
              ? (loadAnswerField = loadLinearScale(answerSelection))
              : current.type == "MC"
              ? (loadAnswerField = loadMultipleChoice(
                answerSelection
                ))
              : current.type == "CB"
              ? (loadAnswerField = loadCheckbox(answerSelection))
              : current.type == "SA"
              ? (loadAnswerField = loadShortAnswer())
              : null}
          </div>
        </div>
        {index == length ? null : (
          <div id="preview-next-icon-animation">
            <ion-icon
              name="chevron-forward-outline"
              id="preview-next-icon"
              onClick={handleNext}
            />
          </div>
        )}
      </div>
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
            <Link to={`/dashboard/formId/${formId}`}>
              <button>Confirm</button>
            </Link>
          </form>
        </div>
      </React.Fragment>
    );
  };

  const loadMultipleChoice = (arrayOptions) => {
    // console.log(arrayOptions);

    return (
      <React.Fragment>
        <div id="preview-multiple-choice">
          { 
            arrayOptions.map((options) => {
              console.log(options);
            return (
              <div id="preview-option-container">
                <div id="preview-input-mc-cb-container">
                  <input
                    className="answerSelection"
                    id="option-mc-cb"
                    type="radio"
                    name="options"
                  />
                  <label id="option-label" for="options">
                    {options.value == "" ? options.label : options.value}
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </React.Fragment>
    );
  }

  const loadLinearScale = (arrayOptions) => {
    return (
      <React.Fragment>
        <div id="preview-linear-scale">
          {arrayOptions.map((options) => {
            return (
              <div id="preview-option-container">
                <div id="preview-input-ls-container">
                  <input
                    className="answerSelection"
                    id="option-ls"
                    type="radio"
                    name="options"
                  />
                  <label id="option-ls-label" for="options">
                    {options.value}
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </React.Fragment>
    );
  }

  const loadCheckbox = (arrayOptions) => {
    return (
      <React.Fragment>
        {arrayOptions.map((options) => {
          return (
            <div id="preview-option-container">
              <div id="preview-input-mc-cb-container">
                <input
                  className="answerSelection"
                  id="option-mc-cb"
                  type="checkbox"
                  name="options"
                />
                <label id="option-label" for="options">
                    {options.value == "" ? options.label : options.value}
                  </label>
              </div>
            </div>
          );
        })}
      </React.Fragment>
    );
  }

  const loadShortAnswer = () => {
    return (
      <React.Fragment>
        <div id="preview-short-answer">
          <div id="preview-sa-text">Your answer</div>
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
          Preview
        </div>
        <div className="dashboard-icon">
          <Link to={`/dashboard/formId/${formId}`}>
            <img className="icon-image" src={iconVisibility2} alt="" />
          </Link>
          <img
            className="icon-image"
            onClick={() => handleSettings()}
            src={iconSettings}
            alt=""
          />
          {openSettings ? displaySettings() : null}
        </div>
      </div>
      {displayQuestion()}
    </React.Fragment>
  );
}

export default Preview;
