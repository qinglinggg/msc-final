import React, { Component } from "react";
import Graph from "./functional-components/Graph";

const Summary = React.forwardRef((props, ref) => {
  let counter = 0;

  return (
    <React.Fragment>
      {props.data ? props.data.map((item, i) => {
        counter += 1;
        return (
          <div className="result-container" key={"summary-" + i}>
            <div className="question-field">
              {counter}. {item.content}
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
})

export default Summary;
