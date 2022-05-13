package com.mscteam.mscbackend.Form;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FormItemResponse {
    private UUID formRespondentId;
    private UUID formItemId;
    private UUID formItemResponseId;
    private UUID answerSelectionId;
    private String answerSelectionValue;

    public FormItemResponse (UUID formRespondentId, UUID formItemId, UUID formItemResponseId, UUID answerSelectionId, String answerSelectionValue){
        this.formRespondentId = formRespondentId;
        this.formItemId = formItemId;
        this.formItemResponseId = formItemResponseId;
        this.answerSelectionId = answerSelectionId;
        this.answerSelectionValue = answerSelectionValue;
    }

    public FormItemResponse (@JsonProperty("formRespondentId") UUID formRespondentId, @JsonProperty("formItemsId") UUID formItemId, @JsonProperty("answerSelectionId") UUID answerSelectionId, @JsonProperty("answerSelectionValue") String answerSelectionValue){
        this.formRespondentId = formRespondentId;
        this.formItemId = formItemId;
        this.formItemResponseId = UUID.randomUUID();
        this.answerSelectionId = answerSelectionId;
        this.answerSelectionValue = answerSelectionValue;
    }

    public UUID getFormRespondentId() {
        return this.formRespondentId;
    }

    public UUID getFormItemId() {
        return this.formItemId;
    }

    public UUID getFormItemResponseId() {
        return this.formItemResponseId;
    }

    public UUID getAnswerSelectionId() {
        return this.answerSelectionId;
    }

    public String getAnswerSelectionValue() {
        return this.answerSelectionValue;
    }

    public void setAnswerSelectionValue(String answerSelectionValue){
        this.answerSelectionValue = answerSelectionValue;
    }

}
