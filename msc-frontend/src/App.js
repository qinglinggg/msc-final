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
import DateTimeService from "./components/functional-components/services/DateTimeService";

const BASE_URL = "http://10.61.54.168:8080";
const APP_URL = "http://10.61.54.168:3001";

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
    this.updateUserdata = this.updateUserdata.bind(this);
    this.refreshResponse = this.refreshResponse.bind(this);
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
    setInterval(async () => {
      await this.refreshResponse();
    }, 5000);
  }
  
  componentDidUpdate(prevProps, prevState) {
    if(this.state.loggedInUser && this.state.loggedInUser != prevState.loggedInUser && this.state.loggedInUser != "") {
      this.updateUserdata(this.state.loggedInUser);
    }
  }

  async updateUserdata(userId) {
    await axios({
      method: "get",
      url: `${BASE_URL}/api/v1/user-profiles/${userId}`
    }).then((res) => {
      if(res.data){
        const user = res.data;
        this.setState({ currentUser: user });
      }
    });
    await axios.get(`${BASE_URL}/api/v1/forms/owned-form/${userId}`).then((res) => {
      const forms = res.data;
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
    this.setState({currentUser : currentUser});
  }

  handleOpenedPopup(value) {
    this.setState({openedPopup : value});
  }

  handleUpdateCurrentPage(value) {
    this.setState({currentPage : value});
    localStorage.setItem("openState", JSON.stringify(false));
  }

  async handleCreateNewForm(obj) {
    try {
      await axios({
        method: "post",
        url: `${BASE_URL}/api/v1/forms/insert/${this.state.currentUser.userId}`,
        data: obj,
        headers: { "Content-Type": "application/json" },
      }).then(async (response) => {
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
      sessionStorage.setItem("bearer_token", JSON.stringify(currentLogin));
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
        method:"post",
        url: `${BASE_URL}/api/v1/forms/is-author-exist/${formId}`,
        data: user,
        headers: { "Content-Type" : "text/plain" },
      }).then((res) => {
        if(res.data == 1) flag = true;
      }).finally(() => {
        if(!flag) window.location = `/404-not-found`;
      })
    }
  }

  async updateLastEdited(formMetadata) {
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    let lastEditedObj = {
      formId: formMetadata.formId,
      userId: loggedInUser
    }
    await axios({
      method: "put",
      url: `${BASE_URL}/api/v1/forms/update-last-edited/${formMetadata.formId}`,
      data: lastEditedObj,
      headers: { "Content-Type" : "application/json" }
    }).catch((error) => console.log(error));
  }

  async refreshResponse() {
    let openState = localStorage.getItem("openState");
    if(openState) openState = JSON.parse(openState);
    else return;
    if(openState == true) return;
    let responseData = localStorage.getItem("responseData");
    if(!responseData) return;
    responseData = JSON.parse(responseData);
    let feedbackId = responseData.feedbackId;
    let formId = responseData.formId;
    if(feedbackId){
      let feedbackMessage = [];
      axios({
        method: "get",
        url: `${BASE_URL}/api/v1/feedback/by-feedback/${feedbackId}`,
      }).then((res) => {
        feedbackMessage = res.data;
        console.log("feedback message", feedbackMessage);
      }).finally(() => {
        console.log("feedbackMessage" , feedbackMessage.length);
        if(feedbackMessage.length == 0){
          axios.delete(`${BASE_URL}/api/v1/feedback/${feedbackId}`).then((res) => console.log("testt", res.data)).catch((error) => console.log(error));
          console.log("deleted");
        } 
      })
    }
    let alreadySubmitted = localStorage.getItem("alreadySubmitted");
    let isSubmitted = localStorage.getItem("isSubmitted");
    if(!alreadySubmitted && !isSubmitted){
      let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      axios({
        method: "delete",
        url: `${BASE_URL}/api/v1/forms/force-delete-form-respondent/${formId}`,
        data: loggedInUser,
        headers: { "Content-Type" : "text/plain" }
      }).then(() => {
        console.log("force delete formrespondentid");
      })
    }
    localStorage.removeItem("navigator");
    localStorage.removeItem("tempFormResponse");
    localStorage.removeItem("responseData");
  }; 

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
                    updateLastEdited={this.updateLastEdited}

                  />
                }
                key={"dashboardPage"}
              />
              <Route
                path={`/design/formId/:formId`}
                element={
                  <Design 
                    isAuthor={this.isAuthor} 
                    updateLastEdited={this.updateLastEdited}
                  />
                }
                key={"designPage"}
              />
              <Route
                path={`/invitation/formId/:formId`}
                element={
                  <Invitation 
                    isAuthor={this.isAuthor} 
                    updateLastEdited={this.updateLastEdited}
                  />
                }
                key={"invitationPage"}
              />
              <Route
                path={`/show-results/formId/:formId`}
                element={
                  <DataVisualization
                    formItems_data={this.state.formItems}
                    isAuthor={this.isAuthor}
                  />}
                key={"dataVisualizationPage"}
              />
              
              <Route
                path={`/feedback/formId/:formId`}
                element={
                  <Feedback
                    isAuthor={this.isAuthor}
                  />}
                key={"feedbackPage"}
              />
              <Route
                path={`/feedback/formId/:formId/:feedbackId`}
                element={
                  <Message
                    isAuthor={this.isAuthor}
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
