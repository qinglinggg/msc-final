package com.mscteam.mscbackend.EAI;

import com.fasterxml.jackson.annotation.JsonProperty;

public class EaiOutputSchema {
    // if 0 success, -1 salah user/password
    @JsonProperty("Status")
    private String status;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
