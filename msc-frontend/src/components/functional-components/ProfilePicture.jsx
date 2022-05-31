import React from 'react';
 
const ProfilePicture = (props) => {

    let id = props.id;
    let user = props.user;

    const displayPicture = () => {
        let profileImage = user.profileImage;
        if(profileImage != "null") return profileImage;
        let splitted = user.fullname.split(" ");
        let init = "";
        splitted.map((val) => {
        init += val[0];
        });
        return init;
    }

    return (
        <img className="profile-image" 
            id={id ? id : null} 
            src={displayPicture()} 
        />
    )

}

export default ProfilePicture;