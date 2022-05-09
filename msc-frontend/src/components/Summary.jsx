import React, { Component } from "react";
import Graph from "./functional-components/Graph";

const Summary = React.forwardRef((props, ref) => {
  let counter = 0;
  let tempArr = [];
  return (
    <React.Fragment>
        {tempArr.map((item) => {
          counter += 1;
          return (
            <div className="result-container">
              <div className="question-field">
                {counter}. {item.question}
              </div>
              {/* {console.log("graph" + counter)} */}
              <div className="graph-section">
                <div className="graph">
                  <Graph Question={item.question} count={counter} />
                </div>
                <div className="sub-graph"></div>
              </div>
            </div>
          );
        })}
    </React.Fragment>
  );
})

export default Summary;
