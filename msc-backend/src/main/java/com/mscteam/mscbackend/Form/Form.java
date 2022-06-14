package com.mscteam.mscbackend.Form;

import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Form implements Comparable<Form> {
    private UUID formId;
    private String title;
    private String description;
    private String privacySetting;
    private Long createDate;
    private Long modifyDate;
    private String backgroundLink;
    private String backgroundColor;

    // Get Forms
    public Form(String formId, String title, String description, String privacySetting, Long createDate, Long modifyDate, String backgroundColor, String backgroundLink) {
        this.formId = UUID.fromString(formId);
        this.title = title;
        this.description = description;
        this.privacySetting = privacySetting;
        this.createDate = createDate;
        this.modifyDate = modifyDate;
        this.backgroundLink = backgroundLink;
        this.backgroundColor = backgroundColor;
    }

    // Create and Insert mode
    public Form(@JsonProperty("title") String title, @JsonProperty("description") String description, @JsonProperty("privacySetting") String privacySetting){
        this.formId = UUID.randomUUID();
        this.title = title;
        this.description = description;
        this.privacySetting = privacySetting;
        this.createDate = System.currentTimeMillis();
        this.modifyDate = System.currentTimeMillis();
        this.backgroundLink = "";
        this.backgroundColor = "";
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

    public Long getCreateDate(){
        return this.createDate;
    }

    public Long getModifyDate(){
        return this.modifyDate;
    }

    public void setModifyDate(){
        this.modifyDate = System.currentTimeMillis();
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

    @Override
    public int compareTo(Form o) {
        return o.getModifyDate().compareTo(this.getModifyDate());
    }
}