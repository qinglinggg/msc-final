import React, { Component } from "react";

class Responses extends React.Component {

  render() {
    return (
    <React.Fragment>
      { this.props.data && this.props.data.length > 0 ? (
        <React.Fragment>
          {this.props.data.map((item, idx) => {
            console.log(item);
            return (
              <div className="result-container">
                <div className="question-field">
                  <span>{idx+1}. {item.content}</span>
                </div>
              </div>
            );
          })}
        </React.Fragment>
      ) : (<span className="no-response">There is no response yet.</span>)
      }
    </React.Fragment>);
  }
}

export default Responses;
