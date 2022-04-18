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

    Integer latestNum = 0;
    public int getLastItemNum() {
        latestNum = 0;
        listItems.forEach((fi) -> {
            if(latestNum <= fi.getItemNumber()) {
                latestNum = fi.getItemNumber();
            }
        });
        latestNum = latestNum + 1;
        System.out.println("Latest Number Form Item: " + latestNum);
    }

    public FormItems addFormItems(String id, FormItems item) {
        List<FormItems> listItems = this.getFormItems(id);
        int num = this.getLastItemNum();
        if (num > 1) {
            item.setPrevItem(num-1);
        }
        item.setItemNumber(num);
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

    public FormItems getFormItemById(String itemId) {
        FormItems item = formDAO.getFormItemById(itemId);
        return item;
    }

    public int getNextItem(String itemId) {
        FormItems item = this.getFormItemById(itemId);
        return item.getNextItem();
    }

    public int getPrevItem(String itemId) {
        FormItems item = this.getFormItemById(itemId);
        return item.getPrevItem();
    }

    public int updateFormItems(String formItemsId, FormItems toBeUpdated) {
        return formDAO.updateFormItems(formItemsId, toBeUpdated);
    }

    Integer highestNo = 0;

    public FormAnswerSelection addAnswerSelection(String formItemsId, FormAnswerSelection answerSelection) {
        List<FormAnswerSelection> listAnswers = this.getAnswerSelection(formItemsId);
        highestNo = 0;

        listAnswers.forEach((answer) -> {
            System.out.println(answer);
            if (highestNo < answer.getNo()) {
                System.out.println("answer.getNo() = " + answer.getNo());
                highestNo = answer.getNo();
            }
        });

        return formDAO.addAnswerSelection(formItemsId, highestNo, answerSelection);
    }

    public int updateAnswerSelection(String answerSelectionId, FormAnswerSelection toBeUpdated) {
        return formDAO.updateAnswerSelection(answerSelectionId, toBeUpdated);
    }

    public List<FormAnswerSelection> getAnswerSelection(String formItemsId) {
        List<FormAnswerSelection> listAnswers = formDAO.getAnswerSelection(formItemsId);
        listAnswers.sort((a1, a2) -> a1.getNo() - a2.getNo());
        // listAnswers.forEach((answer) -> System.out.println(answer));
        return listAnswers;
    }

    public int removeAnswerSelection(String answerSelectionId) {
        return formDAO.removeAnswerSelection(answerSelectionId);
    }

    public int removeAllAnswerSelection(String formItemsId) {
        return formDAO.removeAllAnswerSelection(formItemsId);
    }

    public String insertFormRespondent(String formId, FormRespondent formRespondent){
        return formDAO.insertFormRespondent(formId, formRespondent);
    }

    public String getFormRespondentByUserId(String formId, String userId){
        return formDAO.getFormRespondentByUserId(formId, userId);
    }

    public int insertFormItemResponse(String formRespondentId, FormItemResponse formItemResponse){
        return formDAO.insertFormItemResponse(formRespondentId, formItemResponse);
    }

    public int updateFormItemResponse(String formRespondentId, FormItemResponse formItemResponse){
        return formDAO.updateFormItemResponse(formRespondentId, formItemResponse);
    }

}