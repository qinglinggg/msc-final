import React, { useEffect, useRef, useState } from "react";

const defaultStyle = {
  resize: "none",
  padding: "9px",
  boxSizing: "border-box",
  fontSize: "15px",
  scrollHeight: "10px",
};

const AutoHeightTextarea = ({ style = defaultStyle, ...etc }) => {
  const textareaRef = useRef(null);
  const [currentValue, setCurrentValue] = useState(""); // you can manage data with it

  useEffect(() => {
    textareaRef.current.style.height = "0px";
    const scrollHeight = textareaRef.current.scrollHeight;
    textareaRef.current.style.height = scrollHeight + "px";
  }, [currentValue]);

  return (
    <textarea
      ref={textareaRef}
      style={style}
      {...etc}
      value={currentValue}
      onChange={(e) => {
        setCurrentValue(e.target.value);
      }}
    />
  );
};

export default AutoHeightTextarea;
