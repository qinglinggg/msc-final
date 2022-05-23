import axios from "axios";
import React, { Component, useEffect, useState } from "react";
import Select from "react-select";

const BASE_URL = "http://10.61.38.193:8080";
function Responses(props) {
  const [selectedRespondent, setSelectedRespondent] = useState("");
  const [answerList, setAnswerList] = useState([]);
  const [answerSelection, setAnswerSelection] = useState([]);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if(!props.data) return;
    let currentSelections = [...answerSelection];
    props.data.map((data) => {
      axios({
        method: "get",
        url: `${BASE_URL}/api/v1/forms/get-answer-selection/${data.id}`,
      }).then((res) => {
        currentSelections.push(res.data);
      }).finally(() => {
        setAnswerSelection(currentSelections);
      });
    });
  }, [props.data])

  useEffect(() => {
    if(!selectedRespondent || selectedRespondent == "") return;
    let selectedForm = localStorage.getItem("selectedForm");
    if (selectedForm) selectedForm = JSON.parse(selectedForm);
    else return;
    axios({
      method: "get",
      url: `${BASE_URL}/api/v1/forms/get-response-user/${selectedForm.formId}/${selectedRespondent}`
    }).then((res) => {
      let tempAnswers = []
      if(res.data) {
        let keys = Object.keys(res.data);
        keys.map((key) => {
          tempAnswers.push({formItemsId: key, value: res.data[key]});
        });
        setAnswerList(tempAnswers);
      }
    });
  }, [selectedRespondent]);

  useEffect(() => {
    let tempOpt = [];
    props.respondents.map((value) => {
      tempOpt.push({value: value, label: value})
    });
    setOptions(tempOpt);
  }, [props.respondents])

  const displayMultipleChoice = (itemId, idx) => {
    return (
      <React.Fragment>
      {console.log(answerSelection)}
      {
      answerSelection[idx] ? answerSelection[idx].map((selection, idx) => {
        let id = "question-" + selection.formItemsId + "-options-" + selection.id;
        return (
          <div className="answer-selection">
            <input type="radio" name={id} id={id} disabled/>
            <label htmlFor={id}>{selection.value}</label>
          </div>
        );
      }) : (<span>No selection data...</span>)
      }
      </React.Fragment>
    );
  }

  const displayCheckbox = () => {

  }

  const displayLinearScale = () => {

  }

  const displayShortAnswer = () => {

  }

  return (
    <React.Fragment>
      <div className="select-user-container">
        <span>Selected respondents</span>
        <Select options={options}
        defaultValue={options[0]}
        onChange={(e) => setSelectedRespondent(e.value)}/>
      </div>
      { props.data && props.data.length > 0 ? (
        <React.Fragment>
          {props.data.map((item, idx) => {
            return (
              <div className="result-container">
                <div className="question-field">
                  <span>{idx+1}. {item.content}</span>
                </div>
                <div className="answer-container">
                  <span>{item.type}</span>
                  {displayMultipleChoice(item.formId, idx)}
                  <span>{answerList.map((ans) => {
                    if(ans.formItemsId == item.id) return ans.value;
                    return null;
                  })}</span>
                </div>
              </div>
            );
          })}
        </React.Fragment>
      ) : (<span className="no-response">There is no response yet.</span>)
      }
    </React.Fragment>
  );
}

export default Responses;
