import React, { Component } from "react";
import Menu from "./Menu";
import iconMenubarGrey from "./images/menubarGrey.png";
import iconLINE from "./images/iconLINE.png";
import iconTelegram from "./images/iconTelegram.png";
import iconWhatsApp from "./images/iconWhatsApp.png";
import iconLink from "./images/iconLink.png";

class Invitation extends React.Component {

  state = {
    pageSelection: true,
  };

  componentDidMount() {
    let body = document.getElementById("body");
    let menuBtn = document.getElementById("menu-icon");
    menuBtn.addEventListener("click", () => {
      body.classList.toggle("openMenu");
    });
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
            <div id="invitation-share-privately-innerbox">
              Share it privately.
            </div>
            <div id="invitation-share-privately-button">
              Type your targeted user email
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  handleOpenTrackPage() {
    this.setState({ pageSelection: false });
  }

  displayTrackPage() {
    return (
      <React.Fragment>
        <div></div>
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

    return (
      <React.Fragment>
        <div className="container" id="dashboard-home">
          {this.state.openMenu ? (<Menu/>) : null}
          <div className="page-container" id="page-container">
            <div className="title-container">
                <div className="menu-icon" id="menu-icon">
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
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default Invitation;
