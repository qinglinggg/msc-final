package com.mscteam.mscbackend.Form;

import java.sql.Timestamp;
import java.util.Date;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FormRespondent {
    private UUID formRespondentId;
    private UUID formId;
    private UUID userId;
    private Long submitDate;
    private Integer isTargeted;
    private Long inviteDate;
    private Integer versionNo;

    // get 
    public FormRespondent(String formRespondentId, String formId, String userId, Long submitDate, Integer isTargeted, Long inviteDate, Integer versionNo){
        this.formRespondentId = UUID.fromString(formRespondentId);
        this.formId = UUID.fromString(formId);
        this.userId = UUID.fromString(userId);
        this.submitDate = submitDate;
        this.isTargeted = isTargeted;
        this.inviteDate = inviteDate;
        this.versionNo = versionNo;
    }

    // create
    public FormRespondent(@JsonProperty("formId") String formId, @JsonProperty("userId") String userId, @JsonProperty("isTargeted") Integer isTargeted){
        this.formRespondentId = UUID.randomUUID();
        this.formId = UUID.fromString(formId);
        this.userId = UUID.fromString(userId);
        if(isTargeted == 1){
            this.submitDate = null;
            this.setInviteDate();
        } else {
            this.setSubmitDate();
            this.inviteDate = null;
        }
        this.isTargeted = isTargeted;
        this.versionNo = 0;
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

    public Long getSubmitDate() {
        return this.submitDate;
    }

    public void setSubmitDate() {
        this.submitDate = System.currentTimeMillis();
    }

    public Integer getIsTargeted() {
        return this.isTargeted;
    }

    public void setIsTargeted(Integer isTargeted) {
        this.isTargeted = isTargeted;
    }

    public Long getInviteDate() {
        return this.inviteDate;
    }

    public void setInviteDate() {
        this.inviteDate = System.currentTimeMillis();
    }

    public Integer getVersionNo() {
        return this.versionNo;
    }

    // public String inviteDateToTimestamp()  {
    //     Timestamp timestamp = new Timestamp(inviteDate);
    //     return timestamp.toString();
    // }

    // @Override
    // public int compareTo(FormRespondent o) {
    //     return this.getInviteDate().compareTo(o.getInviteDate());
    // }
}
