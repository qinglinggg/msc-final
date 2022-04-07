import React, { Component } from "react";
import react, { createRef, Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

// const BASE_URL = "http://localhost:8080";

function Menu() {
  
  const {formId} = useParams();

  // useEffect(() => {
  //   let body = document.getElementById("body");
  //   body.classList.toggle("openMenu");
  // })

  return (
    <div className="menu-container" id="menu-container">
      <div className="menu-close-container">
        <ion-icon name="close-outline" id="menu-close"></ion-icon>
      </div>
      <Link to={`/dashboard/formId/${formId}`} className="sub-menu">
        Dashboard
      </Link>
      <Link to="/item1/design" className="sub-menu">
        Design
      </Link>
      <Link to="/item1/invitation" className="sub-menu">
        Invitation
      </Link>
      <Link to="/item1/show-results" className="sub-menu">
        Data Visualization
      </Link>
      <Link to={`/feedback/formId/${formId}`} className="sub-menu">
        Feedback
      </Link>
      <Link to="/" className="sub-menu">
        Back to Home
      </Link>
      {/* <Link to={`/admin`} className="sub-menu">
        Admin
      </Link> */}
    </div>
  );
}

export default Menu;
