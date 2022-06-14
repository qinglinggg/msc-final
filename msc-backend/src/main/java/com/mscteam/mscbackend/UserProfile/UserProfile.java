package com.mscteam.mscbackend.UserProfile;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;
    
public class UserProfile {
    
    private final UUID userId;
    private String userdomain;
    private String fullname;
    private String email;
    private String password;
    private String profileImage;

    public UserProfile(String userId, String userdomain, String fullname, String email, String password, String profileImage){
        this.userId = UUID.fromString(userId);
        this.userdomain = userdomain;
        this.fullname = fullname;
        this.email = email;
        this.password = password;
        this.profileImage = profileImage;
    }

    public UserProfile(@JsonProperty("userDomain") String userdomain, @JsonProperty("fullname") String fullname, @JsonProperty("email") String email, @JsonProperty("password") String password, @JsonProperty("profileImage") String profileImage){
        this.userId = UUID.randomUUID();
        this.userdomain = userdomain;
        this.fullname = fullname;
        this.email = email;
        this.password = password;
        this.profileImage = profileImage;
    }

    public UUID getUserId(){
        return this.userId;
    }

    public String getFullname(){
        return this.fullname;
    }

    public String getEmail(){
        return this.email;
    }

    public String getPassword() {
        return this.password;
    }

    public String getProfileImage(){
        return this.profileImage;
    }

    public String getUserdomain() {
        return this.userdomain;
    }

    public void setFullname(String newFullname){
        this.fullname = newFullname;
    }

    public void setEmail(String newEmail){
        this.email = newEmail;
    }

    public void setProfileImage(String newLink){
        this.profileImage = newLink;
    }

    public void setUserdomain(String userdomain){
        this.userdomain = userdomain;
    }
}
