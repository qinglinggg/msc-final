package com.mscteam.mscbackend.Form;

import java.text.SimpleDateFormat;
import java.util.Date;
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
            String title = resultSet.getString("title");
            String description = resultSet.getString("description");
            String privacySetting = resultSet.getString("privacySetting");
            Date createDate = null;
            Date modifyDate = null;
            try {
                createDate = dateFormat.parse(resultSet.getString("createDate"));
                modifyDate = dateFormat.parse(resultSet.getString("modifyDate"));
            } catch (Exception e) {
                System.out.println("[GET] Form with ID: " + formId + " has been processed.");
            }
            return new Form(formId, title, description, privacySetting, createDate, modifyDate);
        });
        return formList;
    }

    public Optional<Form> getFormById(String id) {
        final String query = "SELECT * FROM Form WHERE formId=?";
        Form form = jdbcTemplate.queryForObject(query, (resultSet, i) -> {
            String formId = resultSet.getString("formId");
            String title = resultSet.getString("title");
            String description = resultSet.getString("description");
            String privacySetting = resultSet.getString("privacySetting");
            Date createDate = null;
            Date modifyDate = null;
            try {
                createDate = dateFormat.parse(resultSet.getString("createDate"));
                modifyDate = dateFormat.parse(resultSet.getString("modifyDate"));
            } catch (Exception e) {
                e.printStackTrace();
            }
            return new Form(formId, title, description, privacySetting, createDate, modifyDate);
        }, id);
        return Optional.ofNullable(form);
    }

    public Form insertForm(Form form) {
        final String query = "INSERT INTO Form VALUES (?,?,?,?,?,?)";
        int res = jdbcTemplate.update(query, form.getFormId().toString(), form.getTitle(), form.getDescription(),
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
        query += "WHERE formId = ?";
        int res = jdbcTemplate.update(query, id);
        return res;
    }

    public FormItems addFormItems(String id, FormItems item) {
        final String query = "INSERT INTO FormItems(formId, formItemsId, itemNumber, questionContent, questionType) VALUES(?,?,?,?,?)";
        int res = jdbcTemplate.update(query, id, item.getId().toString(), item.getItemNumber(), item.getContent(),
                item.getType());
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
            int itemNumber = Integer.parseInt(resultSet.getString("itemNumber"));
            String questionContent = resultSet.getString("questionContent");
            String questionType = resultSet.getString("questionType");
            return new FormItems(UUID.fromString(formId), UUID.fromString(formItemsId), itemNumber, questionContent,
                    questionType);
        }, id);
        System.out.println(formItems);
        return formItems;
    }

    public int removeFormItems(String formItemsId) {
        final String query = "DELETE FROM FormItems WHERE formItemsId=?";
        int res = jdbcTemplate.update(query, formItemsId);
        return res;
    }

    public int updateFormItems(String formItemsId, FormItems toBeUpdated) {
        String query = "UPDATE FormItems SET ";
        Boolean comma = false;
        if (toBeUpdated.getContent() != "" && toBeUpdated.getContent() != null) {
            query = query + "questionContent = '" + toBeUpdated.getContent().toString() + "'";
            comma = true;
        }
        if (toBeUpdated.getType() != "" && toBeUpdated.getType() != null) {
            if (comma == true)
                query = query + ", ";
            query = query + "questionType = '" + toBeUpdated.getType().toString() + "'";
        }
        query = query + " WHERE formItemsId = '" + formItemsId + "'";
        int res = jdbcTemplate.update(query);
        // System.out.println(query);
        return res;
    }

    public FormAnswerSelection addAnswerSelection(String id, Integer answerSelectionNo,
            FormAnswerSelection answerSelection) {
        answerSelection.setNo(answerSelectionNo + 1);
        answerSelection.setLabel("Option " + answerSelection.getNo());
        final String query = "INSERT INTO FormAnswerSelection(formItemsId, answerSelectionId, answerSelectionNo, answerSelectionLabel, answerSelectionValue) VALUES(?,?,?,?,?)";
        int res = jdbcTemplate.update(query, id, answerSelection.getId().toString(), answerSelection.getNo(),
                answerSelection.getLabel(),
                answerSelection.getValue());
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
        final String query = "UPDATE FormAnswerSelection SET answerSelectionValue = ? WHERE answerSelectionId = ?";
        int res = jdbcTemplate.update(query, toBeUpdated.getValue().toString(), answerSelectionId);
        // System.out.println(query);
        return res;
    }

    public int updateAnswerSelectionLabel(String answerSelectionId, Integer index) {
        Integer answerSelectionNo = index;
        String answerSelectionLabel = "Label " + index;

        final String query = "UPDATE FormAnswerSelection SET answerSelectionNo = ?, answerSelectionLabel = ? WHERE answerSelectionId = ?";
        int res = jdbcTemplate.update(query, answerSelectionNo, answerSelectionLabel, answerSelectionId);

        // System.out.println("id: " + answerSelectionId + ", no: " + answerSelectionNo
        // + ", label: " + answerSelectionLabel);
        // System.out.println(res);
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
            return new FormAnswerSelection(UUID.fromString(formItemsId), UUID.fromString(answerSelectionId),
                    answerSelectionNo,
                    answerSelectionLabel, answerSelectionValue);
        }, id);
        return formAnswerSelections;
    }

    public String insertFormRespondent(String formId, FormRespondent formRespondent){
        final String query = "INSERT INTO FormRespondent (formRespondentId, formId, userId, submitDate) VALUES (?,?,?,?)";
        int res = jdbcTemplate.update(formRespondent.getFormRespondentId().toString(), formId, formRespondent.getUserId().toString(), dateFormat.format(formRespondent.getSubmitDate()));
        return formRespondent.getFormRespondentId().toString();
    }

    public String getFormRespondentByUserId(String formId, String userId){
        final String query = "SELECT formRespondentId FROM FormRespondent WHERE formId = ? AND userId = ?";
        String formRespondentId = (String) jdbcTemplate.queryForObject(query, (resultSet, i) -> {
            String resId = resultSet.getString("formRespondentId");
            return resId;
        }, formId, userId);
        return formRespondentId;
    }

    public int insertFormItemResponse(String formRespondentId, FormItemResponse formItemResponse){
        final String query = "INSERT INTO FormItemResponse (formRespondentId, formItemId, formItemResponseId, answerSelectionId, answerSelectionValue) VALUES (?,?,?,?,?)";
        int res = jdbcTemplate.update(formRespondentId, formItemResponse.getFormItemId().toString(), formItemResponse.getFormItemResponseId().toString(), formItemResponse.getAnswerSelectionId().toString(), formItemResponse.getAnswerSelectionValue());
        return res;
    }

    public int updateFormItemResponse(String formRespondentId, FormItemResponse formItemResponse){
        final String query = "UPDATE FormItemResponse SET answerSelectionId = ?, answerSelectionValue = ? WHERE formItemResponseId = ?";
        int res = jdbcTemplate.update(formItemResponse.getAnswerSelectionId().toString(), formItemResponse.getAnswerSelectionValue(), formItemResponse.getFormItemResponseId().toString());
        return res;
    }

}
