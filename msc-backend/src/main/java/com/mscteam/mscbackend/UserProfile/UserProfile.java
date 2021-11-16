package com.mscteam.mscbackend.UserProfile;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;
    
public class UserProfile {
    
    private final UUID userId;
    private String username;
    private String fullname;
    private String email;
    private String profileImage;

    public UserProfile(String userId, String username, String fullname, String email, String profileImage){
        this.userId = UUID.fromString(userId);
        this.username = username;
        this.fullname = fullname;
        this.email = email;
        this.profileImage = profileImage;
    }

    public UserProfile(@JsonProperty("username") String username, @JsonProperty("fullname") String fullname, @JsonProperty("email") String email, @JsonProperty("profileImage") String profileImage){
        this.userId = UUID.randomUUID();
        this.username = username;
        this.fullname = fullname;
        this.email = email;
        this.profileImage = profileImage;
    }

    public void setUsername(String newUsername){
        this.username = newUsername;
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

    public UUID getUserId(){
        return this.userId;
    }

    public String getUsername(){
        return this.username;
    }

    public String getFullname(){
        return this.fullname;
    }

    public String getEmail(){
        return this.email;
    }

    public String getProfileImage(){
        return this.profileImage;
    }
}
