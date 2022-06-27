import React, { useEffect, useState } from 'react';
 
const ProfilePicture = (props) => {

    const [userState, setUserState] = useState(false);

    useEffect(() => {
        if(!props.user || !props.user.profileImage) return;
        let profileImage = props.user.profileImage;
        if(profileImage != "null" && profileImage) {
            setUserState(true);
        }
    }, [props.user]);

    const displayPicture = () => {
        if(!props.user || !props.user.fullname) return;
        let splitted = props.user.fullname.split(" ");
        let init = "";
        splitted.map((val) => {
        init += val[0];
        });
        return init;
    }

    return (
        <div className="profile-image">
        {userState && props.user ? 
        (<img src={props.user.profileImage} />) : (displayPicture())}
        </div>
    );

}

export default ProfilePicture;