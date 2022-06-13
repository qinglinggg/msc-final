package com.mscteam.mscbackend.EAI;

import com.fasterxml.jackson.annotation.JsonProperty;

public class EaiErrorSchema {
    
    @JsonProperty("ErrorCode")
    private String errorCode;
    @JsonProperty("ErrorMessage")
    private Object errorMessage;

    public String getCode() {
        return this.errorCode;
    }

    public Object getMessage() {
        return this.errorMessage;
    }

}
