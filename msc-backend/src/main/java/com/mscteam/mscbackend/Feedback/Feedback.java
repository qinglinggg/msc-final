package com.mscteam.mscbackend.Feedback;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Feedback {
    private UUID formId;
    private UUID feedbackId;
    private UUID userId;
    
    // Get Items
    public Feedback(UUID formId, UUID feedbackId, UUID userId){
        this.formId = formId;
        this.feedbackId = feedbackId;
        this.userId = userId;
    }

    // Create, Insert Items
    public Feedback(@JsonProperty("formId") UUID formId, @JsonProperty("userId") UUID userId) {
        this.formId = formId;
        this.feedbackId = UUID.randomUUID();
        this.userId = userId;
    }

    public UUID getFormId() {
        return this.formId;
    }

    public UUID getFeedbackId() {
        return this.feedbackId;
    }

    public UUID getUserId() {
        return this.userId;
    }

}
