package com.mscteam.mscbackend.Feedback;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FeedbackMessage implements Comparable<FeedbackMessage> {
    private UUID feedbackId;
    private UUID senderUserId;
    private UUID messageId;
    private String message;
    private Long createDateTime;
    private Integer isRead;

    // Get Items
    public FeedbackMessage(UUID feedbackId, UUID senderUserId, UUID messageId, String message, Long createDateTime, Integer isRead){
        this.feedbackId = feedbackId;
        this.senderUserId = senderUserId;
        this.messageId = messageId;
        this.message = message;
        this.createDateTime = createDateTime;
        this.isRead = isRead;
    }
    
    // Create, Insert mode
    public FeedbackMessage(@JsonProperty("feedbackId") UUID feedbackId, @JsonProperty("userId") UUID senderUserId, @JsonProperty("feedbackMessage") String message){
        this.feedbackId = feedbackId;
        this.senderUserId = senderUserId;
        this.messageId = UUID.randomUUID();
        this.message = message;
        this.createDateTime = System.currentTimeMillis();
        this.isRead = 0;
    }

    public UUID getFeedbackId() {
        return this.feedbackId;
    }

    public UUID getSenderUserId() {
        return this.senderUserId;
    }

    public UUID getMessageId() {
        return this.messageId;
    }

    public String getFeedbackMessage() {
        return this.message;
    }

    public Long getCreateDateTime() {
        return this.createDateTime;
    }

    public Integer getIsRead() {
        return this.isRead;
    }

    @Override
    public int compareTo(FeedbackMessage o) {
        // if (this.getCreateDateTime() == null || o.getCreateDateTime() == null) return 0;
        return this.getCreateDateTime().compareTo(o.getCreateDateTime());
    }

}
