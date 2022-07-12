import React, { Component } from "react";
import { Link } from "react-router-dom";
import dummyItemImage from "./images/form.png";
import Popup from "reactjs-popup";
import axios from "axios";

const BASE_URL = "http://10.61.54.168:8080";
class PageItems extends React.Component {
  constructor(props) {
    super(props);
    this.refreshFormList = this.refreshFormList.bind(this);
  }

  componentDidMount() {
    this.refreshFormList();
    if(this.props.currentPage == 2 && !this.props.data.submitDate){
      let itemBg = document.getElementById("item-bg-" + this.props.data.formId);
      itemBg.style.backgroundColor = "rgb(252, 207, 207)";
    }
    if(!this.props.data) return;
  }

  refreshFormList() {
    let tempUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (tempUser) this.props.handleFormUpdate();
  }

  async processDeletion() {
    await axios({
      method: "delete",
      url: `${BASE_URL}/api/v1/forms/${this.props.data.formId}`
    }).then(() => {
      this.refreshFormList();
    });
  }

  render() {
    return (
      <div className="item-wrapper" id={"item-bg-" + this.props.data.formId} >
        <Link to={this.props.currentPage == 1 ? `/dashboard/formId/${this.props.data.formId}` : `/response/formId/${this.props.data.formId}`} className="item-container"
          onClick={() => {
            localStorage.setItem("selectedForm", JSON.stringify(this.props.data));
          }}
        >
          <div className="item-img">
            <img id="item-image" src={dummyItemImage} />
          </div>
          <div className="item-meta">
            <div id="item-name">{this.props.data.title}</div>
            <div id="item-desc">
              {this.props.data.description}
            </div>
          </div>
        </Link>
        {this.props.currentPage == 1 ? 
          <Popup
            trigger={(open) => 
            <div className="item-footer">
              <i className="fa fa-ellipsis-v"></i>
            </div>
            }
            position="right center"
          >
            <div className="popup-wrapper">
              <div
                className="popup-content"
                onClick={() => {
                  this.processDeletion();
                }}
              >
                <div className="popup-text">Delete this form</div>
              </div>
            </div>
          </Popup> 
        : false }
      </div>
    );
  }
}

export default PageItems;
