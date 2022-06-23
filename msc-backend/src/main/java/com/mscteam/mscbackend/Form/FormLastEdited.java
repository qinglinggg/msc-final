package com.mscteam.mscbackend.Form;

import java.util.UUID;

public class FormLastEdited {

    private UUID lastEditedId;
    private UUID formId;
    private UUID formAuthorId;
    private Long modifyDate;

    public FormLastEdited(UUID lastEditedId, UUID formId, UUID formAuthorId, Long modifyDate){
        this.lastEditedId = lastEditedId;
        this.formId = formId;
        this.formAuthorId = formAuthorId;
        this.modifyDate = modifyDate;
    }

    public FormLastEdited(String formId, String formAuthorId){
        this.lastEditedId = UUID.randomUUID();
        this.formId = UUID.fromString(formId);
        this.formAuthorId = UUID.fromString(formAuthorId);
        this.modifyDate = System.currentTimeMillis();
    }

    public UUID getLastEditedId(){
        return this.lastEditedId;
    }

    public UUID getFormId(){
        return this.formId;
    }

    public UUID getFormAuthorId(){
        return this.formAuthorId;
    }

    public Long getModifyDate(){
        return this.modifyDate;
    }
    
}
