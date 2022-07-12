import React, { Component, useState } from 'react';
import AutoHeightTextarea from "./functional-components/AutoheightTextarea";
import Select from "react-select";
import { useEffect } from 'react';
import axios from 'axios';
import { useRef } from 'react';

const BASE_URL = "http://10.61.54.168:8080";

function Option(props) {
    const [value, setValue] = useState("");
    const [nextItem, setNextItem] = useState(-1);
    const [intervalObj, setIntervalObj] = useState([]);
    const [isUsed, setIsUsed] = useState(false);

    useEffect(() => {
        handleInterval();
        let elem = document.getElementById(props.optionId);
        if(!elem) return;
        if (props.questionType != "LS"){
            setValue(props.obj.value);
            if(elem.value != props.obj.value) elem.value = props.obj.value;
        }
        else {
            setValue(props.obj.label);
            if(elem.value != props.obj.label) elem.value = "";
        }
        elem.addEventListener("focusin", () => {
            setIsUsed(isUsed => {
              if(isUsed == false) return true;
              return isUsed;
            });
        });
        elem.addEventListener("focusout", () => {
            setIsUsed(isUsed => {
              if(isUsed == true) return false;
              return isUsed;
            });
        });
        return (() => {
            removeInterval();
        });
    }, []);

    useEffect(() => {
        if(!props.prevBranchSelection) return;
        if(props.branchingState){
            handleOptionValue(null, true);
        } 
    }, [props.branchingState]);

    useEffect(() => {
        setNextItem(-1);
        handleOptionValue(null, true);
    }, [props.formItems]);

    useEffect(() => {
        // if(!props.obj) return;
        let el = document.getElementById(props.optionId);
        if(!el) return;
        if(value != undefined && el.value != value) {
            if(value != ("Option " + (props.idx+1))) {
                el.value = value;
            }
            autoResizeContent(el);
        }
    }, [value]);

    const handleInterval = () => {
        let interval = setInterval(() => {
            setOptionValue();
        }, 1500);
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
          intervalObj.map((obj) => clearInterval(obj));
          return [];
        });
    }

    useEffect(() => {
        let el = document.getElementById(props.optionId);
        if(value != ("Option " + (props.idx+1))) el.value = value;
        // else el.value = "";
    }, [props.arrayOptions]);

    const setOptionValue = () => {
        let validator = false;
        setIsUsed(isUsed => {
            if(isUsed) validator = true;
            return isUsed;
        });
        if(validator) return;
        axios({
            method: "get",
            url: `${BASE_URL}/api/v1/forms/get-answer-selection-by-id/${props.obj.id}`,
        }).then((res) => {
            setNextItem((value) => {
                if(value != res.data.nextItem) return res.data.nextItem;
                return value;
            });
            setValue((value) => {
                let resValue;
                if(props.questionType != "LS") resValue = res.data.value;
                else resValue = res.data.label;
                if(value != resValue) {
                    if(resValue != undefined) props.handleStyling();
                    return resValue;
                }
                return value;
            });
        });
    }

    const handleOptionValue = async (event, nextToggle) => {
        console.log("handleOptionValue, branchingState: ", props.branchingState);
        let input = null;
        let tempObj = props.obj;
        if(event) {
            if(event.target){
                input = event.target.value;
            } else {
                input = event.value;
            }
            console.log("input:", input);
        } else {
            if(!props.branchingState){
                input = -1;
            }
            else {
                if(tempObj.nextItem > 0) {
                    let isFound = false;
                    props.formItems.map((item) => {
                        if(item.itemNumber == tempObj.nextItem) isFound = true;
                    });
                    console.log("isFound", isFound);
                    if(!isFound) input = -1;
                    else input = tempObj.nextItem;
                }
                else input = -1;
            }
            console.log("Current item number: ", props.itemNumber, input);
        }
        if(nextToggle){
            tempObj.nextItem = input;
            setNextItem(input);
        } else {
            tempObj.value = input;
            setValue(input);
            props.handleUpdateLastEdited();
        }
        await axios({
            method: "put",
            url: `${BASE_URL}/api/v1/forms/update-answer-selection/${tempObj.id}`,
            data: tempObj,
            headers: { "Content-Type": "application/json" },
        });
    };

    const handleOptionLabel = async (event, index) => {
        event.persist();
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
                    />
                    {props.branchingState && nextItem != 0 ? (
                    <Select
                        className="branching-selection"
                        options={props.branchingSelection}
                        value={props.branchingSelection.map((option, idx) => {
                            if(nextItem == -1 && idx == 0) return option;
                            // else if(props.branchingSelection.length == 1) return option;
                            else if(option.value == nextItem) {
                                return option;
                            }
                            return null;
                        })}
                        isDisabled={!props.branchingSelection || props.branchingSelection.length == 0}
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
                        e, props.idx);}}
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
            {props.questionType == "MC" && displayMultipleChoice()}
            {props.questionType == "CB" && displayCheckbox()}
            {props.questionType == "LS" && displayLinearLabel()}
        </React.Fragment>
    );
}

export default Option;