import React, { Component } from "react";
import iconMenubarGrey from "./images/menubarGrey.png";
import Select from "react-select";
import UploadImage from "./functional-components/UploadImage";
import UploadImageReact from "./functional-components/UploadImageWithProgressBar-React";

class Design extends React.Component {
  constructor() {
    super();
    this.handleMenu = this.handleMenu.bind(this);
    this.handleBackgroundChange = this.handleBackgroundChange.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
  }

  state = {
    selectedBackgroundOption: "No background",
    selectedColorOption: "White",
    breadcrumbs: this.props.breadcrumbs,
  };

  backgroundOptions = [
    { value: 0, label: "No background" },
    { value: 1, label: "Upload an image..." },
  ];

  colorOptions = [
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

  componentDidMount() {

    let breadcrumbs = this.state.breadcrumbs;
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
    this.setState({breadcrumbs});

    this.setState({ formItems: this.props.formItems_data });
    let body = document.getElementById("body");
    let menuBtn = document.getElementById("menu-icon");
    menuBtn.addEventListener("click", () => {
      body.classList.toggle("openMenu");
    });
  }

  handleMenu() {
    this.setState({ openMenu: !this.state.openMenu });
  }

  handleBackgroundChange(data) {
    this.setState({ selectedBackgroundOption: data.value });
  }

  handleColorChange(data) {
    this.setState({ selectedColorOption: data.value });
  }

  render() {
    return (
      <React.Fragment>
        <div className="title-container">
          <div
            className="menu-icon"
            id="menu-icon"
            onClick={() => this.handleMenu()}
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
                value={this.backgroundOptions.value}
                options={this.backgroundOptions}
                defaultValue={this.backgroundOptions[0]}
                className="design-selection"
                onChange={(data) => this.handleBackgroundChange(data)}
              />
              <div id="design-background-input-uploadimage">
                {this.state.selectedBackgroundOption == 1 ? (
                  <UploadImage />
                ) : null}
              </div>
            </div>
          </div>
          <div id="design-color-container">
            <div id="design-color-title">Choose color theme...</div>
            <Select
              value={this.colorOptions.value}
              options={this.colorOptions}
              defaultValue={this.colorOptions[0]}
              className="design-selection"
              onChange={(data) => this.handleColorChange(data)}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Design;
