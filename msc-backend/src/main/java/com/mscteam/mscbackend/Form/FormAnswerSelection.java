package com.mscteam.mscbackend.Form;

import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FormAnswerSelection implements Comparable<FormAnswerSelection> {
    private UUID formItemsId;
    private UUID answerSelectionId;
    private String answerSelectionLabel;
    private String answerSelectionValue;
    private Integer answerSelectionNo;

    // Get Items
    public FormAnswerSelection(UUID formItemsId, UUID answerSelectionId, Integer answerSelectionNo, String answerSelectionLabel,
            String answerSelectionValue) {
        this.formItemsId = formItemsId;
        this.answerSelectionId = answerSelectionId;
        this.answerSelectionNo = answerSelectionNo;
        this.answerSelectionLabel = answerSelectionLabel;
        this.answerSelectionValue = answerSelectionValue;
    }

    // Create and Insert Mode
    public FormAnswerSelection(@JsonProperty("formItemsId") UUID formItemsId, 
            @JsonProperty("no") Integer answerSelectionNo,
            @JsonProperty("label") String answerSelectionLabel,
            @JsonProperty("value") String answerSelectionValue) {
        this.formItemsId = formItemsId;
        this.answerSelectionId = UUID.randomUUID();
        this.answerSelectionNo = answerSelectionNo;
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

    public Integer getNo() {
        return this.answerSelectionNo;
    }

    public void setLabel(String answerSelectionLabel) {
        this.answerSelectionLabel = answerSelectionLabel;
    }

    public void setValue(String answerSelectionValue) {
        this.answerSelectionValue = answerSelectionValue;
    }

    public void setNo(Integer answerSelectionNo) {
        this.answerSelectionNo = answerSelectionNo;
    }

    @Override
    public int compareTo(FormAnswerSelection o) {
        if (this.getNo() > o.getNo()) return -1;
        else return 1;
    }

}
