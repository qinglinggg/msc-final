package com.mscteam.mscbackend.Form;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FormAnswerSelection {
    private UUID formItemsId;
    private UUID answerSelectionId;
    private String answerSelectionLabel;
    private String answerSelectionValue;

    // Get Items
    public FormAnswerSelection(UUID formItemsId, UUID answerSelectionId, String answerSelectionLabel,
            String answerSelectionValue) {
        this.formItemsId = formItemsId;
        this.answerSelectionId = answerSelectionId;
        this.answerSelectionLabel = answerSelectionLabel;
        this.answerSelectionValue = answerSelectionValue;
    }

    // Create and Insert Mode
    public FormAnswerSelection(@JsonProperty("formItemsId") UUID formItemsId,
            @JsonProperty("label") String answerSelectionLabel,
            @JsonProperty("value") String answerSelectionValue) {
        this.formItemsId = formItemsId;
        this.answerSelectionId = UUID.randomUUID();
        this.answerSelectionLabel = answerSelectionLabel;
        this.answerSelectionValue = answerSelectionValue;
    }

    public UUID getFormItemsId() {
        return this.formItemsId;
    }

    public UUID getId() {
        return this.answerSelectionId;
    }

    public String getLabel() {
        return this.answerSelectionLabel;
    }

    public String getValue() {
        return this.answerSelectionValue;
    }

    public void setLabel(String answerSelectionLabel) {
        this.answerSelectionLabel = answerSelectionLabel;
    }

    public void setValue(String answerSelectionValue) {
        this.answerSelectionValue = answerSelectionValue;
    }

}
