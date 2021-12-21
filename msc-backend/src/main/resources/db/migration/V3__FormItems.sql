CREATE TABLE FormItems (
    formId VARCHAR(100) NOT NULL
    REFERENCES Form(formId) ON UPDATE CASCADE ON DELETE CASCADE,
    formItemsId VARCHAR(100) NOT NULL,
    questionContent VARCHAR(255) NOT NULL,
    questionType VARCHAR(50) NOT NULL,
    PRIMARY KEY(formId, formItemsId)
)