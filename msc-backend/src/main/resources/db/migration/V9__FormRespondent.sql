CREATE TABLE FormRespondent (
    formRespondentId VARCHAR(100) NOT NULL,
    formId VARCHAR(100) NOT NULL,
    userId VARCHAR(100) NOT NULL,
    submitDate BIGINT,
    isTargeted INT,
    inviteDate BIGINT,
    CONSTRAINT formRespondentPK PRIMARY KEY(formRespondentId),
    CONSTRAINT formRespondentFK FOREIGN KEY (formId) REFERENCES Form(formId)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT formRespondentFK2 FOREIGN KEY (userId) REFERENCES User(userId) 
        ON UPDATE CASCADE ON DELETE CASCADE
)