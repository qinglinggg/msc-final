CREATE TABLE FormItemResponse (
    formRespondentId VARCHAR(100) NOT NULL REFERENCES FormRespondent(formRespondentId) ON UPDATE CASCADE ON DELETE CASCADE,
    formItemsId VARCHAR(100) NOT NULL REFERENCES FormItems(formItemsId) ON UPDATE CASCADE ON DELETE CASCADE,
    formItemResponseId VARCHAR(100) NOT NULL,
    answerSelectionId VARCHAR(100) NOT NULL REFERENCES FormAnswerSelection(answerSelectionId) ON UPDATE CASCADE ON DELETE CASCADE,
    answerSelectionValue VARCHAR(255) NOT NULL,
    PRIMARY KEY(formRespondentId, formItemResponseId)
)