import React, { Component } from "react";
import { Link } from "react-router-dom";
import dummyItemImage from "./images/form.png";
import Popup from "reactjs-popup";
import axios from "axios";

const BASE_URL = "http://10.61.38.193:8080";
class PageItems extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if(this.props.currentPage == 2 && !this.props.data.submitDate){
      let itemBg = document.getElementById("item-bg");
      itemBg.style.backgroundColor = "rgb(252, 207, 207)";
    }
  }
  
  async refreshFormList() {
    let tempUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (tempUser)
    await axios.get(`${BASE_URL}/api/v1/forms/owned-form/${tempUser}`).then((res) => {
      const forms = res.data;
      localStorage.setItem("formLists", JSON.stringify(forms));
      this.props.handleFormDeletion();
    });
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
      <div className="item-wrapper" id="item-bg" >
        <Link to={this.props.currentPage == 1 ? `/dashboard/formId/${this.props.data.formId}` : `/response/formId/${this.props.data.formId}`} className="item-container">
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
                Delete this form
              </div>
            </div>
          </Popup> 
        : false }
      </div>
    );
  }
}

export default PageItems;