CREATE TABLE FeedbackMessage (
    feedbackId VARCHAR(100) NOT NULL
    REFERENCES Feedback(feedbackId) ON UPDATE CASCADE ON DELETE CASCADE,
    messageId VARCHAR(100) NOT NULL,
    message VARCHAR(255) NOT NULL,
    createDateTime DATETIME NOT NULL,
    isRead INT NOT NULL,
    PRIMARY KEY(feedbackId, messageId)
)