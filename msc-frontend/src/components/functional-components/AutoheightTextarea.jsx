import React, { useEffect, useRef, useState } from "react";

const defaultStyle = {
  resize: "none",
  boxSizing: "border-box",
  fontSize: "15px",
  height: "34px"
};
// , 
const AutoHeightTextarea = ({ style = defaultStyle, ...etc}, props) => {

  const textareaRef = React.createRef();

  return (
    <textarea
      ref={textareaRef}
      className="text-input"
      style={style}
      {...etc}
    />
  );
};

export default AutoHeightTextarea;
