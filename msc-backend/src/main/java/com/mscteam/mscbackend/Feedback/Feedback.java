package com.mscteam.mscbackend.Feedback;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Feedback {
    private UUID formId;
    private UUID feedbackId;
    private UUID userProfileId;
    
    // Get Items
    public Feedback(UUID formId, UUID feedbackId, UUID userProfileId){
        this.formId = formId;
        this.feedbackId = feedbackId;
        this.userProfileId = userProfileId;
    }

    // Create, Insert Items
    public Feedback(@JsonProperty("formId") UUID formId, @JsonProperty("userProfileId") UUID userProfileId) {
        this.formId = formId;
        this.feedbackId = UUID.randomUUID();
        this.userProfileId = userProfileId;
    }

    public UUID getFormId() {
        return this.formId;
    }

    public UUID getFeedbackId() {
        return this.feedbackId;
    }

    public UUID getUserProfileId() {
        return this.userProfileId;
    }

}
