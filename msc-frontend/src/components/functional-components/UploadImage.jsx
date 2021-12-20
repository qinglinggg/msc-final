import React, { Component } from "react";
import ReactDOM from "react-dom";
import imgWoman from "../images/woman.jpg";
import axios from "axios";

class UploadImage extends React.Component {
  constructor() {
    super();
    this.handleUploadFile = this.handleUploadFile.bind(this);
  }

  state = {
    isImageUploaded: false,
    selectedImage: null,
  };

  handleUploadFile(file) {
    console.log("Enter handle file");
    console.log(file);

    // image validation

    let validExtensions = ["image/jpeg", "image/png", "image/jpg"];
    if (validExtensions.includes(file.type)) {
      console.log(file);
      let formData = new FormData();
      formData.append("image", file);

      axios({
        url: "http://localhost:8080/api/v1/forms/background",
        method: "POST",
        data: { formData },
      }).then(
        (res) => {
          // console.log("successfully uploaded");
        },
        (err) => {
          // error
        }
      );

      this.setState({ isImageUploaded: true });

      let fileReader = new FileReader();
      let fileURL;
      fileReader.onload = () => {
        fileURL = fileReader.result;

        let imageContainer = document.querySelector(
          "#design-background-uploadimage-image"
        );
        let image = `<img src=${fileURL} alt="" />`;
        imageContainer.insertAdjacentHTML("afterbegin", image);
      };

      fileReader.readAsDataURL(file);
      // console.log(this.state.selectedImage);

      // animation
      const dropArea = document.querySelector(
          "#design-background-uploadimage-area"
        ),
        filename = dropArea.querySelector(
          "#design-background-uploadimage-filename"
        );

      filename.classList.add("active");
      filename.textContent = file.name;
    }
  }

  handleRemoveFile() {
    const dropArea = document.querySelector(
        "#design-background-uploadimage-area"
      ),
      filename = dropArea.querySelector(
        "#design-background-uploadimage-filename"
      );

    dropArea.classList.remove("active");
    filename.classList.remove("active");

    axios.get("http://localhost:8080/api/v1/forms/background").then((res) => {
      axios.delete("http://localhost:8080/api/v1/forms/background");
    });

    this.setState({ isImageUploaded: false });
  }

  handleAreaDragOver(e) {
    const dropArea = document.querySelector(
        "#design-background-uploadimage-area"
      ),
      dragText = dropArea.querySelector(
        "#design-background-uploadimage-text-header"
      );

    // file is dragged on drag area
    console.log("File is dragged");
    e.preventDefault();
    dropArea.classList.add("active");
    dragText.textContent = "Release to Upload File";
  }

  handleAreaDragLeave() {
    const dropArea = document.querySelector(
        "#design-background-uploadimage-area"
      ),
      dragText = dropArea.querySelector(
        "#design-background-uploadimage-text-header"
      );

    // file is dragged over drag area
    console.log("File is dragged outside from drag area");
    dropArea.classList.remove("active");
    dragText.textContent = "Drag & Drop to Upload File";
  }

  handleAreaDrop(e) {
    // file is dropped on drag area
    console.log("File is dropped on drag area");
    e.preventDefault();
    let file = e.dataTransfer.files[0];
    this.handleUploadFile(file);
  }

  render() {
    return (
      <React.Fragment>
        <div
          id="design-background-uploadimage-area"
          // animation
          onDragOver={(e) => {
            this.handleAreaDragOver(e);
          }}
          onDragLeave={() => {
            this.handleAreaDragLeave();
          }}
          // file upload
          onDrop={(e) => {
            this.handleAreaDrop(e);
          }}
        >
          {/* <div id="design-background-uploadimage-forimage"> */}
          {this.state.isImageUploaded ? (
            <React.Fragment>
              <div
                id="remove-image-button"
                onClick={() => this.handleRemoveFile()}
              >
                <i className="fas fa-times"></i>
              </div>
              <div id="design-background-uploadimage-image"></div>
            </React.Fragment>
          ) : null}
          <div
            className="design-background-uploadimage-text"
            id="design-background-uploadimage-text-header"
          >
            Drag & Drop to Upload File
          </div>
          <div
            className="design-background-uploadimage-text"
            id="design-background-uploadimage-text-divider"
          >
            OR
          </div>
          <div
            className="design-background-uploadimage-button"
            onClick={() => {
              let area = document.querySelector(
                "#design-background-uploadimage-area"
              );
              let input = area.querySelector("input");
              input.click();
            }}
          >
            <div className="design-background-uploadimage-text">
              Browse File
            </div>
          </div>
          <input
            type="file"
            onChange={(e) => {
              let file = e.target.files[0];
              this.setState({ selectedImage: file });
              this.handleUploadFile(file);

              // animation
              let dropArea = document.querySelector(
                "#design-background-uploadimage-area"
              );
              dropArea.classList.add("active");
            }}
            hidden
          />
          {/* </div> */}
          <div id="design-background-uploadimage-filename">File name here</div>
        </div>
      </React.Fragment>
    );
  }
}

export default UploadImage;
