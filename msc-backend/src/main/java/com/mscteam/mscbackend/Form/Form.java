package com.mscteam.mscbackend.Form;

import java.util.Date;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Form {
    private UUID formId;
    private String title;
    private String description;
    private String privacySetting;
    private Date createDate;
    private Date modifyDate;
    private String backgroundLink;
    private String backgroundColor;

    // Get Forms
    public Form(String formId, String title, String description, String privacySetting, Date createDate, Date modifyDate) {
        this.formId = UUID.fromString(formId);
        this.title = title;
        this.description = description;
        this.privacySetting = privacySetting;
        this.createDate = createDate;
        this.modifyDate = modifyDate;
        this.backgroundLink = "";
        this.backgroundColor = "";
    }

    // Create and Insert mode
    public Form(@JsonProperty("title") String title, @JsonProperty("description") String description, @JsonProperty("privacySetting") String privacySetting,
    @JsonProperty("backgroundLink") String backgroundLink, @JsonProperty("backgroundColor") String backgroundColor){
        this.formId = UUID.randomUUID();
        this.title = title;
        this.description = description;
        this.privacySetting = privacySetting;
        this.setCreateDate();
        this.modifyDate = null;
        this.backgroundLink = backgroundLink;
        this.backgroundColor = backgroundColor;
    }

    public UUID getFormId(){
        return formId;
    }

    public String getTitle(){
        return title;
    }

    public String getDescription(){
        return description;
    }

    public void setTitle(String title){
        this.title = title;
    }

    public void setDescription(String description){
        this.description = description;
    }
    
    public String getPrivacySetting(){
        return this.privacySetting;
    }

    public void setPrivacySetting(String privacySetting){
        this.privacySetting = privacySetting;
    }    

    public Date getCreateDate(){
        return this.createDate;
    }

    private void setCreateDate(){
        Date date = new Date();
        this.createDate = date;
    }

    public Date getModifyDate(){
        return this.modifyDate;
    }

    public void setModifyDate(){
        Date date = new Date();
        this.modifyDate = date;
    }

    public String getBackgroundLink(){
        return this.backgroundLink;
    }

    public void setBackgroundLink(String backgroundLink){
        this.backgroundLink = backgroundLink;
    }

    public String getBackgroundColor(){
        return this.backgroundColor;
    }

    public void setBackgroundColor(String color){
        this.backgroundColor = color;
    }
}