import React, { Component } from "react";

class TargetedUserEmail extends React.Component {
  state = {
    tags: [],
    tagsElement: [],
  };

  handleAddTag(e) {
    console.log("Entering handle add tag");

    if (e.code == "Space" || e.key == ",") {
      // cleaned input tag

      // tag -> inputan baru dari user
      // tags -> inputan user yang sudah disimpan, terdiri dari banyak tag

      let tag = e.target.value.replace(/\s+/g, "").replace(",", "");
      let tags = this.state.tags;

      if (tag.length > 1 && tag.endsWith("@bca.co.id") && !tags.includes(tag)) {
        tags.push(tag);
        this.setState({ tags });

        this.handleRenderTag();
      } else {
        // munculin warning
      }
      e.target.value = "";
    }
  }

  handleRenderTag() {
    console.log("Entering HANDLE RENDER TAG BOX");

    let tags = this.state.tags;
    let newTagElement = [];

    console.log("Tag(s) : " + tags);

    // setiap ada perubahan, state tagsElement selalu dikosongkan lalu dipush ulang mengikuti updatean dari state tags

    this.setState({ tagsElement: [] }, () => {
      tags.forEach((tag, index) => {
        console.log("ITERATION " + index);
        console.log("Tag : " + tag);

        newTagElement.push(
          <li id="invitation-share-privately-email" key={index}>
            {tag}
            <i
              className="uit uit-multiply"
              id="invitation-share-privately-email-remove"
              onClick={() => {
                this.handleRemoveTag(tag);
              }}
            ></i>
          </li>
        );
      });

      this.setState({
        tagsElement: newTagElement,
      });
    });
  }

  handleRemoveTag(tag) {
    console.log("Tag wanted to be removed: " + tag);
    console.log("Tag(s) before removed: " + this.state.tags);

    this.setState(
      {
        tags: this.state.tags.filter((element) => {
          return element != tag;
        }),
      },
      () => {
        console.log("Current tags, after removed: " + this.state.tags);
        this.handleRenderTag();
      }
    );
  }

  render() {
    return (
      <div id="invitation-share-privately-emailbox">
        <ul id="invitation-share-privately-emails">
          {this.state.tagsElement}
          <input
            type="text"
            className="inputText"
            id="invitation-share-privately-email-input"
            onKeyUp={(event) => {
              this.handleAddTag(event);
            }}
          ></input>
        </ul>
      </div>
    );
  }
}

export default TargetedUserEmail;
