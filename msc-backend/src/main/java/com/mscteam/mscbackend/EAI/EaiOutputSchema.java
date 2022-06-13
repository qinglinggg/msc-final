package com.mscteam.mscbackend.EAI;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class EaiOutputSchema {
    // if 0 success, -1 salah user/password
    @JsonProperty("Status")
    private Integer status;
    @JsonProperty("Value")
    private List<String> value;

    public Integer getStatus() {
        return this.status;
    }

    public List<String> getValue() {
        return this.value;
    }
}
