import React, { Component } from 'react';
import { Link } from "react-router-dom";

class AdminDashboard extends Component {
    state = { 
      user: "MSC ADMIN", 
      currentPage: 0
    } 

    logHistory = {
      logDate: "Thursday, 21 Oktober 2021",
      logTime: "08.00.05",
      logMessage: "crd01212312 has been generated, using multiple choice type."
    }

    displayMenu() {
      return (
        <React.Fragment>
          <div className="admin-sub-menu" onClick={() => {this.setState({currentPage: 1})}}>
            Logging
          </div>
          <div className="admin-menu-divider" />
          <div className="admin-sub-menu" onClick={() => {this.setState({currentPage: 2})}}>
            Support
          </div>
          <div className="admin-menu-divider" />
          <div className="admin-sub-menu" onClick={() => {this.setState({currentPage: 3})}}>
            Configuration
          </div>
          <div className="admin-menu-divider" />
          <Link to="/exit" className="admin-sub-menu">
            Exit
          </Link>
          <div className="admin-menu-divider" />
        </React.Fragment>
      )
    }

    displayWelcomeText() {
      return (
        <React.Fragment>
          <div>
            SELAMAT DATANG, {this.state.user}!
          </div>
          <div>
            Hari baru, semangat baru.
          </div>
        </React.Fragment>
      )
    }

    displayLogging() {
      return (
        <React.Fragment>
          {this.logHistory.map((log) => {
            <div id="logging-box">
              <div id="logging-date">{log.logDate}</div>
              <div id="logging-time">{log.logTime}</div>
              <div id="logging-message">{log.logMessage}</div>
          </div>
          })}
        </React.Fragment>
      )
    }

    displaySupport() {
      return (
        <React.Fragment>
          Support
        </React.Fragment>
      )
    }

    displayConfig() {
      return (
        <React.Fragment>
          Config
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