import logo from "./logo.svg";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

class App extends React.Component {
  state = {
    page1_data: [
      {
        id: 1,
        title: "Sample Data",
        desc: "Sample Desc",
        imagePreview: "",
        lastEdited: "",
      },
      {
        id: 2,
        title: "Sample Data",
        desc: "Sample Desc",
        imagePreview: "",
        lastEdited: "",
      },
      {
        id: 3,
        title: "Sample Data",
        desc: "Sample Desc",
        imagePreview: "",
        lastEdited: "",
      },
      {
        id: 4,
        title: "Sample Data",
        desc: "Sample Desc",
        imagePreview: "",
        lastEdited: "",
      },
    ],
  };

  render() {
    return (
      // <div className="App">
      //   <Navbar />
      //   <main className="container">
      //     <Home page1_data={this.state.page1_data} />
      //   </main>
      // </div>

      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={<Home page1_data={this.state.page1_data} />}
          />
          <Route
            path="/item1/dashboard"
            element={<Dashboard />} // data dari item1
          />
        </Routes>
      </Router>
    );
  }
}

export default App;
