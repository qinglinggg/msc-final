CREATE TABLE FormTargetedUser (
    formTargetedUserId VARCHAR(100) NOT NULL,
    formRespondentId VARCHAR(100) NOT NULL REFERENCES FormRespondent(formRespondentId)
    ON UPDATE CASCADE ON DELETE CASCADE
)