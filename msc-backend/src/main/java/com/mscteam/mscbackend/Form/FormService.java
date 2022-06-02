package com.mscteam.mscbackend.Form;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.mscteam.mscbackend.UserProfile.UserProfileDAO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FormService {
    private FormDAO formDAO;
    private UserProfileDAO userProfileDAO;

    @Autowired
    public FormService(FormDAO formDAO, UserProfileDAO userProfileDAO) {
        this.formDAO = formDAO;
        this.userProfileDAO = userProfileDAO;
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
        int res = this.updateModifyDate(id, 0);
        return formDAO.updateForm(id, toBeUpdated);
    }

    Integer latestNum = 0;
    public int getLastItemNum(List<FormItems> listItems) {
        latestNum = 0;
        listItems.forEach((fi) -> {
            if(latestNum <= fi.getItemNumber()) {
                latestNum = fi.getItemNumber();
            }
        });
        latestNum = latestNum + 1;
        System.out.println("Latest Number Form Item: " + latestNum);
        return latestNum;
    }

    public FormItems addFormItems(String id, FormItems item) {
        int res = this.updateModifyDate(id, 0);

        List<FormItems> listItems = this.getFormItems(id);
        int num = this.getLastItemNum(listItems);
        item.setItemNumber(num);
        return formDAO.addFormItems(id, item);
    }

    public int removeFormItems(String formItemsId) {
        int res = this.updateModifyDate(formItemsId, 1);
        return formDAO.removeFormItems(formItemsId);
    }

    public List<FormItems> getFormItems(String formId) {
        List<FormItems> listItems = formDAO.getFormItems(formId);
        Collections.sort(listItems);
        return listItems;
    }

    public FormItems getFormItemById(String itemId) {
        FormItems item = formDAO.getFormItemById(itemId);
        return item;
    }

    public int updateFormItems(String formItemsId, FormItems toBeUpdated) {
        String formId = toBeUpdated.getFormId().toString();
        int res = this.updateModifyDate(formId, 0);
        return formDAO.updateFormItems(formItemsId, toBeUpdated);
    }

    Integer highestNo = 0;

    public FormAnswerSelection addAnswerSelection(String formItemsId, FormAnswerSelection answerSelection) {
        int res = this.updateModifyDate(formItemsId, 1);
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
        int res = this.updateModifyDate(answerSelectionId, 2);
        return formDAO.updateAnswerSelection(answerSelectionId, toBeUpdated);
    }

    public List<FormAnswerSelection> getAnswerSelection(String formItemsId) {
        List<FormAnswerSelection> listAnswers = formDAO.getAnswerSelection(formItemsId);
        listAnswers.sort((a1, a2) -> a1.getNo() - a2.getNo());
        return listAnswers;
    }

    public int removeAnswerSelection(String answerSelectionId) {
        int res = this.updateModifyDate(answerSelectionId, 2);
        return formDAO.removeAnswerSelection(answerSelectionId);
    }

    public int removeAllAnswerSelection(String formItemsId) {
        int res = this.updateModifyDate(formItemsId, 1);
        return formDAO.removeAllAnswerSelection(formItemsId);
    }

    public String insertFormRespondent(String formId, FormRespondent formRespondent){
        return formDAO.insertFormRespondent(formId, formRespondent);
    }

    public List<String> getFormRespondentByUserId(String formId, String userId){
        return formDAO.getFormRespondentByUserId(formId, userId);
    }

    public List<String> getAllFormRespondent(String formId){
        return formDAO.getAllFormRespondent(formId);
    } 

    public int insertFormItemResponse(String formRespondentId, FormItemResponse formItemResponse){
        return formDAO.insertFormItemResponse(formRespondentId, formItemResponse);
    }
    
    public List<FormItemResponse> getFormItemResponse(String formItemId) {
        return formDAO.getFormItemResponse(formItemId);
    }

    public HashMap<String, HashMap<String, String>> getResponsesById(String formRespondentId){
        return formDAO.getResponsesById(formRespondentId);
    }

    public int updateFormItemResponse(String formRespondentId, FormItemResponse formItemResponse){
        return formDAO.updateFormItemResponse(formRespondentId, formItemResponse);
    }

    public List<Form> getAuthoredForms(String userId){
        return formDAO.getAuthoredForms(userId);
    }

    public List<FormRespondent> getInvitedFormRespondent(String userId){
        return formDAO.getInvitedFormRespondent(userId);
    }

    public List<Form> getInvitedForms(String userId, List<FormRespondent> invitedData){
        List<Form> invitedFormMetadata = new ArrayList<>();
        for(int i=0; i<invitedData.size(); i++){
            String formId = invitedData.get(i).getFormId().toString();
            Optional<Form> form = formDAO.getFormById(formId);
            if(form.isPresent()) invitedFormMetadata.add(form.get());
        }
        return invitedFormMetadata;
    }

    public List<FormRespondent> getFormTargetedUserList(String formId){
        return formDAO.getFormTargetedUserList(formId);
    }

    public int insertTargetedUser(String formId, String userEmail){
        // Get User Email
        int res = this.updateModifyDate(formId, 0);
        List<String> userId = userProfileDAO.getUserByEmail(userEmail);
        if(userId.size() > 0){
            String resUserId = userId.get(0);
            System.out.println("userEmail " + userEmail + " with resId = " + resUserId);
            // check if user already invited
            List<String> formRespondentId = formDAO.getFormRespondentByInvitedUserId(formId, resUserId);
            if(formRespondentId.size() > 0){
                String resRespondentId = formRespondentId.get(0);
                System.out.println("formRespondentId is not null, the value is " + resRespondentId);
                return -1;
            }
            System.out.println("formRespondentId is null");
            return formDAO.insertTargetedUser(formId, resUserId);
        } 
        return -1;
    }

    public int deleteTargetedUser(String formRespondentId, FormRespondent targetedUser){
        String formId = targetedUser.getFormId().toString();
        int res = this.updateModifyDate(formId, 0);
        return formDAO.deleteTargetedUser(formRespondentId, targetedUser);
    }

    public int forceDeleteFormRespondent(String formId, String userId){
        return formDAO.forceDeleteFormRespondent(formId, userId);
    }

    public int updateModifyDate(String givenId, int steps){
        String resId = givenId;
        Integer res = -1;
        while(steps >= 0){
            if(steps == 0){
                // formId
                Integer updated = formDAO.updateModifyDate(resId);
                System.out.println("form modify date is updated with res: " + updated);
                res = 0;
            } else if(steps == 1){
                // formItemsId, formId = ?
                resId = formDAO.getFormIdByFormItemsId(resId);
            } else if(steps == 2){
                // answerId, formItemsId = ?, formId = ?
                resId = formDAO.getFormItemsIdByAnswerId(resId);
            }
            steps--;
        }
        return res;
    }


}
