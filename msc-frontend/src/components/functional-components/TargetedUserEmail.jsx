import React, { Component } from "react";

class TargetedUserEmail extends React.Component {
  componentDidMount() {
    let ul = document.querySelector("ul");
    let input = document.querySelector(
      "#invitation-share-privately-email-input"
    );

    let tags = [];

    function remove(element, tag) {
      let index = tags.indexOf(tag);
      tags = [...tags.slice(0, index), ...tags.slice(index + 1)];
      // element.parentElement.remove();
    }

    function createTag() {
      tags
        .slice()
        .reverse()
        .forEach((tag) => {
          let inputTag = `<li id="invitation-share-privately-email">
            ${tag} 
            <i class="uit uit-multiply" id="invitation-share-privately-email-remove"></i>
          </li>`;
          ul.insertAdjacentHTML("afterbegin", inputTag);
          document
            .getElementById("invitation-share-privately-email-remove")
            .addEventListener(
              "click",
              function () {
                remove(this, tag);
                // createTag();
              },
              false
            );
        });
    }

    function addTag(e) {
      if (e.code == "Space" || e.key == ",") {
        // cleaned input tag
        let tag = e.target.value.replace(/\s+/g, "").replace(",", "");
        if (
          tag.length > 1 &&
          tag.endsWith("@bca.co.id") &&
          !tags.includes(tag)
        ) {
          if (tags) {
            document
              .querySelectorAll("#invitation-share-privately-email")
              .forEach((tag) => tag.remove());
          }
          tags.push(tag);
          createTag();
        } else {
          // munculin warning
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
