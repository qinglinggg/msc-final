import React, { Component } from "react";
import { Link } from "react-router-dom";
import dummyItemImage from "./images/form.png";

class Page1Items extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Link to={`/dashboard/formId/${this.props.data.formId}`} className="item-container">
        <img id="item-image" src={dummyItemImage} />
        <div className="item-meta">
          <div id="item-name">{this.props.data.title}</div>
          <div id="item-desc">
            {this.props.data.description}
          </div>
        </div>
      </Link>
    );
  }
}

export default Page1Items;
