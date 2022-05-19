import logo from "./logo.svg";
import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
  Link,
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
import Preview from "./components/Preview";
import RouteDashboard from "./components/Dashboard";
import { render } from "react-dom";
import AdminDashboard from "./components/admin/AdminDashboard";
import Respondent from "./components/Respondent";
import LandingPage from "./components/LandingPage";

const BASE_URL = "http://10.61.38.193:8080";
const APP_URL = "http://10.61.38.193:3001";
// const APP_URL = "http://localhost:3000";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleCreateNewForm = this.handleCreateNewForm.bind(this);
    this.handleSetFormMessages = this.handleSetFormMessages.bind(this);
    this.handleSetLoggedInUser = this.handleSetLoggedInUser.bind(this);
  }

  state = {
    allForms: [],
    loggedInUser: "",
    waitingForms: [
      {
        title: "Survey 1",
        description: "Mengisi survey 1",
      },
    ],
  }

  componentDidMount() {
    let tempUser = localStorage.getItem("loggedInUser");
    if (tempUser) {
      tempUser = JSON.parse(tempUser);
      this.setState({loggedInUser: tempUser});
      axios.get(`${BASE_URL}/api/v1/forms/owned-form/${tempUser}`).then((res) => {
        const forms = res.data;
        localStorage.setItem("formLists", JSON.stringify(forms));
      });
      let tempInvitedForms = [];
      axios.get(`${BASE_URL}/api/v1/forms/invited-form-respondent/${tempUser}`).then((res) => {
        tempInvitedForms = res.data;
      })
      let invitedForms = [];
      if(tempInvitedForms.length > 0){
        try {
          axios({
            method: "GET",
            url: `${BASE_URL}/api/v1/forms/invited-form/${tempUser}`,
            data: tempInvitedForms
          }).then((res) => {
            invitedForms = res.data;
          })
        } catch(error) {
          console.log(error);
        }
        let index = 0;
        invitedForms.map((form) => {
          form['formRespondentId'] = tempInvitedForms[index].formRespondentId;
          form['submitDate'] = tempInvitedForms[index].submitDate;
          index++;
        });
      }
      localStorage.setItem("invitedFormLists", JSON.stringify(invitedForms));
    }
    let body = document.getElementById("body");
    // MENU
    let pageContainer = document.getElementById("page-container");
    let background = document.querySelector(".background");
    let navBar = document.getElementById("navbar");
    let menuClose = document.getElementById("menu-close");
    let sideMenu = document.getElementById("menu-container");
    if (menuClose) {
      menuClose.addEventListener("click", () => {
        body.classList.toggle("openMenu");
      });
    }
    if (sideMenu) sideMenu.style.left = "0";

    // form routing
    axios.get(`${BASE_URL}/api/v1/forms/`).then((res) => {
      this.setState({allForms : res.data});
    })

  }

  componentDidUpdate(prevState) {
    if(prevState.loggedInUser != this.state.loggedInUser && this.state.loggedInUser != ""){
      let tempBreadcrumbs = [{ page: "/", path: `${APP_URL}` }];
      localStorage.setItem("breadcrumbs", JSON.stringify(tempBreadcrumbs));
    }
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
        window.location = `/dashboard/formId/${response.data.formId}`;
      });
    } catch (error) {
      console.log(error);
    }
  }

  handleSendNewMessage(message) {
    let newArray = this.state.messages.messagesHistory;
    let newMessage = {
      // nanti diubah
      userID: 2, // user id pemilik form
      message: message,
      timestamp: "3.48 PM",
    };
    newArray.push(newMessage);
    this.setState({ messageHistory: newArray });
  }

  handleSetFormMessages(formMessages){
    this.setState({formMessages});
  }

  handleSetLoggedInUser(userId) {
    localStorage.setItem("loggedInUser", JSON.stringify(userId));
    this.setState({loggedInUser : userId});
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
        <Menu />
        <div className="page-container" id="page-container">
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    loggedInUser={this.state.loggedInUser}
                    // waitingForms={this.state.waitingForms}
                    handleCreateNewForm={this.handleCreateNewForm}
                  />
                }
              />
              <Route
                path={`/dashboard/formId/:formId`}
                element={
                  <Dashboard />
                }
              />
              <Route
                path={`/design/formId/:formId`}
                element={
                  <Design />
                }
              />
              <Route
                path={`/invitation/formId/:formId`}
                element={
                  <Invitation />
                }
              />
              <Route
                path={`/show-results/formId/:formId`}
                element={
                  <DataVisualization
                    formItems_data={this.state.formItems}
                  />}
              />
              
              <Route
                path={`/feedback/formId/:formId`}
                element={
                  <Feedback
                    handleSetFormMessages={this.handleSetFormMessages}
                  />}
              />
              <Route>
                {this.state.formMessages ? this.state.formMessages.map((message) => {
                  count = count + 1;
                  let path = "chat-" + count;

                  // coba2
                  console.log(message);
                  let user = axios.get(`${BASE_URL}/api/v1/feedback/by-feedback/get-user/${message.feedbackId}`);
                  let feedbackMessageList = axios.get(`${BASE_URL}/api/v1/feedback/by-feedback/${message.feedbackId}`);
                  
                  return (
                    <Route
                      path={`/feedback/formId/:feedbackId/${path}`}
                      element={
                        <Message
                          user={user}
                          messages={feedbackMessageList}
                          handleSendNewMessage={this.handleSendNewMessage}
                        />}
                    />
                  );
                }) : null}
              </Route>
              
              <Route
                path={`/preview/formId/:formId`}
                element={
                  <Preview
                    breadcrumbs={this.state.breadcrumbs} 
                  />
                }
              />

              <Route
                path={`/admin`}
                element={<AdminDashboard />}
              />

              <Route 
                path={`/response/formId/:formId`}
                element={<Respondent/>}
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
