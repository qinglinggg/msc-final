import axios from "axios";
import React, { Component, useEffect, useState } from "react";
import Select from "react-select";

const BASE_URL = "http://10.61.38.193:8080";
function Responses(props) {
  const [selectedResponse, setSelectedResponse] = useState("");
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
        currentSelections.push({formItemsId: data.id, data: res.data});
      }).finally(() => {
        setAnswerSelection(currentSelections);
      });
    });
  }, [props.data])

  useEffect(() => {
    if(!selectedResponse || selectedResponse == "") return;
    let selectedForm = localStorage.getItem("selectedForm");
    if (selectedForm) selectedForm = JSON.parse(selectedForm);
    else return;
    axios({
      method: "get",
      url: `${BASE_URL}/api/v1/forms/get-responses-by-id/${selectedResponse}/`
    }).then((res) => {
      let tempAnswers = []
      if(res.data) {
        let keys = Object.keys(res.data);
        keys.map((key) => {
          tempAnswers.push({formItemsId: key, value: res.data[key]});
        });
        setAnswerList(tempAnswers);
        console.log(tempAnswers);
      }
    });
    let element = document.getElementById("selected-response");
    if(element) {
      element.value = selectedResponse;
    }
  }, [selectedResponse]);

  useEffect(() => {
    let tempOpt = [];
    props.responses.map((value) => {
      tempOpt.push({value: value, label: value})
    });
    setOptions(tempOpt);
  }, [props.responses]);

  useEffect(() => {
    if(!options || options.length <= 0) return;
    let element = document.getElementById("selected-response");
    if(element) {
      element.value = options[0].value;
      // console.log(element.value == options[0].value);
    }
  }, [options])

  const setDefaultValue = (currentAns, selection) => {
    let validator = currentAns && currentAns.map(ans => ans.value[0] == selection.id);
    let checker = false;
    validator.map((check) => {
      if(check == true) {
        checker = true;
        return;
      }
    });
    return checker;
  }

  const displayAnswers = (itemId, type) => {
    let currentSelection = answerSelection.filter((selection) => {
      return selection.formItemsId == itemId;
    });
    if (currentSelection && currentSelection.length > 0) currentSelection = currentSelection[0].data;
    return (
      <React.Fragment>
      {
      currentSelection ? currentSelection.map((selection, innerIdx) => {
        let id = "question-" + itemId + "-options-" + innerIdx;
        let name = "question-" + itemId;
        let currentAns = answerList.filter((ans) => {
          return ans.formItemsId == itemId;
        });
        return (
          <div className="answer-selection">
            {type == "MC" ? (<input type="radio" id={id} name={name} checked={setDefaultValue(currentAns, selection)} disabled/>) : null}
            {type == "CB" ? (<input type="checkbox" id={id} name={name} checked={setDefaultValue(currentAns, selection)} disabled/>) : null}
            {type == "LS" ? (<input type="radio" id={id} name={name} checked={setDefaultValue(currentAns, selection)} disabled/>) : null}
            {type == "SA" ? (<input type="text" id={id} name={name} value={setDefaultValue(currentAns, selection) ? currentAns[0].value[1] : ""} disabled/>) : null}
            {type != "LS" ? (<label htmlFor={id}>{selection.value}</label>) : (type != "SA" ? (<label htmlFor={id}>{selection.label}</label>) : null)}
          </div>
        );
      }) : (<span>No selection data...</span>)
      }
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <div className="select-user-container">
        <span>Selected response</span>
        <Select options={options}
        defaultValue={options[0]}
        id="selected-response"
        onChange={(e) => setSelectedResponse(e.value)}/>
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
                  {displayAnswers(item.id, item.type)}
                  <span>{answerList.map((ans) => {
                    if (ans.formItemsId == item.id) return ans.value[1];
                    // return null;
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
