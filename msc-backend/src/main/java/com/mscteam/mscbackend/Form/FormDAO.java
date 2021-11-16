package com.mscteam.mscbackend.Form;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class FormDAO {
    private final JdbcTemplate jdbcTemplate;
    SimpleDateFormat date = new SimpleDateFormat("YYYY-MM-dd hh:mm:ss");

    @Autowired
    public FormDAO(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Form> getAllForms(){
        final String query = "SELECT * FROM Form";
        List<Form> formList = jdbcTemplate.query(query, (resultSet, i) -> {
            String formId = resultSet.getString("formId");
            String title = resultSet.getString("title");
            String description = resultSet.getString("description");
            String privacySetting = resultSet.getString("privacySetting");
            Date createDate = null;
            Date modifyDate = null;
            try{
                createDate = date.parse(resultSet.getString("createDate"));
                modifyDate = date.parse(resultSet.getString("modifyDate"));
            }catch(Exception e){
                e.printStackTrace();
            }
            return new Form(formId, title, description, privacySetting, createDate, modifyDate);
        });
        return formList;
    }

    public Optional<Form> getFormById(String id){
        final String query = "SELECT * FROM Form WHERE formId=?";
        Form form = jdbcTemplate.queryForObject(query, (resultSet, i) -> {
            String formId = resultSet.getString("formId");
            String title = resultSet.getString("title");
            String description = resultSet.getString("description");
            String privacySetting = resultSet.getString("privacySetting");
            Date createDate = null;
            Date modifyDate = null;
            try{
                createDate = date.parse(resultSet.getString("createDate"));
                modifyDate = date.parse(resultSet.getString("modifyDate"));
            } catch(Exception e){
                e.printStackTrace();
            }
            return new Form(formId, title, description, privacySetting, createDate, modifyDate);
        }, id);
        return Optional.ofNullable(form);
    }

    public int insertForm(Form form){
        final String query = "INSERT INTO Form VALUES (?,?,?,?,?,?)";
        int res = jdbcTemplate.update(query, form.getFormId().toString(), form.getTitle(), form.getDescription(), form.getPrivacySetting(), date.format(form.getCreateDate()), form.getModifyDate());
        return res;
    }

    public int removeForm(String id){
        final String query = "DELETE FROM Form WHERE formId=?";
        int res = jdbcTemplate.update(query, id);
        return res;
    }

    public int updateForm(String id, Form toBeUpdated){
        String query = "UPDATE Form SET";
        boolean firstCheck = false;
        toBeUpdated.setModifyDate();
        if (toBeUpdated.getTitle() != "" && toBeUpdated.getTitle() != null){
            if(firstCheck == false){
                query += "";
                firstCheck = true;
            } else {
                query += ",";
            }
            query += " title = '" + toBeUpdated.getTitle() + "'";
        }
        if (toBeUpdated.getDescription() != "" && toBeUpdated.getDescription() != null){
            if(firstCheck == false){
                query += "";
                firstCheck = true;
            } else {
                query += ",";
            }
            query += " description = '" + toBeUpdated.getDescription() + "'";
        }
        if (toBeUpdated.getPrivacySetting() != "" && toBeUpdated.getPrivacySetting() != null){
            if(firstCheck == false){
                query += "";
                firstCheck = true;
            } else {
                query += ",";
            }
            query += " privacySetting = '" + toBeUpdated.getPrivacySetting() + "'";
        }
        if (toBeUpdated.getModifyDate() != null){
            if(firstCheck == false){
                query += "";
                firstCheck = true;
            } else {
                query += ",";
            }
            query += " modifyDate = '" + date.format(toBeUpdated.getModifyDate()) + "'";
        }
        query += "WHERE formId = ?";
        int res = jdbcTemplate.update(query, id);
        return res;
    }
}
