package com.mscteam.mscbackend.Invitation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class InvitationService {
    
    private InvitationDAO invitationDAO;

    @Autowired
    public InvitationService(InvitationDAO invitationDAO){
        this.invitationDAO = invitationDAO;
    }

    public List<Invitation> getAllInvitation(){
        return invitationDAO.getAllInvitation();
    }

    public Invitation getInvitation(String id){
        return invitationDAO.getInvitation(id);
    }

    public int updateInvitation(String id, Invitation toBeUpdated){
        return invitationDAO.updateInvitation(id, toBeUpdated);
    }

    public int insertInvitation(Invitation invitation){
        return invitationDAO.insertInvitation(invitation);
    }

    public List<InvitedUser> getInvitedUser(String id){
        return invitationDAO.getInvitedUser(id);
    }

    public int insertInvitedUser(InvitedUser invitedUser){
        return invitationDAO.insertInvitedUser(invitedUser);
    }

    public int removeInvitedUser(String id){
        return invitationDAO.removeInvitedUser(id);
    }
}
