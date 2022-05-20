package com.mscteam.mscbackend.Feedback;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import com.mscteam.mscbackend.UserProfile.UserProfile;

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
        List<FeedbackMessage> feedbackMessagesList = feedbackDAO.getFeedbackMessageByFeedbackId(id);
        Collections.sort(feedbackMessagesList);
        return feedbackMessagesList;
    }

    public UserProfile getUserByFeedbackId(String id){
        return feedbackDAO.getUserByFeedbackId(id);
    }

    public FeedbackMessage getLastFeedbackMessageByFeedbackId(String id){
        List<FeedbackMessage> sortedList = this.getFeedbackMessageByFeedbackId(id);
        FeedbackMessage lastMessage = null;
        System.out.println(sortedList);
        if(sortedList.size() > 0) lastMessage = sortedList.get(sortedList.size() - 1);

        return lastMessage;
    }

    public String insertFeedback(Feedback feedback) {
        Optional<String> feedbackId = feedbackDAO.getFeedbackIdByFormIdAndUserId(feedback.getFormId().toString(), feedback.getUserId().toString());
        if(feedbackId.isPresent()) return feedbackId.get();
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
    
    // public Optional<String> getFeedbackIdByFormIdAndUserId(String formId, String userId){
    //     return feedbackDAO.getFeedbackIdByFormIdAndUserId(formId, userId);
    // }

}
