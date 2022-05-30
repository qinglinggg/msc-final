import logo from "./logo.svg";
import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
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
import RouteDashboard from "./components/Dashboard";
import { render } from "react-dom";
import AdminDashboard from "./components/admin/AdminDashboard";
import Respondent from "./components/Respondent";
import LandingPage from "./components/LandingPage";

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
  }

  state = {
    allForms: [],
    rawInvitedFormLists: [],
    loggedInUser: "",
    currentPage: "",
    isRefreshed: false,
  }

  checkLoggedInUser() {
    let tempUser = localStorage.getItem("loggedInUser");
    let currentUser = this.state.loggedInUser;
    if (tempUser) {
      tempUser = JSON.parse(tempUser);
      if(tempUser != currentUser) {
        this.setState({loggedInUser: tempUser});
        this.setState({isRefreshed : false});
      }
    } else if(currentUser){
      if(this.state.isRefreshed == false) {
        this.setState({isRefreshed : true}, () => 
        window.location.href = APP_URL);
      }
    } else if(!tempUser){
      if(window.location.pathname != '/'){
        window.location = '/';
      }
    }
  }

  componentDidMount() {
    setInterval(() => this.checkLoggedInUser(), 1000);
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
    if(this.state.loggedInUser != prevState.loggedInUser && this.state.loggedInUser != "") {
      this.updateUserdata(this.state.loggedInUser);
    }
  }

  componentWillUnmount(){
    localStorage.removeItem("loggedInUser");
  }

  async updateUserdata(userId) {
    console.log("update");
    await axios.get(`${BASE_URL}/api/v1/forms/owned-form/${userId}`).then((res) => {
      const forms = res.data;
      localStorage.setItem("formLists", JSON.stringify(forms));
    });
    await axios.get(`${BASE_URL}/api/v1/forms/invited-form-respondent/${userId}`).then((res) => {
      const invitedForms = res.data;
      localStorage.setItem("rawInvitedFormLists", JSON.stringify(invitedForms));
      // this.setState({rawInvitedFormLists : invitedForms});
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
        const invitedForms = res.data;
        invitedForms.map((form) => {
          form['formRespondentId'] = tempInvitedForms[index].formRespondentId;
          form['submitDate'] = tempInvitedForms[index].submitDate;
          index++;
        });
        localStorage.setItem("invitedFormLists", JSON.stringify(invitedForms));
      }).catch((error) => {
        console.log(error);
      });
    }
  }

  handleUpdateCurrentPage(value) {
    this.setState({currentPage : value});
  }

  async handleCreateNewForm(obj) {
    try {
      await axios({
        method: "post",
        url: `${BASE_URL}/api/v1/forms/insert`,
        data: obj,
        headers: { "Content-Type": "application/json" },
      }).then((response) => {
        let tempList = localStorage.getItem("formLists");
        tempList = JSON.parse(tempList);
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

  // handleSendNewMessage(message) {
  //   let newArray = this.state.messages.messagesHistory;
  //   let newMessage = {
  //     // nanti diubah
  //     userID: 2, // user id pemilik form
  //     message: message,
  //     timestamp: "3.48 PM",
  //   };
  //   newArray.push(newMessage);
  //   this.setState({ messageHistory: newArray });
  // }

  handleSetFormMessages(formMessages){
    this.setState({formMessages});
  }

  handleSetLoggedInUser(userId) {
    localStorage.setItem("loggedInUser", JSON.stringify(userId));
    this.setState({loggedInUser : userId});
  }

  authentication() {
    // console.log("this.authentication");
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

  appRouting() {
    let count = 0;
    return (
      <React.Fragment>
        <Navbar />
        <div className="background"></div>
        <Menu currentPage={this.state.currentPage}/>
        <div className="page-container" id="page-container">
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    handleCreateNewForm={this.handleCreateNewForm}
                  />
                }
                key={"homePage"}
              />
              <Route
                path={`/dashboard/formId/:formId`}
                element={
                  <Dashboard 
                  handleUpdateCurrentPage={this.handleUpdateCurrentPage}
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
                element={<Respondent/>}
                key={"respondentPage"}
              />
              
          </Routes>
          {/* {this.formRouting()} */}
        </div>
      </React.Fragment>
    );
  } 

  render() {
    return (
      <Router>
        { this.state.loggedInUser == "" ?
            this.authentication() : 
            this.appRouting()
        }
      </Router>
    );
  }
}

export default App;
