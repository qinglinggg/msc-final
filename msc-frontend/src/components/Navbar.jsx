import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
// import dummyProfile from "./images/woman.jpg";
import ProfilePicture from "./functional-components/ProfilePicture"
import Popup from "reactjs-popup";

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
        <Popup
            trigger={(open) => 
              <div 
                id="profile-container">
                {this.state.currentUser ? (
                    <React.Fragment>
                      <div className="profile-preview">
                        <span id="pr-username">{this.state.currentUser.fullname}</span>
                        <span id="pr-email">{this.state.currentUser.email}</span>
                      </div>
                      <ProfilePicture user={this.state.currentUser}></ProfilePicture>
                    </React.Fragment>
                  ) : null
                }
              </div>
            } position="bottom center">
             <div className="popup-wrapper">
               <div className="popup-content" id="popup-logout" onClick={this.props.handleLogout}>
                <ion-icon name="log-out" id="popup-icon-logout"></ion-icon>
                <div className="popup-text">Sign out</div>
               </div>
             </div>
          </Popup>
      </nav>
    );
  }
}

export default Navbar;
