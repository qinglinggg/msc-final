import React, { Component } from "react";
import { Link } from "react-router-dom";

class Menu extends React.Component {
  render() {
    return (
      <div className="menu-container" id="menu-container">
        <div className="menu-close-container">
          <ion-icon name="close-outline" id="menu-close"></ion-icon>
        </div>
        <Link to="/item1/dashboard" className="sub-menu">Dashboard</Link>
        <Link to="/item1/design" className="sub-menu">Design</Link>
        <Link to="/item1/invitation" className="sub-menu">Invitation</Link>
        <Link to="/item1/show-results" className="sub-menu">Data Visualization</Link>
        <Link to="/item1/show-results" className="sub-menu">Feedback</Link>
        <Link to="/item1/show-results" className="sub-menu">Back to Home</Link>
      </div>
    );
  }
}

export default Menu;
