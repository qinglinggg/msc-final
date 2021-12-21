package com.mscteam.mscbackend.Invitation;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Invitation {
    private UUID invitationId;
    private String publicLink;

    // Get data
    public Invitation(UUID invitationId, String publicLink){
        this.invitationId = invitationId;
        this.publicLink = publicLink;
    }

    // Create, insert mode
    public Invitation(@JsonProperty("publicLink") String publicLink){
        this.invitationId = UUID.randomUUID();
        this.publicLink = publicLink;
    }

    public UUID getInvitationId() {
        return this.invitationId;
    }

    public String getPublicLink() {
        return this.publicLink;
    }

    public void setPublicLink(String newLink) {
        this.publicLink = newLink;
    }
}
