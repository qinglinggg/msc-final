import React, { Component, useState } from 'react';
import AutoHeightTextarea from "./functional-components/AutoheightTextarea";
import Select from "react-select";
import { useEffect } from 'react';
import axios from 'axios';

const BASE_URL = "http://10.61.38.193:8081";

function Option(props) {
    const [value, setValue] = useState("");
    const [intervalObj, setIntervalObj] = useState([]);

    useEffect(() => {
        if (props.questionData.questionType != "LS") setValue(props.obj.value);
        else setValue(props.obj.label);
        handleInterval();
        return (() => {
            removeInterval();
        });
    }, []);

    useEffect(() => {
        if(!props.prevBranchSelection) return;
        if (props.branchingState && props.prevBranchSelection.current.length > 0 && props.mode) {
        handleOptionValue(-1, true);
        }
    }, [props.branchingState]);

    useEffect(() => {
        if(!value || value == "") return;
        let optionId = "question-" + props.questionData.id + "-options-" + props.obj.id;
        let el = document.getElementById(optionId);
        if(!el) return;
        autoResizeContent(el);
    }, [value]);

    useEffect(() => {
        console.log(intervalObj);
    }, [intervalObj]);

    const handleInterval = () => {
        let interval = setInterval(() => {
            setOptionValue();
        }, 500);
        let currentInterval = [...intervalObj];
        currentInterval.push(interval);
        setIntervalObj(currentInterval);
    }

    const autoResizeContent = (el) => {
        el.style.height = "15px";
        el.style.height = (el.scrollHeight)+"px";
    }
    
    const removeInterval = () => {
        setIntervalObj(intervalObj => {
          intervalObj.map((value) => clearInterval(value));
          return [];
        });
    }

    const setOptionValue = () => {
        axios({
            method: "get",
            url: `${BASE_URL}/api/v1/forms/get-answer-selection-by-id/${props.obj.id}`,
        }).then((res) => {
            setValue(value => {
                let resValue = res.data.value;
                if(value != resValue) {
                    let selectedValue = null;
                    if (props.questionData.questionType != "LS") selectedValue = resValue;
                    else selectedValue = res.data.label;
                    props.handleUpdateLastEdited();
                    return selectedValue;
                }
                return value;
            });
        });
    }

    const handleOptionValue = async (event, nextToggle) => {
        let input = null;
        if(event.target){
            input = event.target.value;
        } else {
            input = event.value;
        }
        let tempObj = props.obj;
        if(nextToggle){
            tempObj.nextItem = input;
        } else {
            tempObj.value = input;
        }
        axios({
            method: "put",
            url: `${BASE_URL}/api/v1/forms/update-answer-selection/${tempObj.id}`,
            data: tempObj,
            headers: { "Content-Type": "application/json" },
        }).then((res) => {
            if(!nextToggle){
                setValue(input);
                props.handleUpdateLastEdited();
            }
        });
    };

    const handleOptionLabel = async (event, index) => {
        let input = event.target.value;
        let tempObj = props.obj;
        tempObj.label = input;
        tempObj.value = index;
        axios({
            method: "put",
            url: `${BASE_URL}/api/v1/forms/update-answer-selection/${tempObj.id}`,
            data: tempObj,
            headers: { "Content-Type": "application/json" },
        }).then((res) => {
            setValue(input);
            props.handleUpdateLastEdited();
        });
      };

    const displayMultipleChoice = () => {
        return (
            <React.Fragment key={"mc-" + props.idx}>
                <div className="answer-selection">
                    <input
                    className="answerSelection"
                    type="radio"
                    disabled
                    />
                    <AutoHeightTextarea
                    key={props.optionId}
                    className="inputText"
                    id={props.optionId}
                    type="text"
                    placeholder={props.obj.label}
                    wrap="soft"
                    onChange={(e) => {
                        handleOptionValue(e, false);
                    }} 
                    value={value}
                    />
                    {props.branchingState ? (
                    <Select
                        className="branching-selection"
                        options={props.branchingSelection}
                        defaultValue={() => {
                        if(props.obj.nextItem != -1) {
                            let defaultVal = null;
                            let tempBranch = null;
                            if (props.branchingSelection.length > 0) tempBranch = props.branchingSelection;
                            else tempBranch = props.prevBranchSelection.current;
                            if (tempBranch) tempBranch.forEach((sel) => {
                            if(sel.value == props.obj.nextItem) {
                                defaultVal = sel;
                            }
                            });
                            return defaultVal;
                        } else {
                            return null;
                        }
                        }}
                        onChange={(e) => {
                        handleOptionValue(e, true);
                        }}/>
                    ) : null}
                    <div className="form-item-remove"
                    onClick={() => {
                        props.handleRemoveOption(
                        props.obj.id,
                        );
                    }}>
                    <ion-icon name="close-outline"></ion-icon>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    const displayCheckbox = () => {
        return (
            <React.Fragment>
                <div className="answer-selection" key={"cb-" + props.idx}>
                    <input
                        className="answerSelection"
                        type="checkbox"
                        disabled
                    />
                    <AutoHeightTextarea
                        key={props.optionId}
                        className="inputText"
                        id={props.optionId}
                        type="text"
                        placeholder={props.obj.label}
                        value={value}
                        wrap="soft"
                        onChange={(e) => {
                            handleOptionValue(e, false);
                        }}
                    />
                    <div
                        className="dashboard-remove-options-button"
                        onClick={() => {
                        props.handleRemoveOption(
                            props.obj.id,
                        );
                        }}
                    >
                        <i className="fas fa-times"></i>
                    </div>
                </div>
            </React.Fragment>
        )
    }

    const displayLinearLabel = () => {
        return (
            <div className="linear-label-row">
                <div className="linear-label-userinput">
                    <AutoHeightTextarea
                    key={props.optionId}
                    id={props.optionId}
                    className="inputText"
                    type="text"
                    placeholder={"Label " + (props.idx + 1)}
                    wrap="soft"
                    // defaultValue={props.obj.label ? props.obj.label : null}
                    onChange={(e) => {
                        handleOptionLabel(
                        e,
                        props.idx
                        );
                    }}
                    value={value}
                    />
                </div>
                <div id="linear-label-select">
                    <div id="linear-label-select-box">
                    <div id="linear-label-select-value">
                        {props.labelOptions && props.labelOptions.length > 0
                        ? props.labelOptions[props.idx].value
                        : null}
                    </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <React.Fragment>
            {props.questionData.questionType == "MC" && displayMultipleChoice()}
            {props.questionData.questionType == "CB" && displayCheckbox()}
            {props.questionData.questionType == "LS" && displayLinearLabel()}
        </React.Fragment>
    );
}

export default Option;