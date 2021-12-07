import React, { Component } from "react";
import { Link } from "react-router-dom";
import dummyProfile from "./images/woman.jpg";

class Navbar extends React.Component {
  render() {
    return (
      <nav className="navbar" id="navbar">
        <Link to="/" id="app-title">
          MySurveyCompanion
        </Link>
        <div id="profile-container">
          {this.props.user_data.map((data) => {
            return data.userId == "bdd179ea-235f-4db6-b6da-e39270da091b" ? (
              <div className="profile-preview">
                <span id="pr-username">{data.fullname}</span>
                <span id="pr-email">{data.email}</span>
              </div>
            ) : null;
          })}
          <img className="profile-image" src={dummyProfile} />
        </div>
      </nav>
    );
  }
}

export default Navbar;
