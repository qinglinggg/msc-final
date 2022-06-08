CREATE TABLE FormRespondent (
    formRespondentId VARCHAR(100) NOT NULL,
    formId VARCHAR(100) NOT NULL REFERENCES Form(formId) ON UPDATE CASCADE ON DELETE CASCADE,
    userId VARCHAR(100) NOT NULL REFERENCES User(userId) ON UPDATE CASCADE ON DELETE CASCADE,
    submitDate BIGINT,
    isTargeted INT,
    inviteDate BIGINT,
    PRIMARY KEY(formRespondentId, formId)
)