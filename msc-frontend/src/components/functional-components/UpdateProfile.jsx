import axios from 'axios';
import React, { Component, useEffect, useState } from 'react';
import ProfilePicture from './ProfilePicture';
import UploadImage from "./UploadImage";

const BASE_URL = "http://10.61.42.160:8080";
function UpdateProfile(props) {
    useEffect(() => {
        let el = document.getElementById("body");
        if(el && !el.classList.contains("openPopup")) {
            el.classList.add("openPopup");
            props.handleOpenedPopup(true);
        }
        let clsBtn = document.getElementById("menu-close");
        if(clsBtn) clsBtn.addEventListener("click", () => {
            if(el && el.classList.contains("openPopup")) el.classList.remove("openPopup");
            props.handleUpdate();
            props.handleOpenedPopup(false);
        });
    }, []);

    return (
        <React.Fragment>
            <div className="update-page">
                <div className="update-container">
                    <div className="update-close-container">
                        <ion-icon name="close-outline" id="menu-close"></ion-icon>
                    </div>
                    <div>Update Profile Image</div>
                    <div className="divider"></div>
                    <div className="current-profile">
                        <span>Current Profile:</span>
                        <div className="image-container">
                            <ProfilePicture user={props.currentUser}/>
                        </div>
                    </div>
                    <UploadImage mode="profile" currentUser={props.currentUser} handleUpdateProfile={props.handleUpdateProfile}/>
                </div>
            </div>
        </React.Fragment>
    );
}

export default UpdateProfile;