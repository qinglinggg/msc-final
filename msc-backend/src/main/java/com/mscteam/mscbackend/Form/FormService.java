package com.mscteam.mscbackend.Form;

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

    public FormAnswerSelection addAnswerSelection(String formItemsId, FormAnswerSelection answerSelection) {
        return formDAO.addAnswerSelection(formItemsId, answerSelection);
    }

    public int updateAnswerSelection(String formItemsId, FormItems toBeUpdated) {
        return formDAO.updateAnswerSelection(formItemsId, toBeUpdated);
    }

    public List<FormAnswerSelection> getAnswerSelection(String formItemsId) {
        return formDAO.getAnswerSelection(formItemsId);
    }
}