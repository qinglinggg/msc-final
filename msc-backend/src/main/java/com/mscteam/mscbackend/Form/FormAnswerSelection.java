package com.mscteam.mscbackend.Form;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FormAnswerSelection {
    private UUID formItemsId;
    private UUID answerSelectionId;
    private String answerSelectionContent;
    
    // Get Items
    public FormAnswerSelection(UUID formItemsId, UUID answerSelectionId, String answerSelectionContent){
        this.formItemsId = formItemsId;
        this.answerSelectionId = answerSelectionId;
        this.answerSelectionContent = answerSelectionContent;
    }

    // Create and Insert Mode
    public FormAnswerSelection(@JsonProperty("formItemsId") UUID formItemsId, @JsonProperty("answerSelectionContent") String answerSelectionContent){
        this.formItemsId = formItemsId;
        this.answerSelectionId = UUID.randomUUID();
        this.answerSelectionContent = answerSelectionContent;
    }

    public UUID getFormItemsId() {
        return this.formItemsId;
    }

    public UUID getId() {
        return this.answerSelectionId;
    }

    public String getContent() {
        return this.answerSelectionContent;
    }

    public void setContent(String answerSelectionContent) {
        this.answerSelectionContent = answerSelectionContent;
    }
}
