package com.mscteam.mscbackend.Feedback;

import java.util.Date;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FeedbackMessage {
    private UUID feedbackId;
    private UUID messageId;
    private String message;
    private Date createDate;

    // Get Items
    public FeedbackMessage(UUID feedbackId, UUID messageId, String message, Date createDate){
        this.feedbackId = feedbackId;
        this.messageId = messageId;
        this.message = message;
        this.createDate = createDate;
    }
    
    // Create, Insert mode
    public FeedbackMessage(@JsonProperty("feedbackId") UUID feedbackId, @JsonProperty("message") String message){
        this.feedbackId = feedbackId;
        this.messageId = UUID.randomUUID();
        this.message = message;
        this.createDate = new Date();
    }

    public UUID getFeedbackId() {
        return this.feedbackId;
    }

    public UUID getMessageId() {
        return this.messageId;
    }

    public String getFeedbackMessage() {
        return this.message;
    }

    public Date getCreateDate() {
        return this.createDate;
    }
}
