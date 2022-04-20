import React, { useEffect, useRef, useState } from "react";

const defaultStyle = {
  resize: "none",
  padding: "9px",
  boxSizing: "border-box",
  fontSize: "15px",
  scrollHeight: "10px",
};
// , 
const AutoHeightTextarea = ({ style = defaultStyle, ...etc}) => {

  const textareaRef = React.createRef();
  const [currentValue, setCurrentValue] = useState(""); // you can manage data with it

  useEffect(() => {
    textareaRef.current.style.height = "0px";
    const scrollHeight = textareaRef.current.scrollHeight;
    textareaRef.current.style.height = scrollHeight + 5 + "px";
  }, [currentValue]);

  return (
    <textarea
      ref={textareaRef}
      style={style}
      {...etc}
    />
  );
};

export default AutoHeightTextarea;
