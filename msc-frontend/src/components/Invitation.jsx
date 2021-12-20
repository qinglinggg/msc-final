import React, { Component } from "react";
import Menu from "./Menu";
import iconMenubarGrey from "./images/menubarGrey.png";
import iconLINE from "./images/iconLINE.png";
import iconTelegram from "./images/iconTelegram.png";
import iconWhatsApp from "./images/iconWhatsApp.png";
import iconLink from "./images/iconLink.png";
import AutoHeightTextarea from "./functional-components/AutoheightTextarea";
import TargetedUserEmail from "./functional-components/TargetedUserEmail";

class Invitation extends React.Component {
  constructor() {
    super();
    this.handleMenu = this.handleMenu.bind(this);
    this.handleTargetedUserEmail = this.handleTargetedUserEmail.bind(this);
    // this.handleTags = this.handleTags.bind(this);
  }

  state = {
    openMenu: false,
    pageSelection: true,
    userInvited: [
      {
        number: 1,
        name: "Albert Cony Pramudita",
        email: "albert_pramudita@bca.co.id",
        status: "Completed",
        datetime: "Submitted at 08/12/2021 09:30PM",
      },
      {
        number: 2,
        name: "Dian Fransiska Handayani",
        email: "dian_fransiska@bca.co.id",
        status: "Completed",
        datetime: "Submitted at 08/12/2021 09:30PM",
      },
    ],
    openTargetedUserEmail: false,
  };

  componentDidMount() {
    let body = document.getElementById("body");
    let menuBtn = document.getElementById("menu-icon");
    menuBtn.addEventListener("click", () => {
      body.classList.toggle("openMenu");
    });
  }

  handleMenu() {
    this.setState({ openMenu: !this.state.openMenu });
  }

  displayMenu() {
    return (
      <React.Fragment>
        <Menu />
      </React.Fragment>
    );
  }

  handleOpenSharePage() {
    this.setState({ pageSelection: true });
  }

  displaySharePage() {
    return (
      <React.Fragment>
        <div id="invitation-share-container">
          <div id="invitation-share-publicly-box">
            <div id="invitation-share-publicly-innerbox">
              <div id="invitation-share-publicly-innerbox-text">
                Start sharing your questionnaire publicly!
              </div>
              <div id="invitation-share-publicly-innerbox-linkcontainer">
                <img src={iconLink} alt="" />
                <div id="invitation-share-publicly-innerbox-linkbox"></div>
              </div>
              <div id="invitation-share-publicly-innerbox-iconcontainer">
                <img
                  className="invitation-share-publicly-innerbox-icon"
                  src={iconLINE}
                  alt=""
                />
                <img
                  className="invitation-share-publicly-innerbox-icon"
                  src={iconTelegram}
                  alt=""
                />
                <img
                  className="invitation-share-publicly-innerbox-icon"
                  src={iconWhatsApp}
                  alt=""
                />
              </div>
            </div>
          </div>
          <div id="invitation-share-divider">
            <div id="invitation-share-divider-line"></div>
            <h4 id="invitation-share-divider-text">OR</h4>
            <div id="invitation-share-divider-line"></div>
          </div>
          <div id="invitation-share-privately-box">
            <div className="invitation-share-privately-innerbox">
              Share it privately.
            </div>
            <div
              id="invitation-share-privately-render"
              onClick={() => this.handleTargetedUserEmail()}
            >
              {this.state.openTargetedUserEmail ? (
                this.displayTargetedUserEmailBox()
              ) : (
                <div id="invitation-share-privately-button">
                  Type your targeted user email
                </div>
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  handleTargetedUserEmail() {
    this.setState({ openTargetedUserEmail: true });
  }

  displayTargetedUserEmailBox() {
    return (
      <React.Fragment>
        <div
          className="invitation-share-privately-innerbox"
          id="invitation-share-privately-innerbox-desc"
        >
          Enter your targeted user email.
        </div>
        <TargetedUserEmail></TargetedUserEmail>
      </React.Fragment>
    );
  }

  handleOpenTrackPage() {
    this.setState({ pageSelection: false });
  }

  displayTrackPage() {
    // for (let i = 0; i < 4; i++) {
    //   // push data asli disini
    //   this.state.userInvited.push(i);
    // }

    return (
      <React.Fragment>
        <div id="invitation-track-container">
          {this.state.userInvited.map((value) => {
            return (
              <React.Fragment>
                <div id="invitation-track-box">
                  <div
                    className="invitation-track-innerbox"
                    id="invitation-track-innerbox-number"
                  >
                    {value.number}.
                  </div>
                  <div
                    className="invitation-track-innerbox"
                    id="invitation-track-innerbox-name"
                  >
                    {value.name}
                  </div>
                  <div
                    className="invitation-track-innerbox"
                    id="invitation-track-innerbox-email"
                  >
                    {value.email}
                  </div>
                  <div
                    className="invitation-track-innerbox"
                    id="invitation-track-innerbox-status"
                  >
                    {value.status}
                  </div>
                  <div
                    className="invitation-track-innerbox"
                    id="invitation-track-innerbox-datetime"
                  >
                    {value.datetime}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </React.Fragment>
    );
  }

  render() {
    let page;
    if (this.state.pageSelection) {
      page = this.displaySharePage();
    } else {
      page = this.displayTrackPage();
    }
    // if (this.state.openTargetedUserEmail) {
    //   this.handleTags();
    // }

    return (
      <React.Fragment>
        <div className="title-container" id="title-invitation">
          <div
            className="menu-icon"
            id="menu-icon"
            onClick={() => this.handleMenu()}
          >
            <img id="menu-icon-img" src={iconMenubarGrey} alt="" />
          </div>
          <div className="page-title">Invitation</div>
          {/* <div className="title">Dashboard</div> */}
        </div>
        <div id="page-content">
          <div className="menu-bar">
            <div id="page-selection">
              <div
                onClick={() => this.handleOpenSharePage()}
                className="page-button clicked"
                id="btn-page1"
              >
                Share
              </div>
              <div
                onClick={() => this.handleOpenTrackPage()}
                className="page-button"
                id="btn-page2"
              >
                Track
              </div>
            </div>
          </div>
          {page}
        </div>
      </React.Fragment>
    );
  }
}
export default Invitation;
