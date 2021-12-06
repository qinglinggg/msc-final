import React, { Component } from "react";
import iconMenubarWhite from "./images/menubarWhite.png";

class Menu extends React.Component {
  render() {
    return (
    <div className="menu-container">
      <div className="menu-title">
        <img src={iconMenubarWhite} alt="" />
      </div>
      <div className="sub-menu">Dashboard</div>
      <div className="sub-menu">Design</div>
      <div className="sub-menu">Invitation</div>
      <div className="sub-menu">Data Visualization</div>
      <div className="sub-menu">Feedback</div>
      <div className="sub-menu">Back to Home</div>
    </div>
    );
  }
}

export default Menu;
