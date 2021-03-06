import React, { useEffect, useRef, useState } from "react";

const defaultStyle = {
  resize: "none",
  boxSizing: "border-box",
  fontSize: "15px",
  height: "25px"
};
// , 
const AutoHeightTextarea = ({ style = defaultStyle, ...etc}, props) => {

  const textareaRef = React.createRef();

  const autoResize = (el) => {
    el.target.style.height = "25px";
    el.target.style.height = (el.target.scrollHeight)+"px";
    console.log("Scroll height: " + el.target.scrollHeight);
  }

  return (
    <textarea
      ref={textareaRef}
      style={style}
      onInput={(e) => autoResize(e)}
      {...etc}
    />
  );
};

export default AutoHeightTextarea;
