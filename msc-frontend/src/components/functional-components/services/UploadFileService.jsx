// import React, { Component } from "react";
// import http from "../http-common"; // axios

// class UploadFileService extends React.Component {
//   upload(file, onUploadProgress) {
//     let formData = new FormData();

//     formData.append("file", file);

//     return http.post("/upload", formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//       onUploadProgress,
//     });
//   }

//   getFiles() {
//     return http.get("/files");
//   }

//   render() {
//     return <div></div>;
//   }
// }

// export default UploadFileService;
