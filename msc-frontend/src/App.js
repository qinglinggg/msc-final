import logo from "./logo.svg";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
// import "bootstrap/dist/css/bootstrap.css";
// import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import autosize from "autosize";

class App extends React.Component {
  state = {
    userProfiles: [],
    forms: [],
    formItems: []
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
  }

  render() {
    return (
      // <div className="App">
      //   <Navbar />
      //   <main className="container">
      //     <Home page1_data={this.state.page1_data} />
      //   </main>
      // </div>

      <Router>
        <Navbar user_data={this.state.userProfiles} />
        <Routes>
          <Route path="/" element={<Home page1_data={this.state.forms} />} />
          <Route
            path="/item1/dashboard"
            element={<Dashboard formItems_data={this.state.formItems} />} // data dari item1
          />
        </Routes>
      </Router>
    );
  }
}

export default App;