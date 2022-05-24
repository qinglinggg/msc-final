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
    if(props.responses && selectedResponse == "")
      setSelectedResponse(props.responses[0]);
  }, []);

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
          tempAnswers.push({answerSelectionId: key, value: res.data[key].answerSelectionValue});
        })
        setAnswerList(tempAnswers);
      }
    });
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
    }
  }, [options])

  const setDefaultValue = (selection) => {
    let currentAns = answerList;
    let value = null;
    let checker = false;
    currentAns && currentAns.map(ans => {
      if(ans.answerSelectionId == selection.id) {
        checker = true;
        value = ans.value;
      }
    });
    return [checker, value];
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
        let checker = setDefaultValue(selection);
        return (
          <div className="answer-selection">
            {type == "MC" ? (<input type="radio" id={id} name={name} className="answer-radio" checked={checker[0]} disabled/>) : null}
            {type == "CB" ? (<input type="checkbox" id={id} name={name} className="answer-radio" checked={checker[0]} disabled/>) : null}
            {type == "LS" ? (<input type="radio" id={id} name={name} className="answer-radio" checked={checker[0]} disabled/>) : null}
            {type == "SA" ? (<div className="text-container"><input type="text" className="answer-text" name={name} value={checker[0] ? checker[1] : ""} disabled/></div>) : null}
            {type != "LS" ? (<label htmlFor={id}>{selection.value}</label>) : (type != "SA" ? (<label htmlFor={id}>{selection.label}</label>) : null)}
          </div>
        );
      }) : (<span>No selection data...</span>)
      }
      </React.Fragment>
    );
  }

  const changeSelectedResponse = (navDistance, inUsed) => {
    if(!selectedResponse) return false;
    let validator = false;
    props.responses.map((resp, idx) => {
      if(selectedResponse == resp)
        if(props.responses[idx+navDistance]){
          if(inUsed) setSelectedResponse(props.responses[idx+navDistance]);
          validator = true;
        }
    });
    return validator;
  }

  return (
    <React.Fragment>
      <div className="select-user-container">
        <span>Selected response</span>
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
        options={options}
        value={options.map((option) => option.value == selectedResponse ? option : null)}
        id="selected-response"
        onChange={(e) => setSelectedResponse(e.value)}/>
        {changeSelectedResponse(-1, false) ? (<button onClick={() => changeSelectedResponse(-1, true)}>{"<< Prev"}</button>) : null}
        {changeSelectedResponse(1, false) ? (<button onClick={() => changeSelectedResponse(1, true)}>{"Next >>"}</button>) : null}
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
                  {displayAnswers(item.id, item.type)}
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
