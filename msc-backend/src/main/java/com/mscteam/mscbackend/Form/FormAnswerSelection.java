package com.mscteam.mscbackend.Form;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FormAnswerSelection implements Comparable<FormAnswerSelection> {
    private UUID formItemsId;
    private UUID answerSelectionId;
    private String answerSelectionLabel;
    private String answerSelectionValue;
    private Integer answerSelectionNo;
    private int nextItem;
    private int prevItem;
    private Integer versionNo;

    // Get Items
    public FormAnswerSelection(UUID formItemsId, UUID answerSelectionId, Integer answerSelectionNo, String answerSelectionLabel,
            String answerSelectionValue, int nextItem, int prevItem, Integer versionNo) {
        this.formItemsId = formItemsId;
        this.answerSelectionId = answerSelectionId;
        this.answerSelectionNo = answerSelectionNo;
        this.answerSelectionLabel = answerSelectionLabel;
        this.answerSelectionValue = answerSelectionValue;
        this.nextItem = nextItem;
        this.prevItem = prevItem;
        this.versionNo = versionNo;
    }

    // Create and Insert Mode
    public FormAnswerSelection(@JsonProperty("formItemsId") UUID formItemsId, 
            @JsonProperty("no") Integer answerSelectionNo,
            @JsonProperty("label") String answerSelectionLabel,
            @JsonProperty("value") String answerSelectionValue,
            @JsonProperty("versionNo") Integer versionNo) {
        this.formItemsId = formItemsId;
        this.answerSelectionId = UUID.randomUUID();
        this.answerSelectionNo = answerSelectionNo;
        this.answerSelectionLabel = answerSelectionLabel;
        this.answerSelectionValue = answerSelectionValue;
        this.prevItem = -1; // Jika -1, maka display item yang sekarang...
        this.nextItem = -1;
        this.versionNo = versionNo;
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

    public int getNextItem() {
        return this.nextItem;
    }

    public void setNextItem(int val) {
        this.nextItem = val;
    }

    public int getPrevItem() {
        return this.prevItem;
    }

    public void setPrevItem(int val) {
        this.prevItem = val;
    }

    public Integer getVersionNo(){
        return this.versionNo;
    }

    public void setVersionNo(Integer versionNo) {
        this.versionNo = versionNo;
    }

    @Override
    public int compareTo(FormAnswerSelection o) {
        if (this.getNo() > o.getNo()) return -1;
        else return 1;
    }

}
