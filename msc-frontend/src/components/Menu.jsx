import React, { Component } from "react";
import { Link } from "react-router-dom";
import iconMenubarClose from "./images/menubarClose.png";

class Menu extends React.Component {
  render() {
    return (
      <div className="menu-container" id="menu-container">
        <div className="menu-title" id="menu-title">
          <img src={iconMenubarClose} alt="" />
        </div>
        <div className="sub-menu">
          <Link to="/item1/dashboard">Dashboard</Link>
        </div>
        <div className="sub-menu">Design</div>
        <div className="sub-menu">
          <Link to="/item1/invitation">Invitation</Link>
        </div>
        <div className="sub-menu">Data Visualization</div>
        <div className="sub-menu">Feedback</div>
        <div className="sub-menu">Back to Home</div>
        <div className="indicator"></div>
      </div>
    );
  }
}

export default Menu;
