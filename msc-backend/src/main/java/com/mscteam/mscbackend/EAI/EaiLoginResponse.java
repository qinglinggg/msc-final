package com.mscteam.mscbackend.EAI;

import com.fasterxml.jackson.annotation.JsonProperty;

public class EaiLoginResponse {
    @JsonProperty("OutputSchema")
    private EaiOutputSchema outputSchema = new EaiOutputSchema();
    
    public EaiOutputSchema getOutputSchema() {
        return outputSchema;
    }
}
