package com.mscteam.mscbackend.Invitation;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

public class InvitationDAO {
    
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public InvitationDAO(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Invitation> getAllInvitation(){
        final String query = "SELECT * FROM Invitation";
        List<Invitation> invitationList = jdbcTemplate.query(query, (resultSet, i) -> {
            String invitationId = resultSet.getString("invitationId");
            String publicLink = resultSet.getString("publicLink");
            return new Invitation(UUID.fromString(invitationId), publicLink);
        });
        return invitationList;
    }

    public Invitation getInvitation(String id) {
        final String query = "SELECT * FROM Invitation WHERE invitationId=?";
        Invitation invitation = jdbcTemplate.queryForObject(query, (resultSet, i) -> {
            String invitationId = resultSet.getString("invitationId");
            String publicLink = resultSet.getString("publicLink");
            return new Invitation(UUID.fromString(invitationId), publicLink);
        }, id);
        return invitation;
    }

    public int updateInvitation(String id, Invitation toBeUpdated) {
        String query = "UPDATE Invitation SET";
        query += " publicLink= '" + toBeUpdated.getPublicLink() + "'";
        query += " WHERE invitationId = ?";
        int res = jdbcTemplate.update(query, id);
        return res;
    }

    public int insertInvitation(Invitation invitation) {
        final String query = "INSERT INTO Invitation VALUES (?,?)";
        int res = jdbcTemplate.update(query, invitation.getInvitationId(), invitation.getPublicLink());
        return res;
    }

    public List<InvitedUser> getInvitedUser(String id) {
        final String query = "SELECT * FROM InvitedUser WHERE invitationId=?";
        List<InvitedUser> invitedUserList = jdbcTemplate.query(query, (resultSet, i) -> {
            String invitationId = resultSet.getString("invitationId");
            String userId = resultSet.getString("userId");
            return new InvitedUser(UUID.fromString(invitationId), UUID.fromString(userId));
        }, id);
        return invitedUserList;
    }

    public int insertInvitedUser(InvitedUser invitedUser) {
        final String query = "INSERT INTO InvitedUser VALUES (?,?,?,?)";
        int res = jdbcTemplate.update(query, invitedUser.getInvitationId(), invitedUser.getUserId(),
        invitedUser.getCreateDate(), invitedUser.getExpirationDate());
        return res;
    }

    public int removeInvitedUser(String id) {
        final String query = "DELETE FROM InvitedUser WHERE invitationId=?";
        int res = jdbcTemplate.update(query, id);
        return res;
    }
}
