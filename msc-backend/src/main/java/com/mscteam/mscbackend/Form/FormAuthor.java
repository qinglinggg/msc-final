package com.mscteam.mscbackend.Form;

import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonProperty;

public class FormAuthor {
    private UUID formAuthorId;
    private UUID formId;
    private UUID userId;
    // private String userRole;

    // create
    public FormAuthor(@JsonProperty("formId") String formId, @JsonProperty("userId") String userId){
        this.formAuthorId = UUID.randomUUID();
        this.formId = UUID.fromString(formId);
        this.userId = UUID.fromString(userId);
    }

    // get
    public FormAuthor(String formAuthorId, String formId, String userId){
        this.formAuthorId = UUID.fromString(formAuthorId);
        this.formId = UUID.fromString(formId);
        this.userId = UUID.fromString(userId);
    }

    public UUID getFormAuthorId(){
        return this.formAuthorId;
    }

    public UUID getFormId(){
        return this.formId;
    }

    public UUID getUserId(){
        return this.userId;
    }

}
