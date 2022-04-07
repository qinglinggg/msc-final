import React, { Component } from 'react';
import { Link } from "react-router-dom";
import imgWoman from "../images/woman.jpg";


class AdminDashboard extends Component {
    state = { 
      user: "MSC ADMIN", 
      currentPage: 0,
      config: {
        IPHost: "http://10.12.50.109:8080",
        EmailDNS: "http://kpproxygsit:8080"
      }
    } 

    logHistory = [
      {
        logDate: "Thursday, 21 Oktober 2021",
        logTime: "08.00.05",
        logMessage: "crd01212312 has been generated, using multiple choice type."
      },
      {
        logDate: "Thursday, 21 Oktober 2021",
        logTime: "07.59.15",
        logMessage: "tr001213321 has been updated successfully."
      },
    ]

    supportHistory = [
      {
        name: "Benny Kurniawan",
        message: "Tampilan aplikasi bisa dibuat lebih intuitif."
      },
      {
        name: "Setiawan Harjanto",
        message: "Overall saya cukup nyaman dengan aplikasinya, mungkin ke depannya bisa ditambahkan fitur pada cardnya, seperti validasi input yang lebih beragam. Sangat membantu kami dalam mengembangkan produk kami."
      },
      {
        name: "Benny Kurniawan",
        message: "Tampilan aplikasi bisa dibuat lebih intuitif."
      },
      {
        name: "Setiawan Harjanto",
        message: "Overall saya cukup nyaman dengan aplikasinya, mungkin ke depannya bisa ditambahkan fitur pada cardnya, seperti validasi input yang lebih beragam. Sangat membantu kami dalam mengembangkan produk kami."
      },
      {
        name: "Setiawan Harjanto",
        message: "Overall saya cukup nyaman dengan aplikasinya, mungkin ke depannya bisa ditambahkan fitur pada cardnya, seperti validasi input yang lebih beragam. Sangat membantu kami dalam mengembangkan produk kami."
      }
    ]

    displayMenu() {
      return (
        <React.Fragment>
          <div className={this.state.currentPage == 1 ? "admin-sub-menu-active" : "admin-sub-menu"} onClick={() => {this.setState({currentPage: 1})}}>
            Logging
          </div>
          <div className="admin-menu-divider" />
          <div className={this.state.currentPage == 2 ? "admin-sub-menu-active" : "admin-sub-menu"} onClick={() => {this.setState({currentPage: 2})}}>
            Support
          </div>
          <div className="admin-menu-divider" />
          <div className={this.state.currentPage == 3 ? "admin-sub-menu-active" : "admin-sub-menu"} onClick={() => {this.setState({currentPage: 3})}}>
            Configuration
          </div>
          <div className="admin-menu-divider" />
          <Link to="/" className="admin-sub-menu" id="sub-menu-exit">
            Exit
          </Link>
          <div className="admin-menu-divider" />
        </React.Fragment>
      )
    }

    displayWelcomeText() {
      return (
        <React.Fragment>
          <div id="welcome-box">
            <div id="welcome-title">
              SELAMAT DATANG, {this.state.user}!
            </div>
            <div id="welcome-quotes">
              Hari baru, semangat baru.
            </div>
          </div>
        </React.Fragment>
      )
    }

    displayLogging() {
      return (
        <React.Fragment>
          {this.logHistory.map((log) => {
            return (
              <div id="logging-box">
                <div id="logging-datetime">
                  <div id="logging-date">{log.logDate}</div>
                  <div id="logging-time">{log.logTime}</div>
                </div>
                <div id="logging-message">{log.logMessage}</div>
              </div>
            )
          })}
        </React.Fragment>
      )
    }

    displaySupport() {
      return (
        <React.Fragment>
          {this.supportHistory.map((support) => {
            return (
              <div id="support-box">
                <div id="support-left-box">
                  <img src={imgWoman} id="support-image" alt="" />
                </div>
                <div id="support-divider"></div>
                <div id="support-right-box">
                  <div id="support-name">{support.name}</div>
                  <div id="support-message">{support.message}</div>
                </div>
              </div>
            )
          })}
        </React.Fragment>
      )
    }

    handleConfigChange(changed, value) {
      let newConfig = this.state.config;
      newConfig[changed] = value;
      this.setState({ config: newConfig });
    }

    displayConfig() {
      return (
        <React.Fragment>
          <div id="config-box">
            <div className="config-row">
              <div className="config-title">IP Host</div>
              <input type="url" className="config-input" value={this.state.config.IPHost} onChange={(e) => this.handleConfigChange("IPHost", e.target.value)}></input>
            </div>
            <div className="config-row">
              <div className="config-title">Email DNS</div>
              <input type="url" className="config-input" value={this.state.config.EmailDNS} onChange={(e) => this.handleConfigChange("EmailDNS", e.target.value)}></input>
            </div>
          </div>
        </React.Fragment>
      )
    }

    render() { 
        let page;
        if(this.state.currentPage === 0) page = this.displayWelcomeText();
        if(this.state.currentPage === 1) page = this.displayLogging();
        if(this.state.currentPage === 2) page = this.displaySupport();
        if(this.state.currentPage === 3) page = this.displayConfig();

        return (
        <React.Fragment>
          <div className="title-container">
            <div className="page-title">Admin Dashboard</div>
          </div>
          <div id="admin-page">
            <div id="admin-menu">
             {this.displayMenu()}
            </div>
            <div id="admin-content">{page}</div>
          </div>
        </React.Fragment>
        );
    }
}
 
export default AdminDashboard;