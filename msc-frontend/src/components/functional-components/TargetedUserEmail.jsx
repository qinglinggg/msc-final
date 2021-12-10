import React, { Component } from "react";
import AutoHeightTextarea from "./AutoheightTextarea";
import menubarClose from "../images/menubarClose.png";

class TargetedUserEmail extends React.Component {
  componentDidMount() {
    let ul = document.querySelector("ul");
    let input = document.querySelector(
      "#invitation-share-privately-email-input"
    );

    console.log(input);

    let tags = [];

    function createTag() {
      tags
        .slice()
        .reverse()
        .forEach((tag) => {
          let inputTag = `<li id="invitation-share-privately-email">
            ${tag} 
            <i class="uit uit-multiply" id="invitation-share-privately-email-remove" onClick="remove(this, '${tag}')"></i>
          </li>`;
          ul.insertAdjacentHTML("afterbegin", inputTag);
        });
      //   console.log(tags);
    }

    function remove(element, tag) {
      let index = tags.indexOf(tag);
      tags = [...tags.slice(0, index), ...tags.slice(index + 1)];
    }

    function addTag(e) {
      if (e.code == "Space") {
        let tag = e.target.value.replace(/\s+/g, " ");
        if (tag.length > 1 && !tags.includes(tag)) {
          if (tags) {
            document
              .querySelectorAll("#invitation-share-privately-email")
              .forEach((tag) => tag.remove());
          }
          tag.split(",").forEach((tag) => {
            tags.push(tag);
            createTag();
            // console.log(document.querySelector("i"));
          });
        }
        e.target.value = "";
      }
    }

    input.addEventListener("keyup", addTag);
  }

  render() {
    return (
      <div id="invitation-share-privately-emailbox">
        <ul id="invitation-share-privately-emails">
          {/* <h3 id="invitation-share-privately-email">
            Test
            <i className="uit uit-multiply"></i>
          </h3>
          <h3 id="invitation-share-privately-email">
            Test
            <i className="uit uit-multiply"></i>
          </h3> */}
          <input
            type="text"
            className="inputText"
            id="invitation-share-privately-email-input"
          ></input>
        </ul>
      </div>
    );
  }
}

export default TargetedUserEmail;
