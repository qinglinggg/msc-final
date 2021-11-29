import React, { Component } from "react";
import dummyItemImage from "./images/form.png";

class Page1Items extends React.Component {
  render() {
    return (
      <div className="item-container">
        <img id="item-image" src={dummyItemImage} />
        <div className="item-meta">
          <div id="item-name">{this.props.data.title}</div>
          <div id="item-desc">
            {this.props.data.description}
          </div>
        </div>
      </div>
    );
  }
}

export default Page1Items;
