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
// import "bootstrap/dist/css/bootstrap.css";
// import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
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

const BASE_URL = "http://10.61.38.193:8080";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleCreateNewForm = this.handleCreateNewForm.bind(this);
    this.handleSetFormMessages = this.handleSetFormMessages.bind(this);
    this.handleCurrentSelectedForm = this.handleCurrentSelectedForm.bind(this);
    this.handleSetCurrentSelectedForm = this.handleSetCurrentSelectedForm.bind(this);
  }

  state = {
    userProfiles: [],

    // Home
    forms: [],
    formItems: ["test1", "test2"],
    
    waitingForms: [
      {
        title: "Survey 1",
        description: "Mengisi survey 1",
      },
    ],

    breadcrumbs: [
      {
        page: "Home",
        path: "/"
      }
    ],

    currentSelectedForm: "",

  }

  componentDidMount() {
    axios.get(`${BASE_URL}/api/v1/user-profiles`).then(async (res) => {
      const userProfiles = res.data;
      this.setState({ userProfiles });
    });
    axios.get(`${BASE_URL}/api/v1/forms`).then((res) => {
      const forms = res.data;
      this.setState({ forms });
    });
    this.setState({currentSelectedForm: ""});

    // axios.get(`${BASE_URL}/api/v1/waitingForms`).then(async (res) => {
    //   const waitingForms = res.data;
    //   this.setState({ waitingForms });
    //   console.log("Waiting Forms Update State:")
    //   console.log(this.state);
    // });
    // axios.get(`${BASE_URL}/api/v1/formItems`).then((res) => {
    //   const formItems = res.data;
    //   this.setState({ formItems });
    //   console.log("Form Items Update State:");
    //   console.log(this.state);
    // });

    // MENU

    let pageContainer = document.getElementById("page-container");
    let background = document.querySelector(".background");
    let navBar = document.getElementById("navbar");
    let body = document.getElementById("body");
    let menuClose = document.getElementById("menu-close");
    let sideMenu = document.getElementById("menu-container");
    if (menuClose) {
      menuClose.addEventListener("click", () => {
        body.classList.toggle("openMenu");
      });
    }
    let subMenus = document.querySelectorAll(".sub-menu");
    function activateButton() {
      subMenus.forEach((item) => {
        item.classList.remove("active");
      });
      this.classList.add("active");
    }
    function disableOpenMenu() {
      body.classList.toggle("openMenu");
    }
    if (subMenus) {
      subMenus.forEach((item) => {
        item.addEventListener("mouseover", activateButton);
        item.addEventListener("click", disableOpenMenu);
      });
    }
    sideMenu.style.left = "0";
  }

  handleCurrentSelectedForm(formId) {
    if(!this.state.currentSelectedForm){
      this.setState({currentSelectedForm: formId});
    }
  }

  async handleCreateNewForm(obj) {
    let formsData = [...this.state.forms];
    try {
      await axios({
        method: "post",
        url: `${BASE_URL}/api/v1/forms/insert`,
        data: obj,
        headers: { "Content-Type": "application/json" },
      }).then((response) => {
        formsData.push(response.data);
        this.setState({ forms: formsData });
        this.handleSetCurrentSelectedForm(response.data.formId);
        window.location = `/dashboard/formId/${response.data.formId}`;
      });
    } catch (error) {
      console.log(error);
    }
  }

  handleSendNewMessage(message) {
    let newArray = this.state.messages.messagesHistory;
    let newMessage = {
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

  handleSetCurrentSelectedForm(formId){
    this.setState({currentSelectedForm : formId});
  }

  render() {
    let count = 0;
    return (
      <Router>
        <Navbar user_data={this.state.userProfiles} />
        <div className="background"></div>
        <Menu 
          breadcrumbs={this.state.breadcrumbs}
          currentSelectedForm={this.state.currentSelectedForm}
        />
          <div className="page-container" id="page-container">
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    formsData={this.state.forms}
                    waitingForms={this.state.waitingForms}
                    handleCreateNewForm={this.handleCreateNewForm}
                    handleSetCurrentSelectedForm={this.handleSetCurrentSelectedForm}
                  />
                }
              />
              <Route
                path={`/dashboard/formId/:formId`}
                element={
                  <Dashboard 
                    forms={this.state.forms} 
                    breadcrumbs={this.state.breadcrumbs}
                    handleCurrentSelectedForm={this.handleCurrentSelectedForm}
                  />
                }
              />
              <Route
                path={`/design/formId/:formId`}
                element={
                  <Design 
                    breadcrumbs={this.state.breadcrumbs} 
                  />
                }
              />
              <Route
                path={`/invitation/formId/:formId`}
                element={
                  <Invitation 
                    breadcrumbs={this.state.breadcrumbs}
                  />
                }
              />
              <Route
                path={`/show-results/formId/:formId`}
                element={
                  <DataVisualization 
                    forms={this.state.forms} 
                    formItems_data={this.state.formItems} 
                    breadcrumbs={this.state.breadcrumbs}
                  />}
              />
              
              <Route
                path={`/feedback/formId/:formId`}
                element={
                  <Feedback
                    handleSetFormMessages={this.handleSetFormMessages}
                    breadcrumbs={this.state.breadcrumbs}
                  />
                }
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
                          breadcrumbs={this.state.breadcrumbs}
                        />
                      }
                    />
                  );
                }) : null}
              </Route>

              <Route
                path={`/admin`}
                element={<AdminDashboard />}
              />

              <Route
                path={`/preview/formId/:formId`}
                element={
                  <Preview 
                    forms={this.state.forms} 
                    breadcrumbs={this.state.breadcrumbs} 
                  />
                }
              />
          </Routes>
        </div>
      </Router>
    );
  }
}

export default App;
