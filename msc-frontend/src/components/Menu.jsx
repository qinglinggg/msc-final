import React, { Component } from "react";
import react, { createRef, Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function Menu(props) {
  const [selectedForm, setSelectedForm] = useState([]);

  useEffect(() => {
    let currentForm = localStorage.getItem("selectedForm");
    currentForm = JSON.parse(currentForm);
    if(currentForm){
      setSelectedForm(currentForm['formId']);
    } else {
      setSelectedForm("");
    }
  }, [])

  return (
    <div className="menu-container" id="menu-container">
      <div className="menu-close-container">
        <ion-icon name="close-outline" id="menu-close"></ion-icon>
      </div>
      <Link className="sub-menu" to={`/dashboard/formId/${selectedForm}`}>
        Dashboard
      </Link>
      <Link className="sub-menu" to={`/design/formId/${selectedForm}`}>
        Design
      </Link>
      <Link className="sub-menu" to={`/invitation/formId/${selectedForm}`}>
        Invitation
      </Link>
      <Link className="sub-menu" to={`/show-results/formId/${selectedForm}`}>
        Data Visualization
      </Link>
      <Link className="sub-menu" to={`/feedback/formId/${selectedForm}`}>
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
