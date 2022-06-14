import logo from "./logo.svg";
import "./App.css";
import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import Menu from "./components/Menu";
import Invitation from "./components/Invitation";
import Design from "./components/Design";
import DataVisualization from "./components/Data-visualization";
import Feedback from "./components/Feedback";
import Message from "./components/Message";
import AdminDashboard from "./components/admin/AdminDashboard";
import Respondent from "./components/Respondent";
import LandingPage from "./components/LandingPage";
import UpdateProfile from "./components/functional-components/UpdateProfile"
import NotFound from "./components/NotFound";

const BASE_URL = "http://10.61.38.193:8080";
const APP_URL = "http://10.61.38.193:3001";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleCreateNewForm = this.handleCreateNewForm.bind(this);
    this.handleSetFormMessages = this.handleSetFormMessages.bind(this);
    this.handleSetLoggedInUser = this.handleSetLoggedInUser.bind(this);
    this.handleUpdateCurrentPage = this.handleUpdateCurrentPage.bind(this);
    this.checkLoggedInUser = this.checkLoggedInUser.bind(this);
    this.handleUpdateProfile = this.handleUpdateProfile.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleOpenedPopup = this.handleOpenedPopup.bind(this);
  }

  state = {
    allForms: [],
    rawInvitedFormLists: [],
    loggedInUser: null,
    currentUser: null,
    currentPage: "",
    openedPopup: false,
  }

  checkLoggedInUser(loggedIn) {
    if(!loggedIn || loggedIn == "") {
      if(window.location.pathname != '/') window.location = '/';
      return;
    }
    axios({
      method: "get",
      url: `${BASE_URL}/api/v1/user-profiles/get-session/${loggedIn}`
    }).then((res) => {
      if(!res.data) return;
      let currentKey = res.data["bearerToken"];
      let ownedKey = JSON.parse(sessionStorage.getItem("bearer_token"));
      if (this.state.loggedInUser == res.data["userId"] && ownedKey) return;
      if(currentKey == ownedKey) {
        this.setState({ loggedInUser : res.data["userId"] });
      } else {
        localStorage.clear();
      }
    });
  }

  handleUpdate() {
    this.setState({ updateState: !this.state.updateState });
  }

  handleLogout() {
    localStorage.clear();
    sessionStorage.clear();
    this.setState({ loggedInUser: "" });
    if(window.location.pathname != '/'){
      window.location = '/';
    }
  }

  componentDidMount() {
    setInterval(() => {
      let loggedIn = localStorage.getItem("loggedInUser");
      if (loggedIn && loggedIn != "") {
        // console.log("yes");
        loggedIn = JSON.parse(loggedIn);
        this.checkLoggedInUser(loggedIn);
      } else {
        let currentToken = sessionStorage.getItem("bearer_token");
        if(this.state.loggedInUser != "" || !this.state.loggedInUser) {
          this.setState({ loggedInUser : "" });
          localStorage.setItem("loggedInUser", "");
          if(window.location.pathname != "/") window.location = "/";
        }
        if (currentToken) sessionStorage.removeItem("bearer_token");
        return;
      }
    }, 1000);
    let body = document.getElementById("body");
    // MENU
    let menuClose = document.getElementById("menu-close");
    let sideMenu = document.getElementById("menu-container");
    if (menuClose) {
      menuClose.addEventListener("click", () => {
        body.classList.toggle("openMenu");
      });
    }
  }
  
  componentDidUpdate(prevProps, prevState) {
    if(this.state.loggedInUser && this.state.loggedInUser != prevState.loggedInUser && this.state.loggedInUser != "") {
      this.updateUserdata(this.state.loggedInUser);
    }
  }

  async updateUserdata(userId) {
    axios({
      method: "get",
      url: `${BASE_URL}/api/v1/user-profiles/${userId}`
    }).then((res) => {
      if(res.data) this.setState({currentUser: res.data});
    });
    await axios.get(`${BASE_URL}/api/v1/forms/owned-form/${userId}`).then((res) => {
      const forms = res.data;
      console.log("owned form");
      console.log(res.data);
      localStorage.setItem("formLists", JSON.stringify(forms));
    })
    await axios.get(`${BASE_URL}/api/v1/forms/invited-form-respondent/${userId}`).then((res) => {
      const invitedForms = res.data;
      localStorage.setItem("rawInvitedFormLists", JSON.stringify(invitedForms));
    }).catch((error) => {
      console.log(error);
    });
    let tempInvitedForms = JSON.parse(localStorage.getItem("rawInvitedFormLists"));
    if(tempInvitedForms){
      await axios({
        method: "post",
        url: `${BASE_URL}/api/v1/forms/invited-form/${userId}`,
        data: tempInvitedForms,
        headers: {"Content-Type": "application/json"}
      }).then((res) => {
        let index = 0;
        let invitedForms = res.data;
        console.log(invitedForms);
        invitedForms.map((form) => {
          form['formRespondentId'] = tempInvitedForms[index].formRespondentId;
          form['submitDate'] = tempInvitedForms[index].submitDate;
          form['inviteDate'] = tempInvitedForms[index].inviteDate;
          index++;
        });
        localStorage.setItem("invitedFormLists", JSON.stringify(invitedForms));
        localStorage.removeItem("rawInvitedFormLists");
      }).catch((error) => {
        console.log(error);
      });
    }
  }

  handleUpdateProfile(newLink) {
    if(!this.state.currentUser) return;
    let currentUser = this.state.currentUser;
    currentUser.profileImage = newLink;
    console.log(currentUser);
    this.setState({currentUser : currentUser});
  }

  handleOpenedPopup(value) {
    this.setState({openedPopup : value});
  }

  handleUpdateCurrentPage(value) {
    this.setState({currentPage : value});
  }

  async handleCreateNewForm(obj) {
    console.log(obj);
    try {
      await axios({
        method: "post",
        url: `${BASE_URL}/api/v1/forms/insert/${this.state.currentUser.userId}`,
        data: obj,
        headers: { "Content-Type": "application/json" },
      }).then((response) => {
        let tempList = localStorage.getItem("formLists");
        if(!tempList) tempList = [];
        else tempList = JSON.parse(tempList);
        tempList.push(response.data);
        localStorage.setItem("formLists", JSON.stringify(tempList));
        localStorage.setItem("selectedForm", JSON.stringify(response.data));
        this.handleUpdateCurrentPage("Dashboard");
        window.location = `/dashboard/formId/${response.data.formId}`;
      });
    } catch (error) {
      console.log(error);
    }
  }

  handleSetFormMessages(formMessages){
    this.setState({formMessages});
  }

  handleSetLoggedInUser(userId) {
    let obj = {"userId" : userId};
    axios({
      method: "post",
      url: `${BASE_URL}/api/v1/user-profiles/insert-session`,
      data: obj,
      headers: { "Content-Type" : "application/json" }
    }).then((res) => {
      let currentLogin = res.data["bearerToken"];
      console.log("bearer", currentLogin);
      sessionStorage.setItem("bearer_token", JSON.stringify(currentLogin));
      console.log(res.data["userId"]);
      localStorage.setItem("loggedInUser", JSON.stringify(res.data["userId"]));
    });
  }

  authentication() {
    return (
        <Routes>
            <Route 
              path="/"
              element={
              <LandingPage 
                handleSetLoggedInUser={this.handleSetLoggedInUser}
              />}
              key={"authPage"}
            />
        </Routes>
    );
  }

  formRouting() {
    return (
      <Routes>
        <Route 
          path={`/response/formId/:formId}`}
          element={<Respondent/>}
        />
      </Routes>
    )
  }

  async isAuthor(formId) {
    let flag = false;
    let user = localStorage.getItem("loggedInUser");
    if(user){
      user = JSON.parse(user);
      await axios({
        method:"get",
        url: `${BASE_URL}/api/v1/forms/is-author-exist/${formId}`,
        data: user,
        headers: { "Content-Type" : "text/plain" },
      }).then((res) => {
        if(res.data == 1) flag = true;
      })
    }
    if(!flag) window.location = `/404-not-found`;
    return flag;
  }

  appRouting() {
    let count = 0;
    return (
      <React.Fragment>
        <div className="landing-page-background" style={{backgroundColor: "rgba(215,215,215)"}}/>
        <Navbar 
          handleLogout={this.handleLogout}
          handleUpdate={this.handleUpdate}
          currentUser={this.state.currentUser}
        />
        <div className="background"></div>
        {this.state.updateState ? 
          <UpdateProfile currentUser={this.state.currentUser} handleUpdate={this.handleUpdate}
            handleUpdateProfile={this.handleUpdateProfile} handleOpenedPopup={this.handleOpenedPopup}/> : null}
        <Menu currentPage={this.state.currentPage}/>
        <div className="page-container" id="page-container">
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    updateUserdata={this.updateUserdata}
                    handleCreateNewForm={this.handleCreateNewForm}
                    openedPopup={this.state.openedPopup}
                  />
                }
                key={"homePage"}
              />
              <Route
                path={`/dashboard/formId/:formId`}
                element={
                  <Dashboard 
                    handleUpdateCurrentPage={this.handleUpdateCurrentPage}
                    isAuthor={this.isAuthor}
                  />
                }
                key={"dashboardPage"}
              />
              <Route
                path={`/design/formId/:formId`}
                element={
                  <Design />
                }
                key={"designPage"}
              />
              <Route
                path={`/invitation/formId/:formId`}
                element={
                  <Invitation />
                }
                key={"invitationPage"}
              />
              <Route
                path={`/show-results/formId/:formId`}
                element={
                  <DataVisualization
                    formItems_data={this.state.formItems}
                  />}
                key={"dataVisualizationPage"}
              />
              
              <Route
                path={`/feedback/formId/:formId`}
                element={
                  <Feedback
                    // handleSetFormMessages={this.handleSetFormMessages}
                  />}
                key={"feedbackPage"}
              />
              <Route
                path={`/feedback/formId/:formId/:feedbackId`}
                element={
                  <Message
                    // handleSendNewMessage={this.handleSendNewMessage}
                  />
                }
                key={"feedbackMessagePage"}
              />
              <Route
                path={`/admin`}
                element={<AdminDashboard />}
                key={"adminPage"}
              />

              <Route 
                path={`/response/formId/:formId`}
                element={<Respondent />}
                key={"respondentPage"}
              />
              <Route 
                path="/404-not-found"
                element={
                  <NotFound />
                }
              />
          </Routes>
        </div>
      </React.Fragment>
    );
  } 

  render() {
    return (
      <Router>
        { this.state.loggedInUser || this.state.loggedInUser == "" ? ( this.state.loggedInUser == "" ? this.authentication() : this.appRouting()) : <div>Loading application...</div>}
      </Router>
    );
  }
}

export default App;
