import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
// import dummyProfile from "./images/woman.jpg";
import ProfilePicture from "./functional-components/ProfilePicture"
import Popup from "reactjs-popup";

const BASE_URL = "http://10.61.38.193:8080";

class Navbar extends React.Component {
  state = {
    prImage: null,
  }

  render() {
    return (
      <nav className="navbar" id="navbar">
        <Link to="/" id="app-title">
          MySurveyCompanion
        </Link>
        <Popup
          trigger={(open) => 
            <div 
              id="profile-container">
              {this.props.currentUser ? (
                  <React.Fragment>
                    <div className="profile-preview">
                      <span id="pr-username">{this.props.currentUser.fullname}</span>
                      <span id="pr-email">{this.props.currentUser.email}</span>
                    </div>
                    <ProfilePicture user={this.props.currentUser}></ProfilePicture>
                  </React.Fragment>
                ) : null
              }
            </div>
          } position="bottom center">
            <div className="popup-wrapper">
              <div className="popup-content" id="popup-update" onClick={this.props.handleUpdate}>
               <ion-icon name="cloud-upload-outline" className="popup-icon"></ion-icon>
               <div className="popup-text">Update Profile</div>
              </div>
              <div className="popup-content" id="popup-logout" onClick={this.props.handleLogout}>
               <ion-icon name="log-out" className="popup-icon"></ion-icon>
               <div className="popup-text">Sign out</div>
              </div>
            </div>
        </Popup>
      </nav>
    );
  }
}

export default Navbar;
