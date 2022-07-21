import React, { Component } from "react";
import Graph from "./functional-components/Graph";

const calculateResponses = (countData) => {
  let totalCount = 0;
  countData.map(count => totalCount += count);
  return totalCount;
}

const Summary = (props) => {
  let counter = 0;
  console.log(props);
  return (
    <React.Fragment>
      {props.data ? props.data.map((item, i) => {
        counter += 1;
        console.log(props.countData[i]);
        return (
          <div className="result-container" key={"summary-" + props.renderCount + "-" + i}>
            <div className="question-field">
              <div className="content">{counter}. {item.content}</div>
              <div className="respondent-count">{calculateResponses(props.countData[i]) + " Responses"}</div>
            </div>
            <Graph question={item.content} type={item.type} answerList={props.answerList[i]} count={counter} countData={props.countData[i]} />
          </div>
        );
      }) : null}
      {counter === 0 ? (
        <span className="no-response">There is no response yet.</span>
      ) : null}
    </React.Fragment>
  );
}

export default Summary;
