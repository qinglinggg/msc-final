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

  componentDidMount() {
    let currentForm = localStorage.getItem("selectedForm");
    if(currentForm) currentForm = JSON.parse(currentForm);
    else return;
    if(currentForm.backgroundLink || currentForm.backgroundLink != "") {
      this.setState({isImageUploaded : true});
      this.setState({selectedImage: currentForm.backgroundLink})
    }
  }

  async fetchImage() {
    let dropArea = document.querySelector("#design-background-uploadimage-area");
    if(!dropArea) return;
    const res = await fetch(this.state.selectedImage);
    const imageBlob = await res.blob();
    const imageUrl = URL.createObjectURL(imageBlob);
    dropArea.style.backgroundImage = `url(${imageUrl})`;
    dropArea.style.animation = "fade-in 1s forwards";
  }

  componentDidUpdate(prevProps, prevState) {
    let currentForm = localStorage.getItem("selectedForm");
    if(currentForm) currentForm = JSON.parse(currentForm);
    else return;
    if(prevState.selectedImage != this.state.selectedImage && this.state.selectedImage != null) {
      this.fetchImage();
      currentForm.backgroundLink = this.state.selectedImage;
      axios({
        method: "put",
        url: "http://10.61.38.193:8080/api/v1/forms/" + currentForm.formId,
        data: currentForm
      }).then(() => {
        this.setState({ isImageUploaded: true });
        let lists = localStorage.getItem("formLists");
        
        if(lists) {
          lists = JSON.parse(lists);
          lists.map((item, idx) => {
            if(item.formId == currentForm.formId) lists[idx] = currentForm;
          });
          localStorage.setItem("formLists", JSON.stringify(lists));
        }
        localStorage.setItem("selectedForm", JSON.stringify(currentForm));
      });
    }
    if(prevState.isImageUploaded != this.state.isImageUploaded && this.state.isImageUploaded == true) {
      setTimeout(this.setState({ isImageUploaded: false}));
    }
  }

  handleUploadFile(file) {
    // image validation
    if(!file) return;
    let validExtensions = ["image/jpeg", "image/png", "image/jpg"];
    if (validExtensions.includes(file.type)) {
      console.log("file", file);
      let formData = new FormData();
      formData.append("file", file);
      console.log("formData", formData);
      axios({
        url: "http://10.61.38.193:8080/api/v1/upload",
        method: "POST",
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((res) => {
          this.setState({selectedImage : "http://10.61.38.193:8080/api/v1/files/" + res.data.id});
        });
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

    dropArea.classList.remove("active");
    dragText.textContent = "Drag & Drop to Upload File";
  }

  handleAreaDrop(e) {
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
