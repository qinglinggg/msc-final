import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import dummyProfile from "./images/woman.jpg";

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
      if(this.state.currentUser)
        if(this.state.currentUser.profileImage != null && this.state.currentUser.profileImage != "") this.setState({prImage: this.state.currentUser.profileImage});
        else this.setState({prImage: null});
    });
  }

  displayPicture() {
    if(!this.state.currentUser || !this.state.currentUser.fullname) return;
    let splitted = this.state.currentUser.fullname.split(" ");
    if(splitted){
      let init = ""
      splitted.map((val) => {
        init += val[0];
      });
      return init;
    }
    return null;
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
          { this.state.prImage ? (<img id="pr-image" className="profile-image" src={this.state.prImage}/>) : (<div className="profile-image">{this.displayPicture()}</div>) }
        </div>
      </nav>
    );
  }
}

export default Navbar;
