package com.mscteam.mscbackend.Form;

import java.security.Timestamp;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonProperty;

public class FormAuthor {
    private UUID formAuthorId;
    private UUID formId;
    private UUID userId;
    private Long inviteDate;
    // private String userRole;

    // create
    public FormAuthor(@JsonProperty("formId") String formId, @JsonProperty("userId") String userId){
        this.formAuthorId = UUID.randomUUID();
        this.formId = UUID.fromString(formId);
        this.userId = UUID.fromString(userId);
        this.inviteDate = System.currentTimeMillis();
    }

    // get
    public FormAuthor(String formAuthorId, String formId, String userId, Long inviteDate){
        this.formAuthorId = UUID.fromString(formAuthorId);
        this.formId = UUID.fromString(formId);
        this.userId = UUID.fromString(userId);
        this.inviteDate = inviteDate;
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

    public Long getInviteDate(){
        return this.inviteDate;
    }

}
