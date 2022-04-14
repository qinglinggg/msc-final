import axios from 'axios';
import React, { Component, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import AutoHeightTextarea from './functional-components/AutoheightTextarea';

function Respondent (props) {

    const BASE_URL = "http://10.61.38.193:8080";
    const { formId } = useParams();

    const [index, setIndex] = useState(1);
    const [formMetadata, setFormMetadata] = useState([]);
    const [formItems, setFormItems] = useState([]);
    const [answerSelection, setAnswerSelection] = useState([]);
    const [formRespondentId, setFormRespondentId] = useState();
    const [formResponse, setFormResponse] = useState([]);

    useEffect(() => {

        try {
            axios({
                method: "get",
                url: `${BASE_URL}/api/v1/forms/${formId}`
            }).then((res) => {
                setFormMetadata(res.data);
                console.log(res.data);
            })
        } catch (error) {

        }


        try {
            axios({
                method: "get",
                url: `${BASE_URL}/api/v1/forms/get-form-items/${formId}`
            }).then((res) => {
                setFormItems(res.data);
                console.log(res.data);
            })
        } catch (error) {

        }

        try {
            axios({
              method: "get",
              url: `${BASE_URL}/api/v1/forms/form-respondent/${formId}`,
              data: props.user, // cek lagi nanti. 
            }).then((res) => {
              if(res) setFormRespondentId(res.data);
              else {
                axios({
                  method: "post",
                  url: `${BASE_URL}/api/v1/forms/insert-form-respondent/${formId}`
                }).then((res) => {
                  setFormRespondentId(res.data);
                })
              }
            })
        } catch (error) {
            
        }

        try {

        } catch(error) {

        }

    }, []);

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
    
    const handleNext = () => {
        setIndex(index + 1);
    }
    
    const handleBack = () => {
        setIndex(index - 1);
    }
     
    const displayQuestion = () => {
        let length = formItems.length;
        return (
            <div className="preview-container">
              {
                length == 0 ? (
                  <div id="preview-empty-list">
                    There is no question in the list
                  </div>
                ) : displayQuestionCard(length)
              }
            </div>
          )
    }

    const displayQuestionCard = (length) => {
        let loadAnswerField;
        let current = formItems[index-1];
        getAnswerSelection(formItems[index-1]);

        return (
          <React.Fragment>
            {index == 1 ? (
              <div id="preview-back-null" />
            ) : (
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
                {index}. {current.content}
              </div>
              <div className="answer-field">
                {current.type == "LS"
                  ? (loadAnswerField = loadLinearScale(current.id, answerSelection))
                  : current.type == "MC"
                  ? (loadAnswerField = loadMultipleChoice(
                    current.id, answerSelection
                    ))
                  : current.type == "CB"
                  ? (loadAnswerField = loadCheckbox(current.id, answerSelection))
                  : current.type == "SA"
                  ? (loadAnswerField = loadShortAnswer(current.id))
                  : null}
              </div>
              {index == length - 1 ? (
                <div className="preview-submit-button" onClick={() => submitForm()}>
                  Submit
                </div>
              ) : null}
            </div>
            {index == length ? (
              <div id="preview-next-null" />
            ) : (
              <div id="preview-next-icon-animation">
                <ion-icon
                  name="chevron-forward-outline"
                  id="preview-next-icon"
                  onClick={handleNext}
                />
              </div>
            )}
          </React.Fragment>
        );
      }

      const setMultipleChoiceValue = (formItemId, selectedAnswerSelection) => {

        // find formitemid yg sama, dihapus. push yg baru.

        let responses = [...formResponse];

        let deletePrevChoice = responses.filter((choice) => {
          return choice.formItemId != formItemId;
        });

        let formItemResponse = {
          formRespondentId: formRespondentId,
          formItemId: formItemId,
          answerSelectionId: selectedAnswerSelection.id,
          answerSelectionValue: selectedAnswerSelection.value,
        }

        deletePrevChoice.push(formItemResponse);

        setFormResponse(deletePrevChoice);

      }

      const loadMultipleChoice = (formItemId, arrayOptions) => {

    
        return (
          <React.Fragment>
            <div id="preview-multiple-choice">
              { 
                arrayOptions.map((options) => {
                return (
                  <div id="preview-option-container">
                    <div id="preview-input-mc-cb-container">
                      <input
                        className="answerSelection"
                        id="option-mc-cb"
                        type="radio"
                        name="options"
                        onClick={() => setMultipleChoiceValue(formItemId, options)}
                      />
                      <label id="option-label" for="options">
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

      const setLinearScaleValue = (formItemId, selectedAnswerSelection) => {

        let responses = [...formResponse];

        let deletePrevChoice = responses.filter((choice) => {
          return choice.formItemId != formItemId;
        });

        let formItemResponse = {
          formRespondentId: formRespondentId,
          formItemId: formItemId,
          answerSelectionId: selectedAnswerSelection.id,
          answerSelectionValue: selectedAnswerSelection.value,
        }

        deletePrevChoice.push(formItemResponse);

        setFormResponse(deletePrevChoice);

      }

      const loadLinearScale = (formItemId, arrayOptions) => {
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
                        onClick={() => setLinearScaleValue(formItemId, options)}
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

      const setCheckboxValue = (formItemId, selectedAnswerSelection) => {

        let responses = [...formResponse];

        let formItemResponse = {
          formRespondentId: formRespondentId,
          formItemId: formItemId,
          answerSelectionId: selectedAnswerSelection.id,
          answerSelectionValue: selectedAnswerSelection.value,
        }

        responses.push(formItemResponse);

        setFormResponse(responses);

      }
    
      const loadCheckbox = (formItemId, arrayOptions) => {
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
                      onClick={() => setCheckboxValue(formItemId, options)}
                    />
                    <label id="option-label" for="options">
                      {options.value}
                    </label>
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        );
      }

      const setShortAnswerValue = (formItemId, value) => {

        let responses = [...formResponse];

        let prevAnswer = responses.filter((r) => {
          return r.formItemId != formItemId;
        })

        let formItemResponse = {
          formRespondentId: formRespondentId,
          formItemId: formItemId,
          answerSelectionId: 1,
          answerSelectionValue: value,
        }

        prevAnswer.push(formItemResponse);        

      }
    
      const loadShortAnswer = (formItemId) => {
        return (
          <React.Fragment>
            <div id="preview-short-answer">
              <AutoHeightTextarea id="preview-sa-text" placeholder="Your answer" onChange={(e) => setShortAnswerValue(formItemId, e.target.value)}></AutoHeightTextarea>
            </div>
          </React.Fragment>
        );
      }

      const submitForm = () => {

        formResponse.map((response) => {
          try {
            axios({
              method: "post",
              url: `${BASE_URL}/api/v1/forms/insert-response/${formRespondentId}`,
              data: response
            })
          } catch(error) {
            console.log(error);
          }
        })

      }

    return (
        <React.Fragment>
            <div id="respondent-container">
                <div className="page-title" id="page-title-respondent">
                    {formMetadata.title}
                </div>
                <div className="page-description-respondent">
                    {formMetadata.description}
                </div>
                {/* <div className="page-content"> */}
                    {displayQuestion()}
                {/* </div> */}
            </div>

        
        </React.Fragment>
    );
}
 
export default Respondent;