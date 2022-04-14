package com.mscteam.mscbackend.Form;

import java.util.List;
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
        return formService.getAnswerSelection(formItemsId);
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

    @PostMapping(path = "/insert-form-respondent/{formId}")
    public String insertFormRespondent(@PathVariable("formId") String formId, @RequestBody FormRespondent formRespondent){
        return formService.insertFormRespondent(formId, formRespondent);
    }

    @GetMapping(path = "/form-respondent/{formId}")
    public String getFormRespondentByUserId(@PathVariable("formId") String formId, @RequestBody String userId){
        return formService.getFormRespondentByUserId(formId, userId);
    }

    // Form Item Response
    
    @PostMapping(path = "/insert-response/{formRespondentId}")
    public int insertFormItemResponse(@JsonProperty("formRespondentId") formRespondentId, @RequestBody FormItemResponse formItemResponse){
        return formService.insertFormItemResponse(formRespondentId, formItemResponse);
    }

    @PutMapping(path ="/update-response/{formRespondentId}")
    public int updateFormItemResponse(@JsonProperty("formRespondentId") formRespondentId, @RequestBody FormItemResponse formItemResponse){
        return formService.updateFormItemResponse(formRespondentId, formItemResponse);
    }
}
