package com.mscteam.mscbackend.Invitation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/invitation")
@CrossOrigin("*")
public class InvitationController {
    
    private InvitationService invitationService;

    @Autowired
    public InvitationController(InvitationService invitationService){
        this.invitationService = invitationService;
    }

    @GetMapping
    public List<Invitation> getAllInvitation() {
        return invitationService.getAllInvitation();
    }

    @GetMapping(path="/{id}")
    public Invitation getInvitation(@PathVariable("id") String id) {
        return invitationService.getInvitation(id);
    }

    @PutMapping(path="/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public int updateInvitation(String id, Invitation toBeUpdated){
        return invitationService.updateInvitation(id, toBeUpdated);
    }

    @PostMapping(path="/insert", consumes = MediaType.APPLICATION_JSON_VALUE)
    public int insertInvitation(Invitation invitation) {
        return invitationService.insertInvitation(invitation);
    }

    @GetMapping(path="/get-invited/{id}")
    public List<InvitedUser> getInvitedUser(String id) {
        return invitationService.getInvitedUser(id);
    }

    @DeleteMapping(path="/get-invited/{id}")
    public int removeInvitedUser(String id) {
        return invitationService.removeInvitedUser(id);
    }
}
