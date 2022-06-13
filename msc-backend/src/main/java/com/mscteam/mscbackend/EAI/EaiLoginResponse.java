package com.mscteam.mscbackend.EAI;

import com.fasterxml.jackson.annotation.JsonProperty;

public class EaiLoginResponse {

    @JsonProperty("ErrorSchema")
    private EaiErrorSchema errorSchema = new EaiErrorSchema();

    @JsonProperty("OutputSchema")
    private EaiOutputSchema outputSchema = new EaiOutputSchema();
    
    public EaiOutputSchema getOutputSchema() {
        return outputSchema;
    }

}
