CREATE TABLE FormItems (
    formId VARCHAR(100) NOT NULL,
    formItemsId VARCHAR(100) NOT NULL,
    itemNumber INT NOT NULL,
    questionContent VARCHAR(255),
    questionType VARCHAR(50) NOT NULL,
    isRequired INT NOT NULL,
    versionNo INT NOT NULL,
    CONSTRAINT formItemsPK PRIMARY KEY (formItemsId),
    CONSTRAINT formItemsFK FOREIGN KEY (formId) REFERENCES Form(formId)
        ON UPDATE CASCADE ON DELETE CASCADE
)