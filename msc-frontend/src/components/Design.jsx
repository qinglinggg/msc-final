import React, { Component, useEffect, useState } from "react";
import iconMenubarGrey from "./images/menubarGrey.png";
import Select from "react-select";
import UploadImage from "./functional-components/UploadImage";
import UploadImageReact from "./functional-components/UploadImageWithProgressBar-React";
import { useParams } from "react-router-dom";
import axios from "axios";

const BASE_URL = "http://10.61.38.193:8080";

function Design(props) {
  const [selectedBackground, setSelectedBackground] = useState("No background");
  const [selectedColor, setSelectedColor] = useState("Default");
  const [formItems, setFormItems] = useState();
  const [openMenu, setOpenMenu] = useState(false);
  const [currentStep, setCurrentStep] = useState([]);
  const { formId } = useParams();

  const backgroundOptions = [
    { value: 0, label: "No background" },
    { value: 1, label: "Upload an image..." },
  ];

  const colorOptions = [
    { value: "Default", label: "Default"},
    { value: "Black", label: "Black" },
    { value: "Dark Grey", label: "Dark Grey" },
    { value: "Red", label: "Red" },
    { value: "Green", label: "Green" },
    { value: "Blue", label: "Blue" },
    { value: "Pink", label: "Pink" },
    { value: "Cyan", label: "Cyan" },
  ];

  useEffect (() => {
    setFormItems(props.formItems_data)
    let body = document.getElementById("body");
    let menuBtn = document.getElementById("menu-icon");
    menuBtn.addEventListener("click", () => {
      body.classList.toggle("openMenu");
    });
    let tempBreadcrumbs = localStorage.getItem("breadcrumbs");
    tempBreadcrumbs = JSON.parse(tempBreadcrumbs);
    if(tempBreadcrumbs.length >= 2) {
      while(tempBreadcrumbs.slice(-1)[0] && !(tempBreadcrumbs.slice(-1)[0].page == "Home" || tempBreadcrumbs.slice(-1)[0].page == "/")){
        tempBreadcrumbs.pop();
      }
    }

    let selectedForm = localStorage.getItem("selectedForm");
    selectedForm = JSON.parse(selectedForm);
    console.log(selectedForm);

    tempBreadcrumbs.push({page: "Design - " + selectedForm['title'], path: window.location.href});
    setCurrentStep(tempBreadcrumbs);
    localStorage.setItem("breadcrumbs", JSON.stringify(tempBreadcrumbs));
  }, []);

  const handleMenu = () => {
    setOpenMenu(!openMenu);
  }

  const handleBackgroundChange = (data) => {
    setSelectedBackground(data.value);
  }

  const handleColorChange = (data) => {

    let selectedForm = JSON.parse(localStorage.getItem("selectedForm"));
    selectedForm.backgroundColor = data.value;
    console.log("selectedForm: ");
    console.log(selectedForm);
    localStorage.setItem("selectedForm", JSON.stringify(selectedForm));

    /* backend : update selectedcolor */
    try {
      axios({
        method: "put",
        data: selectedForm,
        url: `${BASE_URL}/api/v1/forms/${formId}`,
        headers: {"Content-Type": "application/json"}
      }).then((res) => {
        console.log(res.data);
        setSelectedColor(data.value);
      })
    } catch(error) {
      console.log(error);
    }
    
  }

  return (
    <React.Fragment>
      <div className="title-container">
        <div
          className="menu-icon"
          id="menu-icon"
          onClick={() => handleMenu()}
        >
          <img id="menu-icon-img" src={iconMenubarGrey} alt="" />
        </div>
        <div className="page-title">Design</div>
      </div>
      <div className="page-breadcrumbs">
        {
          currentStep.map((b, idx) => {
            if(idx > 0) {
              return (
                <a href={b['path']} key={"bread-" + idx}>
                  <span>{">"}</span>
                  <span>{b['page']}</span>
                </a>
              );
            }
            return (
              <a href={b['path']} key={"bread-" + idx}>{b['page']}</a>
            );
          })
        }
      </div>
      <div id="page-content">
        <div id="design-background-container">
          <div id="design-background-title">Choose background...</div>
          <div id="design-background-input-container">
            <Select
              value={backgroundOptions.value}
              options={backgroundOptions}
              defaultValue={backgroundOptions[0]}
              className="design-selection"
              onChange={(data) => handleBackgroundChange(data)}
            />
            <div id="design-background-input-uploadimage">
              {selectedBackground == 1 ? (
                <UploadImage />
              ) : null}
            </div>
          </div>
        </div>
        <div id="design-color-container">
          <div id="design-color-title">Choose color theme...</div>
          <Select
            value={colorOptions.value}
            options={colorOptions}
            defaultValue={colorOptions[0]}
            className="design-selection"
            onChange={(data) => handleColorChange(data)}
          />
        </div>
      </div>
    </React.Fragment>
  );
}

export default Design;
