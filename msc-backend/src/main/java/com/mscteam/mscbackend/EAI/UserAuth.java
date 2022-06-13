package com.mscteam.mscbackend.EAI;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserAuth {
    @JsonProperty("ApplicationID")
    private String appId;
    @JsonProperty("UserID")
    private String userDomain;
    @JsonProperty("Password")
    private String password;

    public UserAuth(String appId, String userDomain, String password) {
        this.appId = appId;
        this.userDomain = userDomain;
        this.password = password;
    }

    public String getAppId() {
        return this.appId;
    }

    public String getUserDomain() {
        return userDomain;
    }

    public String getPassword() {
        return password;
    }

    public void renewPassword(String encoded) {
        this.password = encoded;
    }
}
