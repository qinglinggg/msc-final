package com.mscteam.mscbackend.Form;

import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonProperty;

public class FormItems implements Comparable<FormItems>{
    private UUID formId;
    private UUID formItemsId;
    private Integer itemNumber;
    private String questionContent;
    private String questionType;
    private int nextItem;
    private int prevItem;

    // Get Items
    public FormItems(UUID formId, UUID formItemsId, int itemNumber, String questionContent, String questionType, int nextItem, int prevItem) {
        this.formId = formId;
        this.formItemsId = formItemsId;
        this.itemNumber = itemNumber;
        this.questionContent = questionContent;
        this.questionType = questionType;
        this.nextItem = nextItem;
        this.prevItem = prevItem;
    }

    // Create and Insert mode
    public FormItems(@JsonProperty("formId") UUID formId, @JsonProperty("itemNumber") int itemNumber, @JsonProperty("questionContent") String questionContent, @JsonProperty("questionType") String questionType) {
        this.formId = formId;
        this.formItemsId = UUID.randomUUID();
        this.itemNumber = itemNumber;
        this.questionContent = questionContent;
        this.questionType = questionType;
        this.prevItem = -1; // Jika -1, maka display item yang sekarang...
        this.nextItem = -1;
    }

    public UUID getFormId() {
        return this.formId;
    }

    public UUID getId() {
        return this.formItemsId;
    }

    public int getItemNumber(){
        return this.itemNumber;
    }

    public void setItemNumber(int itemNumber){
        this.itemNumber = itemNumber;
    }

    public String getContent() {
        return this.questionContent;
    }

    public void setContent(String questionContent) {
        this.questionContent = questionContent;
    }

    public String getType() {
        return this.questionType;
    }

    public void setType(String questionType) {
        this.questionType = questionType;
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

    @Override
    public int compareTo(FormItems o) {
        if (this.getItemNumber() < o.getItemNumber()) return -1;
        else return 1;
    }
}