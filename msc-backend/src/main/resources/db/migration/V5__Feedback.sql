CREATE TABLE Feedback (
    formId VARCHAR(100) NOT NULL,
    feedbackId VARCHAR(100) NOT NULL,
    userId VARCHAR(100) NOT NULL,
    CONSTRAINT feedbackPK PRIMARY KEY(feedbackId),
    CONSTRAINT feedbackFK FOREIGN KEY (formId) REFERENCES Form(formId)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT feedbackFK2 FOREIGN KEY (userId) REFERENCES User(userId)
        ON UPDATE CASCADE ON DELETE CASCADE
)