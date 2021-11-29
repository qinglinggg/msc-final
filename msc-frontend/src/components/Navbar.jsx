import React, { Component } from "react";
import { Link } from "react-router-dom";
import dummyProfile from "./images/woman.jpg";

class Navbar extends React.Component {

  render() {
    return (
      <nav className="navbar">
          <Link to="/" id="app-title">
            MySurveyCompanion
          </Link>
          <div id="profile-container">
            {
            this.props.user_data.map((data) =>{
            return data.userId == "c28bd919-c043-403e-8f35-b606d7556b71" ?
              <div className="profile-preview">
                <span id="pr-username">{data.fullname}</span>
                <span id="pr-email">{data.email}</span>  
              </div> : null
            })}
            <img className="profile-image" src={dummyProfile} />
          </div>
      </nav>
    );
  }
}

export default Navbar;
