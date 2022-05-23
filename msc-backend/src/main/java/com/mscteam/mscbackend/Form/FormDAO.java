package com.mscteam.mscbackend.Form;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

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
            String authorUserId = resultSet.getString("authorUserId");
            String title = resultSet.getString("title");
            String description = resultSet.getString("description");
            String privacySetting = resultSet.getString("privacySetting");
            Date createDate = null;
            Date modifyDate = null;
            try {
                createDate = dateFormat.parse(resultSet.getString("createDate"));
                modifyDate = dateFormat.parse(resultSet.getString("modifyDate"));
            } catch (Exception e) {
                
            }
            return new Form(formId, authorUserId, title, description, privacySetting, createDate, modifyDate);
        });
        return formList;
    }

    public Optional<Form> getFormById(String id) {
        final String query = "SELECT * FROM Form WHERE formId=?";
        Form form = jdbcTemplate.queryForObject(query, (resultSet, i) -> {
            String formId = resultSet.getString("formId");
            String authorUserId = resultSet.getString("authorUserId");
            String title = resultSet.getString("title");
            String description = resultSet.getString("description");
            String privacySetting = resultSet.getString("privacySetting");
            Date createDate = null;
            Date modifyDate = null;
            try {
                createDate = dateFormat.parse(resultSet.getString("createDate"));
                modifyDate = dateFormat.parse(resultSet.getString("modifyDate"));
            } catch (Exception e) {
                
            }
            return new Form(formId, authorUserId, title, description, privacySetting, createDate, modifyDate);
        }, id);
        return Optional.ofNullable(form);
    }

    public Form insertForm(Form form) {
        final String query = "INSERT INTO Form VALUES (?,?,?,?,?,?,?)";
        int res = jdbcTemplate.update(query, form.getFormId().toString(), form.getAuthorUserId().toString(), form.getTitle(), form.getDescription(),
                form.getPrivacySetting(), dateFormat.format(form.getCreateDate()), form.getModifyDate());
        return form;
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
            query += " modifyDate = '" + dateFormat.format(toBeUpdated.getModifyDate()) + "'";
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
        query += "WHERE formId = ?";
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
        final String query = "SELECT * FROM FormItems WHERE formId=?";
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
    
    public List<HashMap<String, String>> getItemResponseByUserId(String formId, String userId){
        final String query = "SELECT formItemsId, answerSelectionValue FROM FormRespondent JOIN FormItemResponse USING (formRespondentId) WHERE formId = ? and userId = ?";
        List<HashMap<String, String>> itemResponse = jdbcTemplate.query(query, (resultSet, i) -> {
            HashMap<String, String> results = new HashMap<>();
            while(resultSet.next()) {
                results.put(resultSet.getString("formItemsId"), resultSet.getString("answerSelectionValue"));
            }
            return results;
        }, formId, userId);
        return itemResponse;
    }

    public int removeFormItems(String formItemsId) {
        final String query = "DELETE FROM FormItems WHERE formItemsId=?";
        int res = jdbcTemplate.update(query, formItemsId);
        return res;
    }

    public int updateFormItems(String formItemsId, FormItems toBeUpdated) {
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
        int res = jdbcTemplate.update(query, formRespondent.getFormRespondentId().toString(), formId, formRespondent.getUserId().toString(), dateFormat.format(formRespondent.getSubmitDate()), formRespondent.getIsTargeted());
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

    public List<String> getAllRespondents(String formId){
        final String query = "SELECT userId FROM FormRespondent WHERE formId = ?";
        List<String> userlist = jdbcTemplate.query(query, (resultSet, i) -> {
            String userId = resultSet.getString("userId");
            return userId;
        }, formId);
        return userlist;
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

    public List<Form> getAuthoredForms(String userId){
        final String query = "SELECT * FROM Form WHERE authorUserId = ?";
        List<Form> authoredForms = jdbcTemplate.query(query, (resultSet, i) -> {
            String formId = resultSet.getString("formId");
            String authorUserId = resultSet.getString("authorUserId");
            String title = resultSet.getString("title");
            String description = resultSet.getString("description");
            String privacySetting = resultSet.getString("privacySetting");
            Date createDate = null;
            Date modifyDate = null;
            try {
                createDate = dateFormat.parse(resultSet.getString("createDate"));
                modifyDate = dateFormat.parse(resultSet.getString("modifyDate"));
            } catch (Exception e) {
                
            }
            System.out.println("Checking: " + title);
            return new Form(formId, authorUserId, title, description, privacySetting, createDate, modifyDate);
        }, userId);

        return authoredForms;
    }

    public List<FormRespondent> getFormTargetedUserList(String formId){
        final String query = "SELECT * FROM FormRespondent WHERE formId = ? AND isTargeted = 1 ORDER BY inviteDate ASC";
        List<FormRespondent> formTargetedUserList = jdbcTemplate.query(query, (resultSet, i) -> {
            String formRespondentId = resultSet.getString("formRespondentId");
            String userId = resultSet.getString("userId");
            Date submitDate = null;
            try {
                submitDate = dateFormat.parse(resultSet.getString("submitDate"));
            } catch (Exception e) {
                System.out.println("dateFormat.parse is failed");
            }
            Integer isTargeted = resultSet.getInt("isTargeted");
            Long inviteDate = resultSet.getLong("inviteDate");
            return new FormRespondent(formRespondentId, formId, userId, submitDate, isTargeted, inviteDate);
        }, formId);

        return formTargetedUserList;
    }

    public List<FormRespondent> getInvitedFormRespondent(String userId){
        final String query = "SELECT * FROM FormRespondent WHERE userId = ? AND isTargeted = 1";
        List<FormRespondent> invitedFormList = jdbcTemplate.query(query, (resultSet, i) -> {
            String formRespondentId = resultSet.getString("formRespondentId");
            String formId = resultSet.getString("formId");
            Date submitDate = null;
            try {
                submitDate = dateFormat.parse(resultSet.getString("submitDate"));
            } catch (Exception e) {
                System.out.println("dateFormat.parse is failed");
            }
            Integer isTargeted = resultSet.getInt("isTargeted");
            Long inviteDate = resultSet.getLong("inviteDate");
            return new FormRespondent(formRespondentId, formId, userId, submitDate, isTargeted, inviteDate); 
        }, userId);

        return invitedFormList;
    }

    public int insertTargetedUser(String formId, String userId){
        System.out.println("masuk insertTargetedUser");
        FormRespondent targetedUser = new FormRespondent(formId, userId, 1);
        Date submitDate = targetedUser.getSubmitDate();
        String resultDate = "";
        if(submitDate != null) resultDate = dateFormat.format(targetedUser.getSubmitDate());
        else resultDate = null;
        final String query = "INSERT INTO FormRespondent VALUES (?,?,?,?,?,?)";
        // String inviteDateQuery = "TO_TIMESTAMP('" + targetedUser.inviteDateToTimestamp() + "', 'YYYY-MM-DD HH:MM:SS.FFF')";
        int res = jdbcTemplate.update(query, targetedUser.getFormRespondentId().toString(), targetedUser.getFormId().toString(), targetedUser.getUserId().toString(), resultDate, targetedUser.getIsTargeted(), targetedUser.getInviteDate());
        return res;
    }

    public int deleteTargetedUser(String formRespondentId, FormRespondent targetedUser){
        String query = "";
        if(targetedUser.getSubmitDate() == null) {
            query = "DELETE FROM FormRespondent WHERE formRespondentId = ? AND submitDate IS NULL";
        } else {
            query = "UPDATE FormRespondent SET isTargeted = 0, invitedDate = 0 WHERE formRespondentId = ?";
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

}
