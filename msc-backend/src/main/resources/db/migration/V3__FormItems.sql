CREATE TABLE FormItems (
    formId VARCHAR(100) NOT NULL,
    formItemsId VARCHAR(100) NOT NULL,
    itemNumber INT NOT NULL,
    questionContent VARCHAR(255),
    questionType VARCHAR(50) NOT NULL,
    isRequired INT NOT NULL,
    versionNo INT NOT NULL,
    branchEnabled INT NOT NULL DEFAULT(0),
    CONSTRAINT formItemsPK PRIMARY KEY (formItemsId),
    CONSTRAINT formItemsFK FOREIGN KEY (formId) REFERENCES Form(formId)
        ON UPDATE CASCADE ON DELETE CASCADE
)