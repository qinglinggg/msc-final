import React, { Component } from "react";
import react, { createRef, Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

// const BASE_URL = "http://localhost:8080";

function Menu(props) {
  
  // const {formId} = useParams();

  // useEffect(() => {
  //   let body = document.getElementById("body");
  //   body.classList.toggle("openMenu");
  // })

  return (
    <div className="menu-container" id="menu-container">
      <div className="menu-close-container">
        <ion-icon name="close-outline" id="menu-close"></ion-icon>
      </div>
      <Link className="sub-menu" to={`/dashboard/formId/${props.currentSelectedForm}`}>
        Dashboard
      </Link>
      <Link className="sub-menu" to={`/design/formId/${props.currentSelectedForm}`}>
        Design
      </Link>
      <Link className="sub-menu" to={`/invitation/formId/${props.currentSelectedForm}`}>
        Invitation
      </Link>
      <Link className="sub-menu" to={`/show-results/formId/${props.currentSelectedForm}`}>
        Data Visualization
      </Link>
      <Link className="sub-menu" to={`/feedback/formId/${props.currentSelectedForm}`}>
        Feedback
      </Link>
      <Link className="sub-menu" to={`/`}>
        Back to Home
      </Link>
      {/* <Link to={`/admin`} className="sub-menu">
        Admin
      </Link> */}
    </div>
  );
}

export default Menu;
