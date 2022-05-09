import React, { Component } from "react";
import Graph from "./functional-components/Graph";

const Summary = React.forwardRef((props, ref) => {
  let counter = 0;
  let tempArr = [];
  return (
    <React.Fragment>
      {tempArr.map((item, i) => {
        counter += 1;
        return (
          <div className="result-container">
            <div className="question-field">
              {counter}. {item.question}
            </div>
            <div className="graph-section">
              <div className="graph">
                <Graph Question={item.question} count={counter} />
              </div>
              <div className="sub-graph">Count Data: {props.countData[i]}</div>
            </div>
          </div>
        );
      })}
      {counter === 0 ? (
        <span className="no-response">There is no response yet.</span>
      ) : null}
    </React.Fragment>
  );
})

export default Summary;
