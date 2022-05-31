import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
// import dummyProfile from "./images/woman.jpg";
import ProfilePicture from "./functional-components/ProfilePicture"

const BASE_URL = "http://10.61.38.193:8080";

class Navbar extends React.Component {
  state = {
    currentUser: {},
    prImage: null,
  }
  
  componentDidMount() {
    let currentId = JSON.parse(localStorage.getItem("loggedInUser"));
    console.log(currentId);
    if(currentId) axios({
      method: "get",
      url: `${BASE_URL}/api/v1/user-profiles/${currentId}`
    }).then((res) => {
      if(res.data) this.setState({currentUser: res.data});
    });
  }

  render() {
    return (
      <nav className="navbar" id="navbar">
        <Link to="/" id="app-title">
          MySurveyCompanion
        </Link>
        <div id="profile-container">
          {this.state.currentUser ? (
              <div className="profile-preview">
                <span id="pr-username">{this.state.currentUser.fullname}</span>
                <span id="pr-email">{this.state.currentUser.email}</span>
              </div>
            ) : null
          }
          <ProfilePicture id="pr-image" user={this.state.currentUser}></ProfilePicture>
        </div>
      </nav>
    );
  }
}

export default Navbar;
