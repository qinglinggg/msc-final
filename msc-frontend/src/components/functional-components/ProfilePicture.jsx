import React, { useEffect, useState } from 'react';
 
const ProfilePicture = (props) => {

    let id = props.id;
    let user = props.user;

    const [userState, setUserState] = useState(false);

    useEffect(() => {
        let profileImage = user.profileImage;
        console.log(profileImage);
        if(profileImage != "null" && profileImage) {
            setUserState(true);
        }
    }, []);

    const displayPicture = () => {
        if(!user || !user.fullname) return;
        console.log("iya")
        let splitted = user.fullname.split(" ");
        let init = "";
        splitted.map((val) => {
        init += val[0];
        });
        console.log(init);
        return init;
    }

    return (
        <div className="profile-image">
        {console.log(userState)}
        {userState ? 
        (<img id={id ? id : null} 
            src={user.profileImage} />) : (displayPicture())}
        </div>
    );

}

export default ProfilePicture;