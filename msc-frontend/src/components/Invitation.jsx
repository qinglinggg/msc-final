import React, { Component, useEffect, useState } from "react";
import Menu from "./Menu";
import iconMenubarGrey from "./images/menubarGrey.png";
import iconLINE from "./images/iconLINE.png";
import iconTelegram from "./images/iconTelegram.png";
import iconWhatsApp from "./images/iconWhatsApp.png";
import iconLink from "./images/iconLink.png";
import AutoHeightTextarea from "./functional-components/AutoheightTextarea";
import TargetedUserEmail from "./functional-components/TargetedUserEmail";
import { useParams } from "react-router-dom";
import Popup from "reactjs-popup";
import axios, { Axios } from "axios";

function Invitation(props) {
  const [openMenu, setOpenMenu] = useState(false);
  const [pageSelection, setPageSelection] = useState(1);

  const [userInvited, setUserInvited] = useState([]); // data
  const [teamMember, setTeamMember] = useState([]);
  const [index, setIndex] = useState(0); // length of userinvited, saved progress

  const [openTargetedUserEmail, setOpenTargetedUserEmail] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagsElement, setTagsElement] = useState([]);

  const [currentStep, setCurrentStep] = useState([]);

  const handleCurrentSelection = (item) => {
    let listSelection = document.querySelectorAll(".page-button");
    listSelection.forEach((i) => {
      i.classList.remove('clicked');
    });
    item.classList.add('clicked');
  }

  const BASE_URL = "http://10.61.38.193:8080";
  const { formId } = useParams();

  const [formUrl] = useState(`http://10.61.38.193:3000/response/formId/${formId}`);

  useEffect(() => {
    props.isAuthor(formId);
    let body = document.getElementById("body");
    let menuBtn = document.getElementById("menu-icon");
    menuBtn.addEventListener("click", () => {
      body.classList.toggle("openMenu");
    });
    let tempBreadcrumbs = localStorage.getItem("breadcrumbs");
    tempBreadcrumbs = JSON.parse(tempBreadcrumbs);
    if(tempBreadcrumbs.length >= 2) {
      while(tempBreadcrumbs.slice(-1)[0] && !(tempBreadcrumbs.slice(-1)[0].page == "Home" || tempBreadcrumbs.slice(-1)[0].page == "/")){
        tempBreadcrumbs.pop();
      }
    }
    let selectedForm = JSON.parse(localStorage.getItem("selectedForm"));
    tempBreadcrumbs.push(
      {
        page: "Invitation - " + selectedForm['title'],
        path: window.location.href,
      }
    );
    setCurrentStep(tempBreadcrumbs);
    localStorage.setItem("breadcrumbs", JSON.stringify(tempBreadcrumbs));
    let listSelection = document.querySelectorAll(".page-button");
    listSelection.forEach((item) => {
      item.addEventListener('click', (e) => {
        handleCurrentSelection(e.target);
      })
    });
    getTargetedUserList();
    getTeamMember();
  }, []);

  useEffect(() => {
    // insert or delete
    if(userInvited){
      if(userInvited.length > 0) {
        let index = 0;
        let userInvitedList = userInvited;
        userInvitedList.map((u) => {
          index++;
          u['number'] = index;
          if(u['name'] && u['email']) return;
          try {
            axios({
              method: "get",
              url: `${BASE_URL}/api/v1/user-profiles/${u.userId}`
            }).then((res) => {
              if(res.data){
                u['name'] = res.data.fullname;
                u['email'] = res.data.email;
              }
            })
          } catch(error) {
            console.log(error);
          }
        })
        setUserInvited(userInvitedList);
      }
    }
  }, [userInvited]);

  useEffect(() => {
    setTags([]);
    setTagsElement([]);
  }, [pageSelection, teamMember])

  const getTargetedUserList = () => {
    let userInvitedList = [];
    try {
      axios({
        method: "get",
        url: `${BASE_URL}/api/v1/forms/get-targeted-user-list/${formId}`,
      }).then((res) => {
        console.log(res);
        if(res.data){
          userInvitedList = res.data;
          // console.log("---- userInvitedList, inside res.data:");
          // console.log(userInvitedList);
          userInvitedList.map((u) => {
            if(!u.submitDate){
              u['status'] = "Invited";
              u['datetime'] = "-";
            } else {
              u['status'] = "Completed"
              const submitDate = new Date(u.submitDate);
              let date = submitDate.getDate() + "/" + (submitDate.getMonth() + 1) + "/" + submitDate.getFullYear();
              let time = submitDate.getHours() + ':';
              if(submitDate.getMinutes() == 0) time = time + submitDate.getMinutes() + '0';
              else if(submitDate.getMinutes() < 10) time = time + '0' + submitDate.getMinutes();
              else time = time + submitDate.getMinutes();
              u['datetime'] = "Submitted at " + date + " " + time;
            }
          })
          setUserInvited(userInvitedList);
        }
      }) 
    } catch(error) {
      console.log(error);
    }
  }

  const getTeamMember = () => {
    let teamMember = [];
    axios({
      method: "get",
      url: `${BASE_URL}/api/v1/forms/get-form-authors/${formId}`
    }).then((res) => {
      console.log("get team member");
      console.log(res.data);
      if(res.data) setTeamMember(res.data);
    }).catch((error) => console.log(error));
  }

  const handleMenu = () => {
    setOpenMenu(!openMenu);
  }

  const handleOpenSharePage = () => {
    setPageSelection(1);
  }

  const displaySharePage = () => {
    return (
      <React.Fragment>
        <div id="invitation-share-container">
          <div id="invitation-share-publicly-box">
            <div id="invitation-share-publicly-innerbox">
              <div id="invitation-share-publicly-innerbox-text">
                Start sharing your questionnaire publicly!
              </div>
              <div id="invitation-share-publicly-innerbox-linkcontainer">
                <ion-icon id="invitation-share-publicly-innerbox-iconurl" name="link-outline" /> 
                <div id="invitation-share-publicly-innerbox-linkbox">
                  <input type="url" id="invitation-share-publicly-innerbox-url" value={formUrl} disabled />
                </div>
                <Popup
                  trigger={(open) => 
                      <ion-icon id="invitation-share-publicly-innerbox-iconcopy" name="copy-outline" /> 
                  }
                  position="right center"
                  onClick={() => {
                    navigator.clipboard.writeText(`${formUrl}`);
                  }}
                >
                  <div className="popup-wrapper">
                    Copied to clipboard.
                  </div>
                </Popup>
              </div>
              <div id="invitation-share-publicly-innerbox-iconcontainer">
                <img
                  className="invitation-share-publicly-innerbox-icon"
                  src={iconLINE}
                  alt=""
                />
                <img
                  className="invitation-share-publicly-innerbox-icon"
                  src={iconTelegram}
                  alt=""
                />
                <img
                  className="invitation-share-publicly-innerbox-icon"
                  src={iconWhatsApp}
                  alt=""
                />
              </div>
            </div>
          </div>
          <div id="invitation-share-divider">
            <div id="invitation-share-divider-line"></div>
            <h4 id="invitation-share-divider-text">OR</h4>
            <div id="invitation-share-divider-line"></div>
          </div>
          <div id="invitation-share-privately-box">
            <div className="invitation-share-privately-innerbox"
              id="invitation-share-privately-innerbox-title">
              Share it privately.
            </div>
            <div
              id="invitation-share-privately-render"
              onClick={() => handleTargetedUserEmail()}
            >
              {openTargetedUserEmail ? (
                displayTargetedUserEmailBox()
              ) : (
                <div id="invitation-share-privately-button">
                  Type your targeted user email
                </div>
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  const handleTargetedUserEmail = () => {
    setOpenTargetedUserEmail(true);
  }

  const handleSubmitTargetedUserEmail = () => {
    tags.map((userEmail) => {
      try {
        axios({
          method: "post",
          url: `${BASE_URL}/api/v1/forms/insert-targeted-user/${formId}`,
          data: userEmail,
          headers: { "Content-Type": "text/plain" },
        }).then((res) => {
          setTags([]);
          setTagsElement([]);
          console.log("Successfully inserted");
        }).finally(() => {
          getTargetedUserList();
        })
      } catch(error) {
          console.log(error);
      }
    })
  }

  const handleDeleteTargetedUserEmail = (obj) => {
    console.log("delete on process");
    let deletedUser = {
      formRespondentId: obj.formRespondentId,
      formId: obj.formId,
      userId: obj.userId,
      submitDate: obj.submitDate,
      isTargeted: obj.isTargeted,
    }
    console.log(deletedUser);
    try {
      axios({
        method: "delete",
        url: `${BASE_URL}/api/v1/forms/delete-targeted-user/${obj.formRespondentId}`,
        data: deletedUser,
        headers: { "Content-Type": "application/json" },
      }).then((res) => {
      console.log(userInvited);
        let tempInvitedList = userInvited.filter((u) => {
          return u.email != obj.email;
        })
        let index = 0;
        tempInvitedList.map((u) => {
          index++;
          u['number'] = index;
        })
        setUserInvited(tempInvitedList);
        console.log(tempInvitedList);
      })
    } catch(error) {
      console.log(error);
    }
  }

  const displayTargetedUserEmailBox = () => {
    return (
      <React.Fragment>
        <div className="invitation-share-privately-innerbox">
          <div id="invitation-share-privately-innerbox-desc">
            Enter your targeted user email.
          </div>
          <div id="invitation-share-privately-innerbox-desc2">
            Notes: you may seperated each email with comma (,) or simply by pressing spacebar.
          </div>
        </div>
        <TargetedUserEmail 
          tags={tags}
          tagsElement={tagsElement}
          setTags={setTags}
          setTagsElement={setTagsElement}
        />
        <div id="invitation-share-privately-invite-button" 
          onClick={handleSubmitTargetedUserEmail}
        >
          Invite them</div>
      </React.Fragment>
    );
  }

  const handleOpenTrackPage = () => {
    setPageSelection(2);
  }

  const displayTrackPage = () => {
    return (
      <React.Fragment>
        <div id="invitation-track-container">
          {userInvited.length > 0 ? userInvited.map((value) => {
            return (
              <React.Fragment>
                <div id="invitation-track-box">
                  <div
                    className="invitation-track-innerbox"
                    id="invitation-track-innerbox-number"
                  >
                    {value.number}.
                  </div>
                  <div
                    className="invitation-track-innerbox"
                    id="invitation-track-innerbox-name"
                  >
                    {value.name}
                  </div>
                  <div
                    className="invitation-track-innerbox"
                    id="invitation-track-innerbox-email"
                  >
                    {value.email}
                  </div>
                  <div
                    className="invitation-track-innerbox"
                    id="invitation-track-innerbox-status"
                  >
                    {value.status}
                  </div>
                  <div
                    className="invitation-track-innerbox"
                    id="invitation-track-innerbox-datetime"
                  >
                    {value.datetime}
                  </div>
                  <ion-icon name="trash-outline" id="invitation-trash-icon"
                    onClick={(e) => handleDeleteTargetedUserEmail(value)}
                  />
                </div>
              </React.Fragment>
            );
          }) : <div id="invitation-user-is-null">You're currently not invited anyone yet.</div>
          }
        </div>
      </React.Fragment>
    );
  }

  const handleOpenCollaborators = () => {
    setPageSelection(3);
  }

  const handleSubmitCollaborators = () => {
    let formId = JSON.parse(localStorage.getItem("selectedForm")).formId;
    console.log(tags);
    tags.map((userEmail) => {
      axios({
        method: "post",
        data: userEmail,
        url: `${BASE_URL}/api/v1/forms/insert-author/${formId}`,
        headers: { "Content-Type": "text/plain" },
      }).then((res) => {
        console.log(res);
        if(res.data){
          // add to collab list
          getTeamMember();
        }
      }).catch((error) => console.log(error));
    })
  }

  const handleDeleteTeamMember = (memberId) => {
    let formId = JSON.parse(localStorage.getItem("selectedForm")).formId;
    axios({
      method: "delete",
      data: memberId,
      url: `${BASE_URL}/api/v1/forms/delete-author/${formId}`,
      headers: { "Content-Type": "text/plain" },
    }).then((res) => {
      let tempTeamMember = teamMember;
      tempTeamMember = tempTeamMember.filter((member) => {
        return member.userId != memberId;
      })
      setTeamMember(tempTeamMember);
    }).catch((error) => console.log(error))
  }

  const displayCollaboratorsPage = () => {
    return (
      <React.Fragment>
        <div id="invitation-collab-container">
          <div id="invitation-collab-invite-box">
            <div id="invitation-collab-title">
              Collaborators
            </div>
            <div id="invitation-collab-desc">
              Collaborators have full access to edit this document. Input email addresses to invite people.
            </div>
          </div>
          <div id="invitation-collab-email">
            <TargetedUserEmail
              tags={tags}
              tagsElement={tagsElement}
              setTags={setTags}
              setTagsElement={setTagsElement}
            />
          </div>
          <div id="invitation-collab-invite-button"
            onClick={() => handleSubmitCollaborators()}
            style={tags.length > 0 ? {backgroundColor : "rgb(61, 224, 178)", cursor : "pointer"} : {backgroundColor : "rgb(155, 233, 209)", cursor : "default"}}>
            Invite
          </div>
          <div id="invitation-collab-divider"/>
          <div id="invitation-collab-invite-box">
            <div id="invitation-collab-title">
              Team Member
            </div>
            <div id="invitation-collab-list-wrapper">
              {teamMember ? teamMember.map((member, idx) => {
                let currentUser = JSON.parse(localStorage.getItem("loggedInUser"));
                return (
                  <div id="invitation-collab-box">
                    <div className="invitation-collab-innerbox" id="invitation-collab-innerbox-no">
                      {idx + 1}.
                    </div>
                    <div className="invitation-collab-innerbox" id="invitation-collab-innerbox-name">
                      {member.fullname}
                    </div>
                    <div className="invitation-collab-innerbox" id="invitation-collab-innerbox-email">
                      {member.email}
                    </div>
                    <div id="invitation-collab-innerbox-icon">
                    {
                      currentUser != member.userId ? (
                        <ion-icon name="trash-outline" id="invitation-trash-icon"
                          onClick={(e) => handleDeleteTeamMember(member.userId)}
                        />
                      ) : <div className="invitation-collab-innerbox" id="invitation-collab-innerbox-details">
                        (You)
                      </div>
                    }
                    </div>
                  </div>
                )
              }) : null}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  const displayInvitation = () => {
    let page;
    if (pageSelection == 1) {
      page = displaySharePage();
    } else if(pageSelection == 2) {
      page = displayTrackPage();
    } else {
      page = displayCollaboratorsPage();
    }
    return (
      <React.Fragment>
        <div className="title-container" id="title-invitation">
          <div
            className="menu-icon"
            id="menu-icon"
            onClick={() => handleMenu()}
          >
            <img id="menu-icon-img" src={iconMenubarGrey} alt="" />
          </div>
          <div className="page-title">Invitation</div>
          {/* <div className="title">Dashboard</div> */}
        </div>
        <div className="page-breadcrumbs">
        {
          currentStep.map((b, idx) => {
            if(idx > 0) {
              return (
                <a href={b['path']} key={"bread-" + idx}>
                  <span>{">"}</span>
                  <span>{b['page']}</span>
                </a>
              );
            }
            return (
              <a href={b['path']} key={"bread-" + idx}>{b['page']}</a>
            );
          })
        }
        </div>
        <div id="page-content">
          <div className="menu-bar">
            <div id="page-selection">
              <div
                onClick={(e) => {
                  handleOpenSharePage();
                }}
                className="page-button clicked"
                id="btn-page1"
              >
                Share
              </div>
              <div
                onClick={(e) => {
                  handleOpenTrackPage();
                }}
                className="page-button"
                id="btn-page2"
              >
                Track
              </div>
              <div 
                onClick={(e) => {
                  handleOpenCollaborators();
                }}
                className="page-button"
                id="btn-page3"
              >
                Add Collaborators
              </div>
            </div>
          </div>
          {page}
        </div>
      </React.Fragment>
    );
  }

  return displayInvitation();
}
export default Invitation;
