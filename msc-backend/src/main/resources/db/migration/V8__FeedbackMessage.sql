CREATE TABLE FeedbackMessage (
    feedbackId VARCHAR(100) NOT NULL
    REFERENCES Feedback(feedbackId) ON UPDATE CASCADE ON DELETE CASCADE,
    messageId VARCHAR(100) NOT NULL,
    message VARCHAR(255) NOT NULL,
    createDate DATE NOT NULL,
    PRIMARY KEY(feedbackId, messageId)
)