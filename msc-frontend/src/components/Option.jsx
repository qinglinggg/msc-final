import React, { Component, useState } from 'react';
import AutoHeightTextarea from "./functional-components/AutoheightTextarea";
import Select from "react-select";
import { useEffect } from 'react';
import axios from 'axios';

const BASE_URL = "http://10.61.38.193:8080";

function Option(props) {

    const [value, setValue] = useState("");

    useEffect(() => {
        var valueInterval = setInterval(() => {
            setOptionValue();
        }, 250);

        return () => {
            console.log("unmount");
        }
    }, [])

    useEffect(() => {
        // console.log(props.formItems);
        setOptionValue();
    }, [props.formItems])

    const autoResizeContent = (el) => {
        el.style.height = "15px";
        el.style.height = (el.scrollHeight)+"px";
    }

    useEffect(() => {
        if(!value || value == "") return;
        let optionId =
        "question-" + props.questionData.id + "-options-" + props.obj.id;
        let el = document.getElementById(optionId);
        // console.log(props.obj);
        if(!el) return;
        autoResizeContent(el);
    }, [value])

    const setOptionValue = () => {
        // console.log("jalan nih");
        axios({
            method: "get",
            url: `${BASE_URL}/api/v1/forms/get-answer-selection-by-id/${props.obj.id}`,
        }).then((res) => {
            let resValue = res.data.value;
            if(resValue && value != resValue) {
                let selectedValue = null;
                if (props.questionData.questionType != "LS") selectedValue = resValue;
                else selectedValue = res.data.label;
                // console.log(selectedValue);
                setValue(selectedValue);
            }
        }).catch((error) => console.log(error));
    }

    const handleOptionValue = async (event, nextToggle) => {
        console.log(event.target.value);
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
            if(!nextToggle) setValue(input);
        });
    };

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
                    // console.log(e);
                    handleOptionValue(e, true);
                    }}/>
                ) : null}
                <div className="form-item-remove"
                onClick={() => {
                    props.handleRemoveOption(
                    props.questionData.id,
                    props.obj.id,
                    props.obj
                    );
                }}>
                <ion-icon name="close-outline"></ion-icon>
                </div>
            </div>
        </React.Fragment>
    );
}

export default Option;