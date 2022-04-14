package com.mscteam.mscbackend.Form;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FormRespondent {
    
    private UUID formRespondentId;
    private UUID formId;
    private UUID userId;
    private Date submitDate;

    // get 
    public FormRespondent(UUID formRespondentId, UUID formId, UUID userId, Date submitDate){
        this.formRespondentId = formRespondentId;
        this.formId = formId;
        this.userId = userId;
        this.submitDate = submitDate;
    }

    // create
    public FormRespondent(@JsonProperty("formRespondentId") UUID formRespondentId, @JsonProperty("formId") UUID formId, @JsonProperty("userId") UUID userId){
        this.formRespondentId = UUID.randomUUID();
        this.formId = formId;
        this.userId = userId;
        this.submitDate = setSubmitDate();
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

}
