package com.mscteam.mscbackend.Form;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FormService {

    private FormDAO formDAO;

    @Autowired
    public FormService(FormDAO formDAO) {
        this.formDAO = formDAO;
    }

    public List<Form> getAllForms() {
        return formDAO.getAllForms();
    }

    public Optional<Form> getFormById(String id) {
        return formDAO.getFormById(id);
    }

    public Form insertForm(Form form) {
        return formDAO.insertForm(form);
    }

    public int removeForm(String id) {
        return formDAO.removeForm(id);
    }

    public int updateForm(String id, Form toBeUpdated) {
        return formDAO.updateForm(id, toBeUpdated);
    }

    public FormItems addFormItems(String id, FormItems item) {
        return formDAO.addFormItems(id, item);
    }

    public int removeFormItems(String formItemsId) {
        return formDAO.removeFormItems(formItemsId);
    }

    public List<FormItems> getFormItems(String formId) {
        List<FormItems> listItems = formDAO.getFormItems(formId);
        // TODO merge and sort form items..
        Collections.sort(listItems);
        return listItems;
    }

    // public FormItems getFormItemsById(String formItemsId){
    //     return formDAO.getFormItemsById(formItemsId);
    // }

    public int updateFormItems(String formItemsId, FormItems toBeUpdated) {
        // if(!toBeUpdated.getType().isEmpty()){
        //     List<FormItems> listItems = formDAO.getFormItems(toBeUpdated.getFormId().toString());
        //     listItems.forEach(items -> {
        //         if(items.getId() == toBeUpdated.getId()){
        //             int res = this.removeAllAnswerSelection(toBeUpdated.getId().toString());
        //             if(res == 1) System.out.println("Successfully remove all answer selection");
        //         } 
        //     });
        // }
        return formDAO.updateFormItems(formItemsId, toBeUpdated);
    }

    Integer highestNo = 0;

    public FormAnswerSelection addAnswerSelection(String formItemsId, FormAnswerSelection answerSelection) {
        
        // FormItems formItem = this.getFormItemsById(formItemsId);
    
        // if(formItem.getType() == "LS"){
        //     return formDAO.addAnswerSelection(formItemsId, 0, answerSelection);
        // } else {
            List<FormAnswerSelection> listAnswers = this.getAnswerSelection(formItemsId);
            highestNo = 0;
    
            listAnswers.forEach((answer) -> {
                System.out.println(answer);
                if(highestNo < answer.getNo()){
                    System.out.println("answer.getNo() = " + answer.getNo());
                    highestNo = answer.getNo();
                }
            });
    
            return formDAO.addAnswerSelection(formItemsId, highestNo, answerSelection);
        // }

    }

    public int updateAnswerSelection(String answerSelectionId, FormAnswerSelection toBeUpdated) {
        return formDAO.updateAnswerSelection(answerSelectionId, toBeUpdated);
    }

    Integer idx = 0;
    public int updateAllAnswerSelectionLabel(String formItemsId, Integer numberOfItems) {
        List<FormAnswerSelection> answerSelections = this.getAnswerSelection(formItemsId);
        
        Integer result[] = new Integer[20];
        idx = 0;
        answerSelections.forEach((answer) -> {
            System.out.println("AnswerSelection data:");
            System.out.println("id: " + answer.getId().toString() + ", no: " + answer.getNo().toString() + ", label: " + answer.getLabel().toString());
            idx++;
            Integer res = formDAO.updateAnswerSelectionLabel(answer.getId().toString(), idx);
            result[idx-1] = res;
        });
        return 1;
    }

    public List<FormAnswerSelection> getAnswerSelection(String formItemsId) {
        List<FormAnswerSelection> listAnswers = formDAO.getAnswerSelection(formItemsId);
        // Collections.sort(listAnswers);
        listAnswers.sort((a1, a2) -> a1.getNo() - a2.getNo());
        listAnswers.forEach((answer) -> System.out.println(answer));
        return listAnswers;
    }

    public int removeAnswerSelection(String answerSelectionId){
        return formDAO.removeAnswerSelection(answerSelectionId);
    }

    public int removeAllAnswerSelection(String formItemsId){
        return formDAO.removeAllAnswerSelection(formItemsId);
    }
}