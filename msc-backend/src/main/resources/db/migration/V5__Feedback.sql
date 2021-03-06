CREATE TABLE Feedback (
    formId VARCHAR(100) NOT NULL
    REFERENCES Form(formId) ON UPDATE CASCADE ON DELETE CASCADE,
    feedbackId VARCHAR(100) NOT NULL,
    userId VARCHAR(100) NOT NULL
    REFERENCES User(userId) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY(formId, feedbackId)
)