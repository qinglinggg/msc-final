CREATE TABLE FormAnswerSelection (
    formItemsId VARCHAR(100) NOT NULL
    REFERENCES FormItems(formItemsId) ON UPDATE CASCADE ON DELETE CASCADE,
    answerSelectionId VARCHAR(100) NOT NULL,
    answerSelectionContent VARCHAR(255),
    PRIMARY KEY(formItemsId, answerSelectionId)
)