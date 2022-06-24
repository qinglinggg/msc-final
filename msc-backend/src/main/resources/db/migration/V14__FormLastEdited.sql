CREATE TABLE FormLastEdited (
    lastEditedId VARCHAR(100) PRIMARY KEY,
    formId VARCHAR(100) REFERENCES Form(formId) ON UPDATE CASCADE ON DELETE CASCADE,
    formAuthorId VARCHAR(100) REFERENCES FormAuthor(formAuthorId) ON UPDATE CASCADE ON DELETE CASCADE,
    modifyDate BIGINT NOT NULL
)