CREATE TABLE FormTargetedUser (
    formTargetedUserId VARCHAR(100) NOT NULL,
    formRespondentId VARCHAR(100) NOT NULL,
    CONSTRAINT formTargetedUserPK PRIMARY KEY (formTargetedUserId),
    CONSTRAINT formTargetedUserFK FOREIGN KEY (formRespondentId) REFERENCES FormRespondent(formRespondentId) 
        ON UPDATE CASCADE ON DELETE CASCADE
)