package com.mscteam.mscbackend.EAI;

import com.fasterxml.jackson.annotation.JsonProperty;

public class EaiProps {
    
    @JsonProperty("UserID")
    private String userId;
    @JsonProperty("PropertyName")
    private String propName;

    public EaiProps(String userId, String propName) {
        this.userId = userId;
        this.propName = propName;
    }

    public String getUserId() {
        return this.userId;
    }

    public String getPropName() {
        return this.propName;
    }
}
