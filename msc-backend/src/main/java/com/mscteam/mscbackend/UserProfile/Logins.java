package com.mscteam.mscbackend.UserProfile;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Logins {
    private String userId;
    private String bearerToken;

    public Logins(String userId, String bearerToken) {
        this.userId = userId;
        this.bearerToken = bearerToken;
    }

    public Logins(@JsonProperty("userId") String userId) {
        this.userId = userId;
        this.bearerToken = UUID.randomUUID().toString();
    }

    public String getUserId() {
        return userId;
    }

    public String getBearerToken() {
        return bearerToken;
    }
}
