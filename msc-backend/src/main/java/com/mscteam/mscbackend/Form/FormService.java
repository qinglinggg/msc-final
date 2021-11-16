package com.mscteam.mscbackend.Form;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FormService {
    
    private FormDAO formDAO;

    @Autowired
    public FormService(FormDAO formDAO){
        this.formDAO = formDAO;
    }

    public List<Form> getAllForms(){
        return formDAO.getAllForms();
    }

    public Optional<Form> getFormById(String id){
        return formDAO.getFormById(id);
    }

    public int insertForm(Form form){
        return formDAO.insertForm(form);
    }

    public int removeForm(String id){
        return formDAO.removeForm(id);
    }

    public int updateForm(String id, Form toBeUpdated){
        return formDAO.updateForm(id, toBeUpdated);
    }
}
