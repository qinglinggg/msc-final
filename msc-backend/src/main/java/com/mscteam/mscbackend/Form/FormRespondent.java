package com.mscteam.mscbackend.Form;

import java.util.Date;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FormRespondent {
    private UUID formRespondentId;
    private UUID formId;
    private UUID userId;
    private Date submitDate;
    private Integer isTargeted;

    // get 
    public FormRespondent(String formRespondentId, String formId, String userId, Date submitDate, Integer isTargeted){
        this.formRespondentId = UUID.fromString(formRespondentId);
        this.formId = UUID.fromString(formId);
        this.userId = UUID.fromString(userId);
        this.submitDate = submitDate;
        this.isTargeted = isTargeted;
    }

    // create
    public FormRespondent(@JsonProperty("formId") String formId, @JsonProperty("userId") String userId, @JsonProperty("isTargeted") Integer isTargeted){
        this.formRespondentId = UUID.randomUUID();
        this.formId = UUID.fromString(formId);
        this.userId = UUID.fromString(userId);
        this.submitDate = setSubmitDate();
        this.isTargeted = isTargeted;
    }

    public UUID getFormRespondentId() {
        return this.formRespondentId;
    }

    public UUID getFormId() {
        return this.formId;
    }

    public UUID getUserId() {
        return this.userId;
    }

    public Date getSubmitDate() {
        return this.submitDate;
    }

    public Date setSubmitDate() {
        Date date = new Date();
        return date;
    }

    public Integer getIsTargeted() {
        return this.isTargeted;
    }

    public void setIsTargeted(Integer isTargeted) {
        this.isTargeted = isTargeted;
    }

}
