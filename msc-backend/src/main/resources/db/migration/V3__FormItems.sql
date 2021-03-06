CREATE TABLE FormItems (
    formId VARCHAR(100) NOT NULL REFERENCES Form(formId) ON UPDATE CASCADE ON DELETE CASCADE,
    formItemsId VARCHAR(100) NOT NULL,
    itemNumber INT NOT NULL,
    questionContent VARCHAR(255),
    questionType VARCHAR(50) NOT NULL,
    isRequired INT NOT NULL,
    PRIMARY KEY(formId, formItemsId)
)