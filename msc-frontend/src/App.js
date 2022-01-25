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
import Preview from "./components/Preview";

class App extends React.Component {
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
    // formItems: ["Test", "Test2"],
    formItems: [
      {
        id: 1,
        question:
          "Dari skala 1-5, seberapa puaskah Anda terhadap fitur A pada Halo BCA?",
        questionType: "LS",
        arrayOptions: [
          {
            id: 1,
            label: "Option 1",
            value: "Tidak puas",
          },
          {
            id: 2,
            label: "Option 2",
            value: "Sedikit puas",
          },
          {
            id: 3,
            label: "Option 1",
            value: "Sangat puas",
          },
          // {
          //   id: 1,
          //   label: "Option 1",
          //   value: "Tidak puas",
          // },
          // {
          //   id: 2,
          //   label: "Option 2",
          //   value: "Sedikit puas",
          // },
          // {
          //   id: 3,
          //   label: "Option 1",
          //   value: "Sangat puas",
          // },
          // {
          //   id: 1,
          //   label: "Option 1",
          //   value: "Tidak puas",
          // },
          // {
          //   id: 2,
          //   label: "Option 2",
          //   value: "Sedikit puas",
          // },
          // {
          //   id: 3,
          //   label: "Option 1",
          //   value: "Sangat puas",
          // },
          // {
          //   id: 3,
          //   label: "Option 1",
          //   value: "Sangat puas",
          // },
        ],
        optionCounter: 3,
      },
      {
        id: 2,
        question:
          "Pada pertanyaan sebelumnya, Anda menjawab dengan skala dibawah 4. Apakah terdapat keluhan yang Anda hadapi selama menggunakan fitur A pada Halo BCA?",
        questionType: "SA",
      },
      {
        id: 3,
        question:
          "Centang 3 fitur yang paling bermanfaat dan sering Anda gunakan pada Halo BCA!",
        questionType: "CB",
        arrayOptions: [
          {
            id: 1,
            label: "Option 1",
            value: "Fitur A",
          },
          {
            id: 2,
            label: "Option 2",
            value: "Fitur B",
          },
          {
            id: 3,
            label: "Option 1",
            value: "Fitur C",
          },
          {
            id: 1,
            label: "Option 1",
            value: "Fitur A",
          },
          {
            id: 2,
            label: "Option 2",
            value: "Fitur B",
          },
          {
            id: 3,
            label: "Option 1",
            value: "Fitur C",
          },
          {
            id: 1,
            label: "Option 1",
            value: "Fitur A",
          },
          {
            id: 2,
            label: "Option 2",
            value: "Fitur B",
          },
          {
            id: 3,
            label: "Option 1",
            value: "Fitur C",
          },
        ],
        optionCounter: 3,
      },
      {
        id: 4,
        question:
          "Apabila disuruh memilih top 1 dari 3 pilihan yang telah Anda pilih pada pertanyaan sebelumnya, fitur mana yang akan Anda pilih?",
        questionType: "MC",
        arrayOptions: [
          {
            id: 1,
            label: "Option 1",
            value: "Fitur A",
          },
          {
            id: 2,
            label: "Option 2",
            value: "Fitur B",
          },
          {
            id: 3,
            label: "Option 1",
            value: "Fitur C",
          },
        ],
        optionCounter: 3,
      },
    ],

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
    axios.get(`http://localhost:8080/api/v1/user-profiles`).then((res) => {
      const userProfiles = res.data;
      this.setState({ userProfiles });
      console.log(this.state);
    });
    axios.get(`http://localhost:8080/api/v1/forms`).then((res) => {
      const forms = res.data;
      this.setState({ forms });
      console.log(this.state);
    });
    axios.get(`http://localhost:8080/api/v1/waitingForms`).then((res) => {
      const waitingForms = res.data;
      this.setState({ waitingForms });
      console.log(this.state);
    });
    // axios.get(`http://localhost:8080/api/v1/formItems`).then((res) => {
    //   const formItems = res.data;
    //   this.setState({ formItems });
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
    if (background) {
      background.addEventListener("click", () => {
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

  createNewForm(obj) {
    console.log("masuk createNewForm");

    axios.post(`http://localhost:8080/api/v1/forms`, obj).then((res) => {
      console.log(this.state);
    });
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
                    page1_data={this.state.forms}
                    waitingForms={this.state.waitingForms}
                    Parent={this}
                    createNewForm={this.createNewForm}
                  />
                }
              />
              <Route
                path="/item1/dashboard"
                element={
                  // <Dashboard formItems_data={this.state.forms.formItems} />
                  <Dashboard formItems_data={this.state.formItems} />
                } // data dari item1
              />
              <Route
                path="/item1/preview"
                element={<Preview formItems_data={this.state.formItems} />} // data dari item1
              />
              <Route
                path="/item1/invitation"
                element={
                  // <Invitation formItems_data={this.state.forms.formItems} />
                  <Invitation formItems_data={this.state.formItems} />
                } // data dari item1
              />
              <Route
                path="/item1/design"
                element={<Design formItems_data={this.state.formItems} />} // data dari item1
              />
              <Route
                path="/item1/show-results"
                element={
                  <DataVisualization formItems_data={this.state.formItems} />
                }
              />
              <Route
                path="/item1/feedback"
                element={
                  <Feedback formMessages_data={this.state.formMessages} />
                }
              />
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
