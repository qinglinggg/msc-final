import React, { Component, useState } from 'react';
import AutoHeightTextarea from "./functional-components/AutoheightTextarea";
import Select from "react-select";
import { useEffect } from 'react';
import axios from 'axios';

const BASE_URL = "http://10.61.38.193:8080";

function Option(props) {

    const [value, setValue] = useState("");

    useEffect(() => {
        setInterval(() => {
            setOptionValue();
        }, 250);
    }, [])

    useEffect(() => {
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
        console.log(props.obj);
        if(!el) return;
        autoResizeContent(el);
    }, [value])

    const setOptionValue = () => {
        axios({
            method: "get",
            url: `${BASE_URL}/api/v1/forms/get-answer-selection-by-id/${props.obj.id}`,
        }).then((res) => {
            let resValue = res.data.value;
            if(resValue && value != resValue) {
                let selectedValue = null;
                if (props.questionData.questionType != "LS") selectedValue = resValue;
                else selectedValue = res.data.label;
                console.log(selectedValue);
                setValue(selectedValue);
            }
        }).catch((error) => console.log(error));
    }

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
                    props.handleOptionValue(
                    props.questionData.id,
                    e, props.obj, false
                    );
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
                    props.handleOptionValue(
                        props.questionData.id,
                        e, props.obj, true
                    );
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