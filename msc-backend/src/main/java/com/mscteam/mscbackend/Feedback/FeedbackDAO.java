package com.mscteam.mscbackend.Feedback;

import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
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
            String userProfileId = resultSet.getString("userProfileId");
            return new Feedback(UUID.fromString(formId), UUID.fromString(feedbackId), UUID.fromString(userProfileId));
        }, id);
        return feedbackList; 
    }

    public List<Feedback> getAllFeedback() {
        final String query = "SELECT * FROM Feedback";
        List<Feedback> feedbackList = jdbcTemplate.query(query, (resultSet, i) -> {
            String formId = resultSet.getString("formId");
            String feedbackId = resultSet.getString("feedbackId");
            String userProfileId = resultSet.getString("userProfileId");
            return new Feedback(UUID.fromString(formId), UUID.fromString(feedbackId), UUID.fromString(userProfileId));
        });
        return feedbackList;
    }

    public Optional<Feedback> getFeedbackById(String id) {
        final String query = "SELECT * FROM Feedback where feedbackId=?";
        Feedback tempFeedback = jdbcTemplate.queryForObject(query, (resultSet, i) -> {
            String formId = resultSet.getString("formId");
            String feedbackId = resultSet.getString("feedbackId");
            String userProfileId = resultSet.getString("userProfileId");
            return new Feedback(UUID.fromString(formId), UUID.fromString(feedbackId), UUID.fromString(userProfileId));
        }, id);
        return Optional.ofNullable(tempFeedback);
    }

    public List<FeedbackMessage> getFeedbackMessageByFeedbackId(String id){
        final String query = "SELECT * FROM FeedbackMessage WHERE feedbackId=?";
        List<FeedbackMessage> feedbackMessage = jdbcTemplate.query(query, (resultSet, i) -> {
            String feedbackId = resultSet.getString("feedbackId");
            String messageId = resultSet.getString("messageId");
            String message = resultSet.getString("message");
            Date createDate = null;
            try {
                createDate = dateFormat.parse(resultSet.getString("createDate"));
            } catch (Exception e) {
                e.printStackTrace();
            }
            return new FeedbackMessage(UUID.fromString(feedbackId), UUID.fromString(messageId), message, createDate);
        }, id);
        return feedbackMessage;
    }

    public int insertFeedback(Feedback feedback){
        final String query = "INSERT INTO Feedback VALUES (?,?,?)";
        int res = jdbcTemplate.update(query, feedback.getFormId(), feedback.getFeedbackId(), feedback.getUserProfileId());
        return res;
    }

    public int insertFeedbackMessage(FeedbackMessage feedbackMessage){
        final String query = "INSERT INTO FeedbackMessage VALUES (?,?,?)";
        int res = jdbcTemplate.update(query, feedbackMessage.getFeedbackId(), feedbackMessage.getFeedbackMessage(), feedbackMessage.getFeedbackMessage());
        return res;
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
}
