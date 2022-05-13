import React, { Component } from "react";
import Graph from "./functional-components/Graph";

const Summary = React.forwardRef((props, ref) => {
  let counter = 0;
  let tempArr = [];
  return (
    <React.Fragment>
      {props.data ? props.data.map((item, i) => {
        counter += 1;
        return (
          <div className="result-container">
            <div className="question-field">
              {counter}. {item.content}
            </div>
            <div className="graph-section">
              <div className="graph">
                <Graph question={item.question} answerList={props.answerList[i]} count={counter} countData={props.countData[i]} />
              </div>
              <div className="sub-graph">
                <ul>
                { props.countData[i] ? props.countData[i].map((countSum, ci) => {
                  return (
                    <li>{ props.answerList[i][ci] } : { countSum }</li>
                  );
                }) : (
                  <span>No answer found</span>
                )}
                </ul>
              </div>
            </div>
          </div>
        );
      }) : null}
      {counter === 0 ? (
        <span className="no-response">There is no response yet.</span>
      ) : null}
    </React.Fragment>
  );
})

export default Summary;
