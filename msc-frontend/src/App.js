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

class App extends React.Component {
  state = {
    userProfiles: [],
    forms: [],
    formItems: ["Test", "Test2"],
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
    let menuClose = document.getElementById("menu-title");
    let sideMenu = document.getElementById("menu-container");
    menuClose.addEventListener("click", () => {
      body.classList.toggle("openMenu");
    });
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
    subMenus.forEach((item) => {
      item.addEventListener("mouseover", activateButton);
      item.addEventListener("click", disableOpenMenu);
    });
    container.style.top = navBar.clientHeight + "px";
    container.style.height = window.innerHeight - navBar.clientHeight + "px";
    background.style.height = navBar.clientHeight + container.clientHeight + "px";
    let newValue = container.clientHeight - 100;
    sideMenu.style.height = newValue + "px";
    sideMenu.style.left = "0";
    sideMenu.style.top = container.style.top + "px";
  }

  render() {
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
                element={<Home page1_data={this.state.forms} />}
              />
              <Route
                path="/item1/dashboard"
                element={<Dashboard formItems_data={this.state.formItems} />} // data dari item1
              />
              <Route
                path="/item1/invitation"
                element={<Invitation formItems_data={this.state.formItems} />} // data dari item1
              />
              <Route
                path="/item1/design"
                element={<Design formItems_data={this.state.formItems} />} // data dari item1
              />
              <Route
              path="/item1/show-results"
              element={<DataVisualization formItems_data={this.state.formItems}/>}/>
            </Routes>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
