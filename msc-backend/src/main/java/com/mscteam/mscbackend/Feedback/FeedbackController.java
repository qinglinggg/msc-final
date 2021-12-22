package com.mscteam.mscbackend.Feedback;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/feedback")
@CrossOrigin("*")
public class FeedbackController {

    private FeedbackService feedbackService;

    @Autowired
    public FeedbackController(FeedbackService feedbackService){
        this.feedbackService = feedbackService;
    }

    @GetMapping
    public List<Feedback> getAllFeedback() {
        return feedbackService.getAllFeedback();
    }

    @GetMapping(path="/by-form/{id}")
    public List<Feedback> getFeedbackByFormId(@PathVariable("id") String id){
        return feedbackService.getFeedbackByFormId(id);
    }

    @GetMapping(path="/{id}")
    public Optional<Feedback> getFeedbackById(@PathVariable("id") String id){
        return feedbackService.getFeedbackById(id);
    }

    @GetMapping(path="/by-feedback/{id}")
    public List<FeedbackMessage> getFeedbackMessageByFeedbackId(String id){
        return feedbackService.getFeedbackMessageByFeedbackId(id);
    }

    @PostMapping(path="/by-feedback/insert", consumes = MediaType.APPLICATION_JSON_VALUE)
    public int insertFeedback(@RequestBody Feedback feedback){
        return feedbackService.insertFeedback(feedback);
    }

    @PostMapping(path="/by-feedback-message/insert", consumes = MediaType.APPLICATION_JSON_VALUE)
    public int insertFeedbackMessage(@RequestBody FeedbackMessage feedbackMessage){
        return feedbackService.insertFeedbackMessage(feedbackMessage);
    }

    @DeleteMapping(path="/{id}")
    public int removeFeedback(@PathVariable("id") String id){
        return feedbackService.removeFeedback(id);
    }

    @DeleteMapping(path="/by-feedback-message/{id}")
    public int removeFeedbackMessage(@PathVariable("id") String id){
        return feedbackService.removeFeedbackMessage(id);
    }
}
