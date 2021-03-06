package com.mscteam.mscbackend.Form;

import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonProperty;

public class FormItems implements Comparable<FormItems>{
    private UUID formId;
    private UUID formItemsId;
    private Integer itemNumber;
    private String questionContent;
    private String questionType;
    private Integer isRequired;


    // Get Items
    public FormItems(UUID formId, UUID formItemsId, int itemNumber, String questionContent, String questionType, Integer isRequired) {
        this.formId = formId;
        this.formItemsId = formItemsId;
        this.itemNumber = itemNumber;
        this.questionContent = questionContent;
        this.questionType = questionType;
        this.isRequired = isRequired;
    }

    // Create and Insert mode
    public FormItems(@JsonProperty("formId") UUID formId, @JsonProperty("itemNumber") int itemNumber, @JsonProperty("questionContent") String questionContent, @JsonProperty("questionType") String questionType) {
        this.formId = formId;
        this.formItemsId = UUID.randomUUID();
        this.itemNumber = itemNumber;
        this.questionContent = questionContent;
        this.questionType = questionType;
        this.isRequired = 0;
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

    public Integer getIsRequired(){
        return this.isRequired;
    }

    public void setIsRequired(Integer isRequired){
        this.isRequired = isRequired;
    }

    @Override
    public int compareTo(FormItems o) {
        if (this.getItemNumber() < o.getItemNumber()) return -1;
        else return 1;
    }
}