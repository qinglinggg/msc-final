package com.mscteam.mscbackend.Feedback;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import com.mscteam.mscbackend.UserProfile.UserProfile;
import com.mscteam.mscbackend.UserProfile.UserProfileDAO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FeedbackService {

    private FeedbackDAO feedbackDAO;
    private UserProfileDAO userProfileDAO;

    @Autowired
    public FeedbackService(FeedbackDAO feedbackDAO){
        this.feedbackDAO = feedbackDAO;
        // this.userProfileDAO = userProfileDAO;
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
        // Optional<String> feedbackId = feedbackDAO.getFeedbackIdByFormIdAndUserId(feedback.getFormId().toString(), feedback.getUserId().toString());
        // if(feedbackId.isPresent()){
        //     System.out.println("feedbackId.isPresent " + feedbackId);
        //     return feedbackId.get();
        // }
        String feedbackId = feedbackDAO.getFeedbackIdByFormIdAndUserId(feedback.getFormId().toString(), feedback.getUserId().toString());
        if(feedbackId != "") return feedbackId;
        return feedbackDAO.insertFeedback(feedback);
    }

    public FeedbackMessage insertFeedbackMessage(FeedbackMessage feedbackMessage) {
        return feedbackDAO.insertFeedbackMessage(feedbackMessage);
    }

    public int removeFeedback(String id) {
        return feedbackDAO.removeFeedback(id);
    }

    public int removeFeedbackMessage(String id) {
        return feedbackDAO.removeFeedbackMessage(id);
    }

    public int readFeedbackMessage(String feedbackId, String userId) {
        return feedbackDAO.readFeedbackMessage(feedbackId, userId);
    }

    public int newFeedbackMessageCount(String feedbackId, String userId){
        return feedbackDAO.newFeedbackMessageCount(feedbackId, userId);
    }

}
