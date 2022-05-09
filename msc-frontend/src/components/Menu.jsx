import React, { Component } from "react";
import react, { createRef, Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function Menu(props) {
  const [selectedForm, setSelectedForm] = useState([]);

  const handleCurrentSelection = (item) => {
    let listSelection = document.querySelectorAll(".page-button");
    listSelection.forEach((i) => {
      i.classList.remove('clicked');
    });
    item.classList.add('clicked');
  }

  useEffect(() => {
    let currentForm = localStorage.getItem("selectedForm");
    currentForm = JSON.parse(currentForm);
    if(currentForm){
      setSelectedForm(currentForm['formId']);
    } else {
      setSelectedForm("");
    }
    let listSelection = document.querySelectorAll(".page-button");
    listSelection.forEach((item) => {
      item.addEventListener('click', (e) => {
        handleCurrentSelection(e.target);
      })
    });
    let body = document.getElementById("body");
    let subMenus = document.querySelectorAll(".sub-menu");
    function activateButton() {
      subMenus.forEach((item) => {
        item.classList.remove("active");
      });
      this.classList.add("active");
    }
    function disableOpenMenu() {
      console.log("Toggle menu check");
      body.classList.toggle("openMenu");
    }
    if (subMenus) {
      subMenus.forEach((item) => {
        item.addEventListener("mouseover", activateButton);
        item.addEventListener("click", disableOpenMenu);
      });
    }
  }, [])

  return (
    <div className="menu-container" id="menu-container">
      <div className="menu-close-container">
        <ion-icon name="close-outline" id="menu-close"></ion-icon>
      </div>
      <Link className="sub-menu" to={`/dashboard/formId/${selectedForm}`}>
        <span className="menu-item">Dashboard</span>
        <span className="indicator"></span>
      </Link>
      <Link className="sub-menu" to={`/design/formId/${selectedForm}`}>
        <span className="menu-item">Design</span>
        <span className="indicator"></span>
      </Link>
      <Link className="sub-menu" to={`/invitation/formId/${selectedForm}`}>
        <span className="menu-item">Invitation</span>
        <span className="indicator"></span>
      </Link>
      <Link className="sub-menu" to={`/show-results/formId/${selectedForm}`}>
        <span className="menu-item">Data Visualization</span>
        <span className="indicator"></span>
      </Link>
      <Link className="sub-menu" to={`/feedback/formId/${selectedForm}`}>
        <span className="menu-item">Feedback</span>
        <span className="indicator"></span>
      </Link>
      <Link className="sub-menu" to={`/`}>
        <span className="menu-item">Back to Home</span>
        <span className="indicator"></span>
      </Link>
      {/* <Link to={`/admin`} className="sub-menu">
        Admin
      </Link> */}
    </div>
  );
}

export default Menu;
