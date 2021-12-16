import React, { Component } from "react";
import ReactDOM from "react-dom";

class UploadImage extends React.Component {
  state = {
    isImageUploaded: false,
  };

  componentDidMount() {
    let file;
    let originalImageArea;

    const dropArea = document.querySelector(
      "#design-background-uploadimage-area"
    );

    const imageArea = dropArea.querySelector(
      "#design-background-uploadimage-forimage"
    );

    const dragText = dropArea.querySelector(
      "#design-background-uploadimage-text-header"
    );

    const browseBtn = dropArea.querySelector(
      ".design-background-uploadimage-button"
    );

    const input = dropArea.parentElement.querySelector("input");

    const filename = dropArea.querySelector(
      "#design-background-uploadimage-filename"
    );

    // 1. BROWSE FILE
    browseBtn.onclick = () => {
      input.click();
    };

    input.addEventListener("change", function () {
      file = this.files[0];
      dropArea.classList.add("active");
      showFile();
    });

    // 2. DRAG & DROP
    // file is dragged on drag area
    dropArea.addEventListener("dragover", (e) => {
      console.log("File is dragged");
      e.preventDefault();
      //   e.dataTransfer.dropEffect = "copy";
      dropArea.classList.add("active");
      dragText.textContent = "Release to Upload File";
    });

    // file is dragged over drag area
    dropArea.addEventListener("dragleave", () => {
      console.log("File is dragged outside from drag area");
      dropArea.classList.remove("active");
      dragText.textContent = "Drag & Drop to Upload File";
    });

    // file is dropped on drag area
    dropArea.addEventListener("drop", (e) => {
      console.log("File is dropped on drag area");
      e.preventDefault();
      file = e.dataTransfer.files[0];
      showFile();
    });

    // FILE

    function removeFile() {
      dropArea.classList.remove("active");
      filename.classList.remove("active");
      file = "";
      // pleaseRerender = true;
      // console.log(pleaseRerender);
      // imageArea.innerHTML = "";
      // imageArea.innerHTML = originalImageArea;
      // console.log(file);
      // ReactDOM.render(<UploadImage />, dropArea.parentElement);
      // this.setState({ startRender: true });
    }

    function showFile() {
      let fileType = file.type;

      // image file validation
      let validExtensions = ["image/jpeg", "image/png", "image/jpg"];

      if (validExtensions.includes(fileType)) {
        let fileReader = new FileReader();
        fileReader.onload = () => {
          // load & show image
          originalImageArea = imageArea.innerHTML;
          let fileURL = fileReader.result; // passing image file source
          let image = `
          <div id="remove-image-button">
            <i class="fas fa-times"></i>
          </div>
          <img src="${fileURL}" alt="">
          `;
          imageArea.innerHTML = image;

          const removeBtn = imageArea.querySelector("#remove-image-button");
          removeBtn.addEventListener("click", function () {
            removeFile();
          });
        };

        fileReader.readAsDataURL(file);

        // show filename
        filename.classList.add("active");
        filename.textContent = file.name;
      } else {
        alert("Please upload an image file!");
        dropArea.classList.remove("active");
        dragText.textContent = "Drag & Drop to Upload File";
      }
    }
  }

  // displayBrowseBtn() {
  //   return (
  //     <React.Fragment>
  //       <div
  //         className="design-background-uploadimage-button"
  //         id="uploadimage-browse-button"
  //       >
  //         <div className="design-background-uploadimage-text">Browse File</div>
  //       </div>
  //       <input type="file" hidden />
  //     </React.Fragment>
  //   );
  // }

  // handleRemoveBtn() {
  //   this.setState({ isImageUploaded: true });
  // }

  // displayRemoveBtn() {
  //   return (
  //     <React.Fragment>
  //       <div
  //         className="design-background-uploadimage-button"
  //         id="uploadimage-remove-button"
  //         onClick={this.handleRemoveBtn()}
  //       >
  //         <div className="design-background-uploadimage-text">Remove File</div>
  //       </div>
  //       <input type="file" hidden />
  //     </React.Fragment>
  //   );
  // }

  render() {
    return (
      <React.Fragment>
        <div id="design-background-uploadimage-area">
          {/* <div id="remove-image-button">
          <i class="fas fa-times"></i>
          </div> */}
          {/* <div id="design-background-uploadimage-forimage"> */}
          <div id="design-background-uploadimage-image">
            <img src="" alt="" />
          </div>
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
          <div className="design-background-uploadimage-button">
            <div className="design-background-uploadimage-text">
              Browse File
            </div>
          </div>
          <input type="file" hidden />
          {/* </div> */}
          <div id="design-background-uploadimage-filename">File name here</div>
        </div>
        {/* <div id="design-background-uploadimage-button-container">
          {this.state.isImageUploaded
            ? this.displayRemoveBtn()
            : this.displayBrowseBtn()}
        </div> */}
      </React.Fragment>
    );
  }
}

export default UploadImage;
