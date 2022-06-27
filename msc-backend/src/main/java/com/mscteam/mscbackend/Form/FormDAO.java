package com.mscteam.mscbackend.Form;

import java.sql.ResultSet;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import javax.naming.spi.DirStateFactory.Result;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class FormDAO {
    private final JdbcTemplate jdbcTemplate;
    private SimpleDateFormat dateFormat = new SimpleDateFormat("YYYY-MM-dd hh:mm:ss");

    @Autowired
    public FormDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Form> getAllForms() {
        final String query = "SELECT * FROM Form";
        List<Form> formList = jdbcTemplate.query(query, (resultSet, i) -> {
            String formId = resultSet.getString("formId");
            String title = resultSet.getString("title");
            String description = resultSet.getString("description");
            String privacySetting = resultSet.getString("privacySetting");
            String backgroundColor = resultSet.getString("backgroundColor");
            String backgroundLink = resultSet.getString("backgroundLink");
            Long createDate = resultSet.getLong("createDate");
            Long modifyDate = resultSet.getLong("modifyDate");
            return new Form(formId, title, description, privacySetting, createDate, modifyDate, backgroundColor, backgroundLink);
        });
        return formList;
    }

    public Optional<Form> getFormById(String id) {
        final String query = "SELECT * FROM Form WHERE formId=?";
        List<Form> form = jdbcTemplate.query(query, (resultSet, i) -> {
            String formId = resultSet.getString("formId");
            String title = resultSet.getString("title");
            String description = resultSet.getString("description");
            String privacySetting = resultSet.getString("privacySetting");
            String backgroundColor = resultSet.getString("backgroundColor");
            String backgroundLink = resultSet.getString("backgroundLink");
            Long createDate = resultSet.getLong("createDate");
            Long modifyDate = resultSet.getLong("modifyDate");
            return new Form(formId, title, description, privacySetting, createDate, modifyDate, backgroundColor, backgroundLink);
        }, id);
        if(form.isEmpty()) return Optional.ofNullable(null);
        return Optional.ofNullable(form.get(0));
    }

    public Form insertForm(Form form) {
        final String query = "INSERT INTO Form VALUES (?,?,?,?,?,?,?,?)";
        int res = jdbcTemplate.update(query, form.getFormId().toString(), form.getTitle(), form.getDescription(),
                form.getPrivacySetting(), form.getCreateDate(), form.getModifyDate(), form.getBackgroundColor(), form.getBackgroundLink());
        return form;
    }

    public FormAuthor insertFormAuthor(FormAuthor formAuthor){
        final String query = "INSERT INTO FormAuthor VALUES (?,?,?,?)";
        int res = jdbcTemplate.update(query, formAuthor.getFormAuthorId().toString(), formAuthor.getFormId().toString(), formAuthor.getUserId().toString(), formAuthor.getInviteDate());
        return formAuthor;
    }

    public int deleteFormAuthor(String formId, String userId){
        final String query = "DELETE FROM FormAuthor WHERE formId = ? AND userId = ?";
        int res = jdbcTemplate.update(query, formId, userId);
        return res;
    }

    public int removeForm(String id) {
        final String query = "DELETE FROM Form WHERE formId=?";
        int res = jdbcTemplate.update(query, id);
        return res;
    }

    public int updateForm(String id, Form toBeUpdated) {
        String query = "UPDATE Form SET";
        boolean firstCheck = false;
        toBeUpdated.setModifyDate();
        if (toBeUpdated.getTitle() != "" && toBeUpdated.getTitle() != null) {
            if (firstCheck == false) {
                query += "";
                firstCheck = true;
            } else {
                query += ",";
            }
            query += " title = '" + toBeUpdated.getTitle() + "'";
        }
        if (toBeUpdated.getDescription() != "" && toBeUpdated.getDescription() != null) {
            if (firstCheck == false) {
                query += "";
                firstCheck = true;
            } else {
                query += ",";
            }
            query += " description = '" + toBeUpdated.getDescription() + "'";
        }
        if (toBeUpdated.getPrivacySetting() != "" && toBeUpdated.getPrivacySetting() != null) {
            if (firstCheck == false) {
                query += "";
                firstCheck = true;
            } else {
                query += ",";
            }
            query += " privacySetting = '" + toBeUpdated.getPrivacySetting() + "'";
        }
        if (toBeUpdated.getModifyDate() != null) {
            if (firstCheck == false) {
                query += "";
                firstCheck = true;
            } else {
                query += ",";
            }
            query += " modifyDate = " + toBeUpdated.getModifyDate();
        }
        if(toBeUpdated.getBackgroundColor() != "" && toBeUpdated.getBackgroundColor() != null){
            if (firstCheck == false) {
                query += "";
                firstCheck = true;
            } else {
                query += ",";
            }
            query += " backgroundColor = '" + toBeUpdated.getBackgroundColor() + "'";
        }
        if(toBeUpdated.getBackgroundLink() != "" && toBeUpdated.getBackgroundLink() != null){
            if (firstCheck == false) {
                query += "";
                firstCheck = true;
            } else {
                query += ",";
            }
            query += " backgroundLink = '" + toBeUpdated.getBackgroundLink() + "'";
        }
        query += " WHERE formId = ?";
        System.out.println(query);
        int res = jdbcTemplate.update(query, id);
        return res;
    }

    public FormItems addFormItems(String id, FormItems item) {
        final String query = "INSERT INTO FormItems(formId, formItemsId, itemNumber, questionContent, questionType, isRequired) VALUES(?,?,?,?,?,?)";
        int res = jdbcTemplate.update(query, id, item.getId().toString(), item.getItemNumber(), item.getContent(),
                item.getType(), item.getIsRequired());
        System.out.println(item);
        return item;
    }

    public List<FormItems> getFormItems(String id) {
        final String query = "SELECT * FROM FormItems WHERE formId=? ORDER BY itemNumber ASC";
        System.out.println("Searching for: " + id);
        List<FormItems> formItems = jdbcTemplate.query(query, (resultSet, i) -> {
            System.out.println(query);
            String formId = resultSet.getString("formId");
            String formItemsId = resultSet.getString("formItemsId");
            Integer itemNumber = Integer.parseInt(resultSet.getString("itemNumber"));
            String questionContent = resultSet.getString("questionContent");
            String questionType = resultSet.getString("questionType");
            Integer isRequired = Integer.parseInt(resultSet.getString("isRequired"));
            return new FormItems(UUID.fromString(formId), UUID.fromString(formItemsId), itemNumber, questionContent,
                questionType, isRequired);
        }, id);
        System.out.println(formItems);
        return formItems;
    }

    public FormItems getFormItemById(String id) {
        final String query = "SELECT * FROM FormItems WHERE formItemsId=?";
        FormItems formItem = jdbcTemplate.queryForObject(query, (resultSet, i) -> {
            String formId = resultSet.getString("formId");
            String formItemsId = resultSet.getString("formItemsId");
            int itemNumber = resultSet.getInt("itemNumber");
            String questionContent = resultSet.getString("questionContent");
            String questionType = resultSet.getString("questionType");
            Integer isRequired = Integer.parseInt(resultSet.getString("isRequired"));
            return new FormItems(UUID.fromString(formId), UUID.fromString(formItemsId), itemNumber, questionContent, 
            questionType, isRequired);
        }, id);
        return formItem;
    }

    public List<FormItemResponse> getFormItemResponse(String formItemsId) {
        final String query = "SELECT * FROM FormItemResponse WHERE formItemsId = ?";
        List<FormItemResponse> formItemResponses = jdbcTemplate.query(query, (resultSet, i) -> {
            String formRespondentId = resultSet.getString("formRespondentId");
            String id = resultSet.getString("formItemsId");
            String formItemResponseId = resultSet.getString("formItemResponseId");
            String answerSelectionId = resultSet.getString("answerSelectionId");
            String answerSelectionValue = resultSet.getString("answerSelectionValue");
            return new FormItemResponse(UUID.fromString(formRespondentId), UUID.fromString(formItemsId), UUID.fromString(formItemResponseId), UUID.fromString(answerSelectionId), answerSelectionValue);
        }, formItemsId);
        return formItemResponses;
    }
    
    public HashMap<String, HashMap<String, String>> getResponsesById(String formRespondentId){
        HashMap<String, HashMap<String, String>> results = new HashMap<>();
        final String query = "SELECT answerSelectionId, answerSelectionValue FROM FormItemResponse WHERE formRespondentId = ?";
        jdbcTemplate.query(query, (resultSet, i) -> {
            HashMap<String, String> innerRes = new HashMap<>();
            innerRes.put("answerSelectionValue", resultSet.getString("answerSelectionValue"));
            results.put(resultSet.getString("answerSelectionId"), innerRes);
            return results;
        }, formRespondentId);
        return results;
    }

    public int removeFormItems(String formItemsId) {
        final String query = "DELETE FROM FormItems WHERE formItemsId=?";
        int res = jdbcTemplate.update(query, formItemsId);
        return res;
    }

    public int updateFormItems(String formItemsId, FormItems toBeUpdated) {
        System.out.println("updateFormItems FormDAO masuk");
        String query = "UPDATE FormItems SET ";
        query = query + "questionContent = '" + toBeUpdated.getContent().toString() + "', ";
        if (toBeUpdated.getType() != "" && toBeUpdated.getType() != null) {
            query = query + "questionType = '" + toBeUpdated.getType().toString() + "', ";
        }
        if (toBeUpdated.getIsRequired() != null) {
            query = query + "isRequired = " + toBeUpdated.getIsRequired();
        }
        query = query + " WHERE formItemsId = '" + formItemsId + "'";
        int res = jdbcTemplate.update(query);
        return res;
    }

    public FormAnswerSelection addAnswerSelection(String id, Integer answerSelectionNo,
            FormAnswerSelection answerSelection) {
        answerSelection.setNo(answerSelectionNo + 1);
        answerSelection.setLabel("Option " + answerSelection.getNo());
        final String query = "INSERT INTO FormAnswerSelection(formItemsId, answerSelectionId, answerSelectionNo, answerSelectionLabel, answerSelectionValue, nextItem, prevItem) VALUES(?,?,?,?,?,?,?)";
        int res = jdbcTemplate.update(query, id, answerSelection.getId().toString(), answerSelection.getNo(),
                answerSelection.getLabel(),
                answerSelection.getValue(), answerSelection.getNextItem(), answerSelection.getPrevItem());
        return answerSelection;
    }

    public int removeAnswerSelection(String answerSelectionId) {
        final String query = "DELETE FROM FormAnswerSelection WHERE answerSelectionId=?";
        int res = jdbcTemplate.update(query, answerSelectionId);
        return res;
    }

    public int removeAllAnswerSelection(String formItemsId) {
        final String query = "DELETE FROM FormAnswerSelection WHERE formItemsId=?";
        int res = jdbcTemplate.update(query, formItemsId);
        return res;
    }

    public int updateAnswerSelection(String answerSelectionId, FormAnswerSelection toBeUpdated) {
        String query = "UPDATE FormAnswerSelection SET ";
        query = query + "answerSelectionValue = '" + toBeUpdated.getValue().toString() + "'";
        if(toBeUpdated.getLabel() != null && toBeUpdated.getLabel() != "") query = query + ", answerSelectionLabel = '" + toBeUpdated.getLabel().toString() + "'";
        if(toBeUpdated.getNextItem() > 0) query = query + ", nextItem = " + toBeUpdated.getNextItem();
        if(toBeUpdated.getPrevItem() > 0) query = query + ", prevItem = " + toBeUpdated.getPrevItem();
        query = query + " WHERE answerSelectionId = '" + answerSelectionId + "'";
        int res = jdbcTemplate.update(query);
        return res;
    }

    public int updateAnswerSelectionLabel(String answerSelectionId, Integer index) {
        Integer answerSelectionNo = index;
        String answerSelectionLabel = "Label " + index;
        final String query = "UPDATE FormAnswerSelection SET answerSelectionNo = ?, answerSelectionLabel = ? WHERE answerSelectionId = ?";
        int res = jdbcTemplate.update(query, answerSelectionNo, answerSelectionLabel, answerSelectionId);
        return res;
    }

    public List<FormAnswerSelection> getAnswerSelection(String id) {
        final String query = "SELECT * FROM FormAnswerSelection WHERE formItemsId=?";
        List<FormAnswerSelection> formAnswerSelections = jdbcTemplate.query(query, (resultSet, i) -> {
            String formItemsId = resultSet.getString("formItemsId");
            String answerSelectionId = resultSet.getString("answerSelectionId");
            Integer answerSelectionNo = resultSet.getInt("answerSelectionNo");
            String answerSelectionLabel = resultSet.getString("answerSelectionLabel");
            String answerSelectionValue = resultSet.getString("answerSelectionValue");
            int nextItem = resultSet.getInt("nextItem");
            int prevItem = resultSet.getInt("prevItem");
            return new FormAnswerSelection(UUID.fromString(formItemsId), UUID.fromString(answerSelectionId),
                    answerSelectionNo, answerSelectionLabel, answerSelectionValue, nextItem, prevItem);
        }, id);
        return formAnswerSelections;
    }

    public String insertFormRespondent(String formId, FormRespondent formRespondent){
        final String query = "INSERT INTO FormRespondent (formRespondentId, formId, userId, submitDate, isTargeted) VALUES (?,?,?,?,?)";
        int res = jdbcTemplate.update(query, formRespondent.getFormRespondentId().toString(), formId, formRespondent.getUserId().toString(), formRespondent.getSubmitDate(), formRespondent.getIsTargeted());
        return formRespondent.getFormRespondentId().toString();
    }

    public List<String> getFormRespondentByUserId(String formId, String userId){
        final String query = "SELECT formRespondentId FROM FormRespondent WHERE formId = ? AND userId = ?";
        List<String> formRespondentId = jdbcTemplate.query(query, (resultSet, i) -> {
            String resId = resultSet.getString("formRespondentId");
            return resId;
        }, formId, userId);
        return formRespondentId;
    }

    public List<String> getAllFormRespondent(String formId){
        final String query = "SELECT formRespondentId FROM FormRespondent WHERE formId = ?";
        List<String> list = jdbcTemplate.query(query, (resultSet, i) -> {
            String id = resultSet.getString("formRespondentId");
            return id;
        }, formId);
        return list;
    }

    public List<String> getFormRespondentByInvitedUserId(String formId, String userId){
        final String query = "SELECT formRespondentId FROM FormRespondent WHERE formId = ? AND userId = ? AND isTargeted = 1";
        List<String> formRespondentId = jdbcTemplate.query(query, (resultSet, i) -> {
            String resId = resultSet.getString("formRespondentId");
            return resId;
        }, formId, userId);
        return formRespondentId;
    }

    public int insertFormItemResponse(String formRespondentId, FormItemResponse formItemResponse){
        final String query = "INSERT INTO FormItemResponse (formRespondentId, formItemsId, formItemResponseId, answerSelectionId, answerSelectionValue) VALUES (?,?,?,?,?)";
        int res = jdbcTemplate.update(query, formRespondentId, formItemResponse.getFormItemId().toString(), formItemResponse.getFormItemResponseId().toString(), formItemResponse.getAnswerSelectionId().toString(), formItemResponse.getAnswerSelectionValue());
        return res;
    }

    public int updateFormItemResponse(String formRespondentId, FormItemResponse formItemResponse){
        final String query = "UPDATE FormItemResponse SET answerSelectionId = ?, answerSelectionValue = ? WHERE formItemResponseId = ?";
        int res = jdbcTemplate.update(query, formItemResponse.getAnswerSelectionId().toString(), formItemResponse.getAnswerSelectionValue(), formItemResponse.getFormItemResponseId().toString());
        return res;
    }

    public List<FormAuthor> getAuthoredForms(String userId) {
        final String query = "SELECT * FROM FormAuthor WHERE userId = ?";
        List<FormAuthor> authoredFormsData = jdbcTemplate.query(query, (resultSet, i) -> {
            String formAuthorId = resultSet.getString("formAuthorId");
            String formId = resultSet.getString("formId");
            Long inviteDate = resultSet.getLong("inviteDate");
            return new FormAuthor(formAuthorId, formId, userId, inviteDate);
        }, userId);

        return authoredFormsData;
    }

    public List<FormRespondent> getFormTargetedUserList(String formId){
        final String query = "SELECT * FROM FormRespondent WHERE formId = ? AND isTargeted = 1 ORDER BY inviteDate ASC";
        List<FormRespondent> formTargetedUserList = jdbcTemplate.query(query, (resultSet, i) -> {
            String formRespondentId = resultSet.getString("formRespondentId");
            String userId = resultSet.getString("userId");
            Long submitDate = resultSet.getLong("submitDate");
            Integer isTargeted = resultSet.getInt("isTargeted");
            Long inviteDate = resultSet.getLong("inviteDate");
            return new FormRespondent(formRespondentId, formId, userId, submitDate, isTargeted, inviteDate);
        }, formId);

        return formTargetedUserList;
    }

    public List<FormRespondent> getInvitedFormRespondent(String userId){
        final String query = "SELECT * FROM FormRespondent WHERE userId = ? AND isTargeted = 1 ORDER BY inviteDate DESC";
        List<FormRespondent> invitedFormList = jdbcTemplate.query(query, (resultSet, i) -> {
            String formRespondentId = resultSet.getString("formRespondentId");
            String formId = resultSet.getString("formId");
            Long submitDate = resultSet.getLong("submitDate");
            Integer isTargeted = resultSet.getInt("isTargeted");
            Long inviteDate = resultSet.getLong("inviteDate");
            return new FormRespondent(formRespondentId, formId, userId, submitDate, isTargeted, inviteDate); 
        }, userId);

        return invitedFormList;
    }

    public int insertTargetedUser(String formId, String userId){
        FormRespondent targetedUser = new FormRespondent(formId, userId, 1);
        final String query = "INSERT INTO FormRespondent VALUES (?,?,?,?,?,?)";
        int res = jdbcTemplate.update(query, targetedUser.getFormRespondentId().toString(), targetedUser.getFormId().toString(), targetedUser.getUserId().toString(), targetedUser.getSubmitDate(), targetedUser.getIsTargeted(), targetedUser.getInviteDate());
        return res;
    }

    public int deleteTargetedUser(String formRespondentId, FormRespondent targetedUser){
        String query = "";
        if(targetedUser.getSubmitDate() == 0) {
            query = "DELETE FROM FormRespondent WHERE formRespondentId = ? AND submitDate = 0";
        } else {
            query = "UPDATE FormRespondent SET isTargeted = 0, inviteDate = 0 WHERE formRespondentId = ?";
        }
        int res = jdbcTemplate.update(query, formRespondentId);
        return res;
    }
    // cuma untuk keperluan testing
    public int forceDeleteFormRespondent(String formId, String userId){
        final String query = "DELETE FROM FormRespondent WHERE formId = ? AND userId = ?";
        int res = jdbcTemplate.update(query, formId, userId);
        return res;
    }

    // public int updateModifyDate(String formId){
    //     final String query = "UPDATE Form SET modifyDate = ? WHERE formId = ?";
    //     Long modifyDate = System.currentTimeMillis();
    //     int res = jdbcTemplate.update(query, modifyDate, formId);
    //     return res;
    // }

    public String getFormIdByFormItemsId(String formItemsId){
        final String query = "SELECT formId FROM FormItems WHERE formItemsId = ?";
        String res = jdbcTemplate.queryForObject(query, String.class, formItemsId);
        return res;
    }

    public String getFormItemsIdByAnswerId(String answerSelectionId){
        final String query = "SELECT formItemsId FROM FormAnswerSelection WHERE answerSelectionId = ?";
        String res = jdbcTemplate.queryForObject(query, String.class, answerSelectionId);
        return res;
    }

    public int submitForm(String formRespondentId){
        final String query = "UPDATE FormRespondent SET submitDate = ? WHERE formRespondentId = ?";
        Long submitDate = System.currentTimeMillis();
        int res = jdbcTemplate.update(query, submitDate, formRespondentId);
        return res;
    }

    public List<FormAuthor> isFormAuthorExist(String formId, String userId){
        final String query = "SELECT * FROM FormAuthor WHERE formId = ? AND userId = ?";
        List<FormAuthor> formAuthor = jdbcTemplate.query(query, (resultSet, i) -> {
            String formAuthorId = resultSet.getString("formAuthorId");
            Long inviteDate = resultSet.getLong("inviteDate");
            return new FormAuthor(formAuthorId, formId, userId, inviteDate);
        }, formId, userId);
        return formAuthor;
    }

    public List<FormAuthor> getFormAuthors(String formId){
        final String query = "SELECT * FROM FormAuthor WHERE formId = ? ORDER BY inviteDate ASC";
        List<FormAuthor> formAuthors = jdbcTemplate.query(query, (resultSet, i) -> {
            String formAuthorId = resultSet.getString("formAuthorId");
            String userId = resultSet.getString("userId");
            Long inviteDate = resultSet.getLong("inviteDate");
            return new FormAuthor(formAuthorId, formId, userId, inviteDate);
        }, formId);
        return formAuthors;
    }

    public FormAnswerSelection getAnswerSelectionById(String answerSelectionId) {
        final String query = "SELECT * FROM FormAnswerSelection WHERE answerSelectionId = ?";
        List<FormAnswerSelection> res = jdbcTemplate.query(query, (resultSet, i) -> {
            String formItemsId = resultSet.getString("formItemsId");
            Integer answerSelectionNo = resultSet.getInt("answerSelectionNo");
            String answerSelectionLabel = resultSet.getString("answerSelectionLabel");
            String answerSelectionValue = resultSet.getString("answerSelectionValue");
            Integer prevItem = resultSet.getInt("prevItem");
            Integer nextItem = resultSet.getInt("nextItem");
            return new FormAnswerSelection(UUID.fromString(formItemsId), UUID.fromString(answerSelectionId), answerSelectionNo, answerSelectionLabel, answerSelectionValue, nextItem, prevItem);
        }, answerSelectionId);
        if(res.size() > 0) return res.get(0);
        return null;
    }

    public int createLastEdited(String formId, String formAuthorId){
        FormLastEdited lastEdited = new FormLastEdited(formId, formAuthorId);
        final String query = "INSERT INTO FormLastEdited VALUES (?,?,?,?)";
        int res = jdbcTemplate.update(query, lastEdited.getLastEditedId().toString(), lastEdited.getFormId().toString(), lastEdited.getFormAuthorId().toString(), lastEdited.getModifyDate());
        return res;
    }

    public int updateLastEdited(String formId, FormLastEdited newEdit){
        final String query = "UPDATE FormLastEdited SET modifyDate = ?, formAuthorId = ? WHERE formId = ?";
        Long modifyDate = System.currentTimeMillis();
        int res = jdbcTemplate.update(query, modifyDate, newEdit.getFormAuthorId().toString(), formId);
        return res;
    }

    public FormLastEdited getLastEdited(String formId){
        final String query = "SELECT * FROM FormLastEdited WHERE formId = ?";
        List<FormLastEdited> res = jdbcTemplate.query(query, (resultSet, i) -> {
            String lastEditedId = resultSet.getString("lastEditedId");
            String formAuthorId = resultSet.getString("formAuthorId");
            Long modifyDate = resultSet.getLong("modifyDate");
            return new FormLastEdited(UUID.fromString(lastEditedId), UUID.fromString(formId), UUID.fromString(formAuthorId), modifyDate);
        }, formId);
        if(res.size() > 0) return res.get(0);
        return null;
    }
}
