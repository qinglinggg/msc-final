package com.mscteam.mscbackend.Feedback;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FeedbackService {

    private FeedbackDAO feedbackDAO;

    @Autowired
    public FeedbackService(FeedbackDAO feedbackDAO){
        this.feedbackDAO = feedbackDAO;
    }

    public List<Feedback> getAllFeedback() {
        return feedbackDAO.getAllFeedback();
    }

    public List<Feedback> getFeedbackByFormId(String id) {
        return feedbackDAO.getFeedbackByFormId(id);
    }

    public Optional<Feedback> getFeedbackById(String id) {
        return feedbackDAO.getFeedbackById(id);
    }

    public List<FeedbackMessage> getFeedbackMessageByFeedbackId(String id) {
        return feedbackDAO.getFeedbackMessageByFeedbackId(id);
    }

    public int insertFeedback(Feedback feedback) {
        return feedbackDAO.insertFeedback(feedback);
    }

    public int insertFeedbackMessage(FeedbackMessage feedbackMessage) {
        return feedbackDAO.insertFeedbackMessage(feedbackMessage);
    }

    public int removeFeedback(String id) {
        return feedbackDAO.removeFeedback(id);
    }

    public int removeFeedbackMessage(String id) {
        return feedbackDAO.removeFeedbackMessage(id);
    }
    
}
