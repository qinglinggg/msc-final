package com.mscteam.mscbackend.Form;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FormLastEdited {

    private UUID lastEditedId;
    private UUID formId;
    private UUID userId;
    private Long modifyDate;

    public FormLastEdited(UUID lastEditedId, UUID formId, UUID userId, Long modifyDate){
        this.lastEditedId = lastEditedId;
        this.formId = formId;
        this.userId = userId;
        this.modifyDate = modifyDate;
    }

    public FormLastEdited(@JsonProperty("formId") String formId, @JsonProperty("userId") String userId){
        this.lastEditedId = UUID.randomUUID();
        this.formId = UUID.fromString(formId);
        this.userId = UUID.fromString(userId);
        this.modifyDate = System.currentTimeMillis();
    }

    public UUID getLastEditedId(){
        return this.lastEditedId;
    }

    public UUID getFormId(){
        return this.formId;
    }

    public UUID getUserId(){
        return this.userId;
    }

    public Long getModifyDate(){
        return this.modifyDate;
    }
    
}
