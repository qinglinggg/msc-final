import React, { Component } from "react";
import Graph from "./functional-components/Graph";

class Summary extends React.Component {
  render() {
    let counter = 0;
    return (
      <React.Fragment>
        {this.props.formItems_data.map((data) => {
          counter += 1;
          return (
            <div className="result-container">
              <div className="question-field">
                {counter}. {data}
              </div>
              {/* {console.log("graph" + counter)} */}
              <div className="graph-section">
                <div className="graph">
                  <Graph Question={data} count={counter} />
                </div>
                <div className="sub-graph"></div>
              </div>
            </div>
          );
        })}
      </React.Fragment>
    );
  }
}

export default Summary;
