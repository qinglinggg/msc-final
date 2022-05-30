package com.mscteam.mscbackend.Feedback;

import java.sql.Time;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.mscteam.mscbackend.UserProfile.UserProfile;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class FeedbackDAO {

    private final JdbcTemplate jdbcTemplate;
    private SimpleDateFormat dateFormat = new SimpleDateFormat("YYYY-MM-dd hh:mm:ss");
    
    @Autowired
    public FeedbackDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Feedback> getFeedbackByFormId(String id){
        final String query = "SELECT * FROM Feedback WHERE formId=?";
        List<Feedback> feedbackList = jdbcTemplate.query(query, (resultSet, i) -> {
            String formId = resultSet.getString("formId");
            String feedbackId = resultSet.getString("feedbackId");
            String userId = resultSet.getString("userId");
            return new Feedback(UUID.fromString(formId), UUID.fromString(feedbackId), UUID.fromString(userId));
        }, id);
        return feedbackList; 
    }

    public List<Feedback> getAllFeedback() {
        final String query = "SELECT * FROM Feedback";
        List<Feedback> feedbackList = jdbcTemplate.query(query, (resultSet, i) -> {
            System.out.println(resultSet.getMetaData());
            String formId = resultSet.getString("formId");
            String feedbackId = resultSet.getString("feedbackId");
            String userId = resultSet.getString("userId");
            return new Feedback(UUID.fromString(formId), UUID.fromString(feedbackId), UUID.fromString(userId));
        });
        return feedbackList;
    }

    public Optional<Feedback> getFeedbackById(String id) {
        final String query = "SELECT * FROM Feedback where feedbackId=?";
        Feedback tempFeedback = jdbcTemplate.queryForObject(query, (resultSet, i) -> {
            String formId = resultSet.getString("formId");
            String feedbackId = resultSet.getString("feedbackId");
            String userId = resultSet.getString("userId");
            return new Feedback(UUID.fromString(formId), UUID.fromString(feedbackId), UUID.fromString(userId));
        }, id);
        return Optional.ofNullable(tempFeedback);
    }

    public List<FeedbackMessage> getFeedbackMessageByFeedbackId(String id){
        
        final String query = "SELECT * FROM FeedbackMessage WHERE feedbackId=?";
        List<FeedbackMessage> feedbackMessage = jdbcTemplate.query(query, (resultSet, i) -> {
            String feedbackId = resultSet.getString("feedbackId");
            String senderUserId = resultSet.getString("senderUserId");
            String messageId = resultSet.getString("messageId");
            String message = resultSet.getString("message");
            Long createDateTime = resultSet.getLong("createDateTime");
            Integer isRead = resultSet.getInt("isRead");
            System.out.println(resultSet);
            return new FeedbackMessage(UUID.fromString(feedbackId), UUID.fromString(senderUserId), UUID.fromString(messageId), message, createDateTime, isRead);
        }, id);
        // System.out.println(feedbackMessage);
        return feedbackMessage;
    }

    public UserProfile getUserByFeedbackId(String id){
        final String query = "SELECT * FROM User WHERE userId = (SELECT userId FROM Feedback WHERE feedbackId = ? )";
        UserProfile userProfile = jdbcTemplate.queryForObject(query, (resultSet, i) -> {
            String userId = resultSet.getString("userId");
            String username = resultSet.getString("username");
            String fullname = resultSet.getString("fullname");
            String email = resultSet.getString("email");
            String profileImage = resultSet.getString("profileImage");
            return new UserProfile(userId, username, fullname, email, profileImage);
        }, id);
        System.out.println(userProfile);
        return userProfile;
    }

    public String insertFeedback(Feedback feedback){
        final String query = "INSERT INTO Feedback VALUES (?,?,?)";
        int res = jdbcTemplate.update(query, feedback.getFormId().toString(), feedback.getFeedbackId().toString(), feedback.getUserId().toString());
        System.out.println("feedback.getFeedbackId() " + feedback.getFeedbackId().toString());
        return feedback.getFeedbackId().toString();
    }

    public FeedbackMessage insertFeedbackMessage(FeedbackMessage feedbackMessage){
        final String query = "INSERT INTO FeedbackMessage VALUES (?,?,?,?,?,?)";
        int res = jdbcTemplate.update(query, feedbackMessage.getFeedbackId().toString(), feedbackMessage.getSenderUserId().toString(), feedbackMessage.getMessageId().toString(), feedbackMessage.getFeedbackMessage(), feedbackMessage.getCreateDateTime(), feedbackMessage.getIsRead());
        return new FeedbackMessage(feedbackMessage.getFeedbackId(), feedbackMessage.getSenderUserId(), feedbackMessage.getMessageId(), feedbackMessage.getFeedbackMessage(), feedbackMessage.getCreateDateTime(), feedbackMessage.getIsRead());
    }

    public int removeFeedback(String id){
        final String query = "DELETE FROM Feedback WHERE feedbackId=?";
        int res = jdbcTemplate.update(query, id);
        return res;
    }

    public int removeFeedbackMessage(String id){
        final String query = "DELETE FROM FeedbackMessage WHERE messageId=?";
        int res = jdbcTemplate.update(query, id);
        return res;
    }

    public String getFeedbackIdByFormIdAndUserId(String formId, String userId){
        final String query = "SELECT feedbackId FROM Feedback WHERE formId = ? AND userId = ?";
        String feedbackId = "";
        try {
            feedbackId = jdbcTemplate.queryForObject(query, String.class, formId, userId);
        } catch(EmptyResultDataAccessException e){
            System.out.println(e);
        }
        return feedbackId;
    }

    public int readFeedbackMessage(String feedbackId, String userId) {
        final String query = "UPDATE FeedbackMessage SET isRead = 1 WHERE feedbackId = ? AND senderUserId != ?";
        int res = jdbcTemplate.update(query, feedbackId, userId);
        return res;
    }

    public int newFeedbackMessageCount(String feedbackId, String userId) {
        final String query = "SELECT COUNT(messageId) FROM FeedbackMessage WHERE feedbackId = ? AND senderUserId != ? AND isRead = 0";
        int res = jdbcTemplate.queryForObject(query, Integer.class, feedbackId, userId);
        return res;
    }
}
