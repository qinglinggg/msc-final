import React, { Component } from "react";
import { Link } from "react-router-dom";

class Navbar extends React.Component {
  render() {
    return (
      <nav className="navbar">
        <div>
          <Link to="/" id="app-title">
            MySurveyCompanion
          </Link>
          <div id="profile-container">
            <div className="profile-preview">
              <span id="pr-username">Username</span>
              <span id="pr-email">Email</span>
            </div>
            <img className="profile-image" src="./ricky.jpg" />
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;
