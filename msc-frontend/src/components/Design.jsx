import React, { Component, useEffect, useState } from "react";
import iconMenubarGrey from "./images/menubarGrey.png";
import Select from "react-select";
import UploadImage from "./functional-components/UploadImage";
import UploadImageReact from "./functional-components/UploadImageWithProgressBar-React";

function Design(props) {
  const [selectedBackground, setSelectedBackground] = useState("No background");
  const [selectedColor, setSelectedColor] = useState("White");
  const [formItems, setFormItems] = useState();
  const [openMenu, setOpenMenu] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState(props.breadcrumbs);

  const backgroundOptions = [
    { value: 0, label: "No background" },
    { value: 1, label: "Upload an image..." },
  ];

  const colorOptions = [
    { value: "White", label: "White" },
    { value: "Black", label: "Black" },
    { value: "Dark Grey", label: "Dark Grey" },
    { value: "Grey", label: "Grey" },
    { value: "Red", label: "Red" },
    { value: "Green", label: "Green" },
    { value: "Blue", label: "Blue" },
    { value: "Pink", label: "Pink" },
    { value: "Cyan", label: "Cyan" },
  ];

  useEffect (() => {
    breadcrumbs.push(
      {
        // simpen currentformdata
        page: "formId", 
      },
      {
        page: "Design",
        // path: `${BASE_URL}/design/formId/:formId`,
        path: `item1/design`,
      }
    )
    setFormItems(props.formItems_data)
    let body = document.getElementById("body");
    let menuBtn = document.getElementById("menu-icon");
    menuBtn.addEventListener("click", () => {
      body.classList.toggle("openMenu");
    });
  })

  const handleMenu = () => {
    setOpenMenu(!openMenu);
  }

  const handleBackgroundChange = (data) => {
    setSelectedBackground(data.value);
  }

  const handleColorChange = (data) => {
    setSelectedColor(data.value);
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
