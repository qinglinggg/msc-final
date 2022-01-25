import logo from "./logo.svg";
import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

const BASE_URL = 'http://localhost:8080';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.handleCreateNewForm = this.handleCreateNewForm.bind(this);
  }

  state = {
    userProfiles: [],

    // Home
    forms: [],
    waitingForms: [
      {
        title: "Survey 1",
        description: "Mengisi survey 1",
      },
    ],

    // inside Forms:
    formItems: ["Test", "Test2"],
    formMessages: [
      {
        userName: "Sari Sulaiman",
        messagesHistory: [
          {
            userID: 1,
            message:
              "Permisi, saya sudah dapat akses ke kuesioner ini. Mohon bantuannya. Permisi, saya sudah dapat akses ke kuesioner ini. Mohon bantuannya.",
            timestamp: "3.45 PM",
          },
          {
            userID: 2,
            message:
              "Iya selamat siang, Ibu Sari. Baik, akan kami bantu dengan segenap hati.",
            timestamp: "3.46 PM",
          },
          {
            userID: 1,
            message: "Baiklah kalau begitu.",
            timestamp: "3.46 PM",
          },
          {
            userID: 1,
            message: "Akan saya kabari jika sudah isi ya :)",
            timestamp: "3.47 PM",
          },
          {
            userID: 1,
            message: "Apakah form ini akan ditutup pada tanggal 10 Oktober?",
            timestamp: "3.47 PM",
          },
        ],
        lastMessage: "Apakah form ini akan ditutup pada tanggal 10 Oktober?",
        timestamp: "6.00 PM",
        read: false,
        tag: "3",
      },
      {
        userName: "Alvina Putri",
        lastMessage:
          "Ingin bertanya untuk pertanyaan nomor 6 apakah konteksnya secara umum atau dalam biro?",
        timestamp: "5.25 PM",
        read: true,
        tag: "Sent",
      },
      {
        userName: "Averina Nugroho",
        lastMessage: "Baik, nanti akan kami input pesan anda. Terima kasih!",
        timestamp: "5.20 PM",
        read: true,
        tag: "Sent",
      },
      {
        userName: "Jeanette Suryadi",
        lastMessage: "Sent an attachment",
        timestamp: "5.10 PM",
        read: false,
        tag: "2",
      },
      {
        userName: "William Putra",
        lastMessage:
          "Baik, akan saya isi formnya nanti malam ya. Terima kasih.",
        timestamp: "4.30 PM",
        read: false,
        tag: "1",
      },
      {
        userName: "Celine Jadja",
        lastMessage: "Maksudnya biro diisi dengan divisinya?",
        timestamp: "4.20 PM",
        read: false,
        tag: "1",
      },
      {
        userName: "Elvin Tanjaya",
        lastMessage:
          "Informasi biodata dapat disampaikan secara singkat saja Pak.",
        timestamp: "4.20 PM",
        read: true,
        tag: "Sent",
      },
      {
        userName: "Albertus Hadi Saputra",
        lastMessage: "Siap Pak.",
        timestamp: "3.15 PM",
        read: true,
        tag: "Sent",
      },
    ],
  };

  componentDidMount() {
    axios.get(`${BASE_URL}/api/v1/user-profiles`).then(async (res) => {
      const userProfiles = res.data;
      this.setState({ userProfiles });
    });
    axios.get(`${BASE_URL}/api/v1/forms`).then((res) => {
      const forms = res.data;
      this.setState({ forms });
    });
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

    let container = document.getElementById("container");
    let background = document.querySelector(".background");
    // let pageContainer = document.querySelector(".page-container");
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
    container.style.top = navBar.clientHeight + "px";
    container.style.height = window.innerHeight - navBar.clientHeight + "px";
    background.style.height =
      navBar.clientHeight + container.clientHeight + "px";
    let newValue = container.clientHeight - 100;
    sideMenu.style.height = newValue + "px";
    sideMenu.style.left = "0";
    sideMenu.style.top = container.style.top + "px";
  }

  async handleCreateNewForm(obj) {
    let formsData = [...this.state.forms];
    try {
      const response = await axios({
        method: "post",
        url: `${BASE_URL}/api/v1/forms/insert`,
        data: obj,
        headers: {"Content-Type": "application/json"}
      });
    } catch(error) {
      console.log(error);
    }
  }

  sendNewMessage(obj) {
    // axios
  }

  render() {
    let count = 0;
    return (
      <Router>
        <Navbar user_data={this.state.userProfiles} />
        <div className="background"></div>
        <div className="container" id="container">
          <Menu />
          <div className="page-container" id="page-container">
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    formsData={this.state.forms}
                    waitingForms={this.state.waitingForms}
                    handleCreateNewForm={this.handleCreateNewForm}
                  />
                }
              />
            </Routes>
            {this.state.forms.map(formData => {
              return (
                <Routes>
                  <Route
                  path={"/" + formData.formId + "/dashboard"}
                  element={
                    // <Dashboard formItems_data={this.state.forms.formItems} />
                    <Dashboard formItems_data={this.state.formItems} />
                  } // data dari item1
                  />
                  <Route
                  path={"/" + formData.formId + "/invitation"}
                  element={
                    // <Invitation formItems_data={this.state.forms.formItems} />
                    <Invitation formItems_data={this.state.formItems} />
                  } // data dari item1
                  />
                  <Route
                  path={"/" + formData.formId + "/design"}
                  element={<Design formItems_data={this.state.formItems} />} // data dari item1
                  />
                  <Route
                  path={"/" + formData.formId + "/show-results"}
                  element={
                    <DataVisualization formItems_data={this.state.formItems} />
                  } />
                  <Route
                  path={"/" + formData.formId + "/feedback"}
                  element={
                    <Feedback formMessages_data={this.state.formMessages} />
                  } />
                </Routes>
              );
            })}
            <Routes>
              {this.state.formMessages.map((message) => {
                count = count + 1;
                let path = "chat-" + count;
                return (
                  <Route
                    path={"item1/feedback/" + path}
                    element={<Message messages={message} Parent={this} />}
                  />
                );
              })}
            </Routes>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
