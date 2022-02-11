CREATE TABLE FormAnswerSelection (
    formItemsId VARCHAR(100) NOT NULL REFERENCES FormItems(formItemsId) ON UPDATE CASCADE ON DELETE CASCADE,
    answerSelectionId VARCHAR(100) NOT NULL,
    answerSelectionNo INT NOT NULL,
    answerSelectionLabel VARCHAR(100),
    answerSelectionValue VARCHAR(255),
    PRIMARY KEY(formItemsId, answerSelectionId)
)