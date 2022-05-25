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
    if (sideMenu) sideMenu.style.left = "0";
    // form routing
    axios.get(`${BASE_URL}/api/v1/forms/`).then((res) => {
      this.setState({allForms : res.data});
    })
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
  
  componentDidUpdate(prevProps, prevState) {
    if(this.state.loggedInUser != prevState.loggedInUser && this.state.loggedInUser != "") {
      this.updateUserdata(this.state.loggedInUser);
    }
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
              />
              <Route
                path={`/dashboard/formId/:formId`}
                element={
                  <Dashboard 
                  handleUpdateCurrentPage={this.handleUpdateCurrentPage}
                  />
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
                  // console.log(message);
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
