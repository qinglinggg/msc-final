CREATE TABLE FeedbackMessage (
    feedbackId VARCHAR(100) NOT NULL,
    senderUserId VARCHAR(100) NOT NULL,
    messageId VARCHAR(100) NOT NULL,
    message VARCHAR(255) NOT NULL,
    createDateTime BIGINT NOT NULL,
    isRead INT NOT NULL,
    CONSTRAINT feedbackMessagePK PRIMARY KEY(feedbackId, messageId),
    CONSTRAINT feedbackMessageFK FOREIGN KEY (feedbackId) REFERENCES Feedback(feedbackId)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT feedbackMessageFK2 FOREIGN KEY (senderUserId) REFERENCES User(userId)
        ON UPDATE CASCADE ON DELETE CASCADE
)