CREATE TABLE FormItemResponse (
    formRespondentId VARCHAR(100) NOT NULL,
    formItemsId VARCHAR(100) NOT NULL,
    formItemResponseId VARCHAR(100) NOT NULL,
    answerSelectionId VARCHAR(100) NOT NULL,
    answerSelectionValue VARCHAR(255) NOT NULL,
    CONSTRAINT formItemResponsePK PRIMARY KEY(formItemResponseId),
    CONSTRAINT formItemResponseFK FOREIGN KEY (formRespondentId) REFERENCES FormRespondent(formRespondentId)   
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT formItemResponseFK2 FOREIGN KEY (formItemsId) REFERENCES FormItems(formItemsId)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT formItemResponseFK3 FOREIGN KEY (answerSelectionId) REFERENCES FormAnswerSelection(answerSelectionId) 
        ON UPDATE CASCADE ON DELETE CASCADE
)