package com.mscteam.mscbackend.Form;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/forms")
@CrossOrigin("*")
public class FormController {
    private FormService formService;

    @Autowired
    public FormController(FormService formService) {
        this.formService = formService;
    }

    @GetMapping
    public List<Form> getAllForms() {
        return formService.getAllForms();
    }

    @GetMapping(path = "/{id}")
    public Optional<Form> getFormById(@PathVariable("id") String id) {
        return formService.getFormById(id);
    }

    @PostMapping(path = "/insert", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Form insertForm(@RequestBody Form form) {
        return formService.insertForm(form);
    }

    @DeleteMapping(path = "/{id}")
    public int removeForm(@PathVariable("id") String id) {
        return formService.removeForm(id);
    }

    @PutMapping(path = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public int updateForm(@PathVariable("id") String id, @RequestBody Form toBeUpdated) {
        return formService.updateForm(id, toBeUpdated);
    }

    @PostMapping(path = "/add-form-items/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public FormItems addFormItem(@PathVariable("id") String id, @RequestBody FormItems item) {
        return formService.addFormItems(id, item);
    }

    @DeleteMapping(path = "/remove-form-items/{formItemsId}")
    public int removeFormItems(@PathVariable("formItemsId") String formItemsId) {
        return formService.removeFormItems(formItemsId);
    }

    @PutMapping(path = "/update-form-items/{formItemsId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public int updateFormItems(@PathVariable("formItemsId") String formItemsId, @RequestBody FormItems toBeUpdated) {
        return formService.updateFormItems(formItemsId, toBeUpdated);
    }

    @GetMapping(path = "/get-form-items/{id}")
    public List<FormItems> getFormItems(@PathVariable("id") String id) {
        return formService.getFormItems(id);
    }

    @GetMapping(path = "/get-a-form-item/{id}")
    public FormItems getFormItemById(@PathVariable("id") String id) {
        return formService.getFormItemById(id);
    }
    
    @GetMapping(path = "/get-response/{formItemsId}")
    public List<FormItemResponse> getFormItemResponse(@PathVariable("formItemsId") String formItemsId){
        return formService.getFormItemResponse(formItemsId);
    }

    @GetMapping(path = "/get-responses-by-id/{formRespondentId}")
    public HashMap<String, HashMap<String, String>> getResponsesById(@PathVariable("formRespondentId") String formRespondentId){
        return formService.getResponsesById(formRespondentId);
    }
    
    @PostMapping(path = "/add-answer-selection/{formItemsId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public FormAnswerSelection addAnswerSelection(@PathVariable("formItemsId") String formItemsId,
            @RequestBody FormAnswerSelection answerSelection) {
        return formService.addAnswerSelection(formItemsId, answerSelection);
    }

    @PutMapping(path = "/update-answer-selection/{answerSelectionId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public int updateAnswerSelection(@PathVariable("answerSelectionId") String answerSelectionId,
            @RequestBody FormAnswerSelection toBeUpdated) {
        return formService.updateAnswerSelection(answerSelectionId, toBeUpdated);
    }

    @GetMapping(path = "/get-answer-selection/{formItemsId}")
    public List<FormAnswerSelection> getAnswerSelections(@PathVariable("formItemsId") String formItemsId) {
        List<FormAnswerSelection> listAnswer = formService.getAnswerSelection(formItemsId);
        return listAnswer;
    }

    @DeleteMapping(path = "/remove-answer-selection/{answerSelectionId}")
    public int removeAnswerSelection(@PathVariable("answerSelectionId") String answerSelectionId) {
        return formService.removeAnswerSelection(answerSelectionId);
    }

    @DeleteMapping(path = "/remove-all-answer-selection/{formItemsId}")
    public int removeAllAnswerSelection(@PathVariable("formItemsId") String formItemsId) {
        return formService.removeAllAnswerSelection(formItemsId);
    }

    // Form Respondent

    @PostMapping(path = "/insert-form-respondent/{formId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public String insertFormRespondent(@PathVariable("formId") String formId, @RequestBody FormRespondent formRespondent){
        return formService.insertFormRespondent(formId, formRespondent);
    }

    @PostMapping(path = "/form-respondent/{formId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public List<String> getFormRespondentByUserId(@PathVariable("formId") String formId, @RequestBody HashMap<String, String> map){
        String userId = map.get("userId");
        System.out.println("Check ResponseBody: " + userId);
        return formService.getFormRespondentByUserId(formId, userId);
    }

    @GetMapping(path = "/get-all-resp/{formId}")
    public List<String> getAllFormRespondent(@PathVariable("formId") String formId) {
        return formService.getAllFormRespondent(formId);
    }

    // Form Item Response
    @PostMapping(path = "/insert-response/{formRespondentId}")
    public int insertFormItemResponse(@PathVariable("formRespondentId") String formRespondentId, @RequestBody FormItemResponse formItemResponse){
        return formService.insertFormItemResponse(formRespondentId, formItemResponse);
    }

    @PutMapping(path ="/update-response/{formRespondentId}")
    public int updateFormItemResponse(@PathVariable("formRespondentId") String formRespondentId, @RequestBody FormItemResponse formItemResponse){
        return formService.updateFormItemResponse(formRespondentId, formItemResponse);
    }

    @GetMapping(path="/owned-form/{authorUserId}")
    public List<Form> getAuthoredForms(@PathVariable("authorUserId") String userId){
        return formService.getAuthoredForms(userId);
    }

    @GetMapping(path="/invited-form-respondent/{userId}")
    public List<FormRespondent> getInvitedFormRespondent(@PathVariable("userId") String userId){
        return formService.getInvitedFormRespondent(userId);
    }

    @PostMapping(path="/invited-form/{userId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public List<Form> getInvitedForms(@PathVariable("userId") String userId, @RequestBody List<FormRespondent> invitedData){
        return formService.getInvitedForms(userId, invitedData);
    }

    @GetMapping(path="/get-targeted-user-list/{formId}")
    public List<FormRespondent> getFormTargetedUserList(@PathVariable("formId") String formId){
        return formService.getFormTargetedUserList(formId);
    }

    @PostMapping(path="/insert-targeted-user/{formId}")
    public int insertTargetedUser(@PathVariable("formId") String formId, @RequestBody String userEmail){
        return formService.insertTargetedUser(formId, userEmail);
    }
    
    @DeleteMapping(path="/delete-targeted-user/{formRespondentId}")
    public int deleteTargetedUser(@PathVariable("formRespondentId") String formRespondentId, @RequestBody FormRespondent targetedUser){
        return formService.deleteTargetedUser(formRespondentId, targetedUser);
    }

    // cuma untuk keperluan testing
    @DeleteMapping(path="/force-delete-form-respondent/{formId}")
    public int forceDeleteFormRespondent(@PathVariable("formId") String formId, @RequestBody String userId){
        return formService.forceDeleteFormRespondent(formId, userId);
    }

    @PutMapping(path="/submit-form/{formRespondentId}")
    public int submitForm(@PathVariable("formRespondentId") String formRespondentId){
        return formService.submitForm(formRespondentId);
    }

}
