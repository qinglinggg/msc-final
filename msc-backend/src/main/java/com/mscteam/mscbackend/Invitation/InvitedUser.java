package com.mscteam.mscbackend.Invitation;

import java.util.Calendar;
import java.util.Date;
import java.util.UUID;

public class InvitedUser {
    private UUID invitationId;
    private UUID userId;
    private Date createDate;
    private Date expirationDate;

    public InvitedUser(UUID invitationId, UUID userId){
        this.invitationId = invitationId;
        this.userId = userId;
        setExpirationDate(1);
    }

    public UUID getInvitationId() {
        return this.invitationId;
    }

    public UUID getUserId() {
        return this.userId;
    }

    public Date getCreateDate() {
        return this.createDate;
    }

    public Date getExpirationDate() {
        return this.expirationDate;
    }

    public int setExpirationDate(int numberOfDays) {
        if (numberOfDays > 0) {
            Calendar cal = Calendar.getInstance();
            cal.add(Calendar.DATE, numberOfDays);
            this.expirationDate = cal.getTime();
            return 1;
        }
        return 0;
    }
}
