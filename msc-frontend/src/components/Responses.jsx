import React, { Component } from "react";

class Responses extends React.Component {

  render() {
    let tempArr = [];
    let counter = 0;
    return (
    <React.Fragment>
      {tempArr.map((item, i) => {
        counter += 1;
        return (
          <div className="result-container">
            <div className="question-field">
              <span>{counter}. {item.question}</span>
              <span>{this.props.responseData[i]}</span>
            </div>
          </div>
        );
      })}
      {counter === 0 ? (
        <span className="no-response">There is no response yet.</span>
      ) : null}
    </React.Fragment>);
  }
}

export default Responses;
