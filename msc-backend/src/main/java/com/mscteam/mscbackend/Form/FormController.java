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
    public FormController(FormService formService){
        this.formService = formService;
    }

    @GetMapping
    public List<Form> getAllForms() {
        return formService.getAllForms();
    }

    @GetMapping(path="/{id}")
    public Optional<Form> getFormById(@PathVariable("id") String id){
        return formService.getFormById(id);
    }

    @PostMapping(path="/insert", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Form insertForm(@RequestBody Form form){
        return formService.insertForm(form);
    }

    @DeleteMapping(path="/{id}")
    public int removeForm(@PathVariable("id") String id){
        return formService.removeForm(id);
    }

    @PutMapping(path="/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public int updateForm(@PathVariable("id") String id, @RequestBody Form toBeUpdated){
        return formService.updateForm(id, toBeUpdated);
    }

    @PostMapping(path="/add-form-items/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public FormItems addFormItem(@PathVariable("id") String id, @RequestBody FormItems item){
        return formService.addFormItems(id, item);
    }

    @GetMapping(path="/get-form-items/{id}")
    public List<FormItems> getFormItems(String formId){
        return formService.getFormItems(formId);
    }
    
    @PostMapping(path="/add-answer-selection/{formItems-id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public FormAnswerSelection addAnswerSelection(String formItemsId, @RequestBody FormAnswerSelection answerSelection){
        return formService.addAnswerSelection(formItemsId, answerSelection);
    }

    @GetMapping(path="/get-answer-selection/{formItems-id}")
    public List<FormAnswerSelection> getAnswerSelections(String formItemsId){
        return formService.getAnswerSelection(formItemsId);
    }
}
