CREATE TABLE FormAnswerSelection (
    formItemsId VARCHAR(100) NOT NULL,
    answerSelectionId VARCHAR(100) NOT NULL,
    answerSelectionNo INT NOT NULL,
    answerSelectionLabel VARCHAR(100),
    answerSelectionValue VARCHAR(255),
    nextItem INT NULL,
    prevItem INT NULL,
    CONSTRAINT formAnswerSelectionPK PRIMARY KEY (answerSelectionId),
    CONSTRAINT formAnswerSelectionFK FOREIGN KEY (formItemsId) REFERENCES FormItems(formItemsId)
        ON UPDATE CASCADE ON DELETE CASCADE
)