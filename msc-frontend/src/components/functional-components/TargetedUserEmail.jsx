import React, { Component } from "react";

class TargetedUserEmail extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps) {
    if(prevProps.tags != this.props.tags){
      this.handleRenderTag();
    }
  }

  handleAddTag(e) {
    console.log("Entering handle add tag");

    // console.log(e.key);
    if (e.key == " " || e.key == ",") {
      // cleaned input tag

      // tag -> inputan baru dari user
      // tags -> inputan user yang sudah disimpan, terdiri dari banyak tag

      let tag = e.target.value.replace(/\s+/g, "").replace(",", "");
      let tags = this.props.tags;

      if (tag.length > 1 && tag.endsWith("@bca.co.id") && !tags.includes(tag)) {
        tags.push(tag);
        this.props.setTags(tags);

        this.handleRenderTag();
      } else {
        // munculin warning
      }
      e.target.value = "";
    }
  }

  handleRenderTag() {
    let tags = this.props.tags;
    let newTagElement = [];
    console.log("Tag(s) : " + tags);
    // setiap ada perubahan, state tagsElement selalu dikosongkan lalu dipush ulang mengikuti updatean dari state tags
    this.props.setTagsElement([]);

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

    this.props.setTagsElement(newTagElement);

  }

  handleRemoveTag(tag) {
    console.log("Tag wanted to be removed: " + tag);
    console.log("Tag(s) before removed: " + this.props.tags);

    let filteredTag = this.props.tags.filter((element) => {
      return element != tag;
    })

    this.props.setTags(filteredTag);
  }

  render() {
    return (
      <div id="invitation-share-privately-emailbox">
        <ul id="invitation-share-privately-emails">
          {this.props.tagsElement}
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
