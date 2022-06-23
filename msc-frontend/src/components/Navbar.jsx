import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
// import dummyProfile from "./images/woman.jpg";
import ProfilePicture from "./functional-components/ProfilePicture"
import Popup from "reactjs-popup";

const BASE_URL = "http://10.61.38.193:8081";

class Navbar extends React.Component {
  constructor() {
    super();
    this.updateDisplayName = this.updateDisplayName.bind(this);
    this.updateDisplayEmail = this.updateDisplayEmail.bind(this);
  }

  state = {
    prImage: null,
    displayName: null,
    displayEmail: null
  }

  updateDisplayName() {
    let currentName = this.props.currentUser.fullname;
    let splitted = currentName.toLowerCase().split(' ');
    for (let i=0; i<splitted.length; i++) {
      splitted[i] = splitted[i].charAt(0).toUpperCase() + splitted[i].substring(1);
    }
    this.setState({ displayName: splitted.join(' ') });
  }

  updateDisplayEmail() {
    let currentEmail = this.props.currentUser.email;
    let lower = currentEmail.toLowerCase();
    this.setState({ displayEmail: lower });
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.currentUser != prevProps.currentUser && this.props.currentUser != null) {
      this.updateDisplayName();
      this.updateDisplayEmail();
    }
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
                      <span id="pr-username">{this.state.displayName}</span>
                      <span id="pr-email">{this.state.displayEmail}</span>
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
