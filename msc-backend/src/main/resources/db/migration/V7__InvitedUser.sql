CREATE TABLE InvitedUser (
    invitationId VARCHAR(100) NOT NULL
    REFERENCES Invitation(invitationId) ON UPDATE CASCADE ON DELETE CASCADE,
    userId VARCHAR(100) NOT NULL
    REFERENCES User(userId) ON UPDATE CASCADE ON DELETE CASCADE,
    createDate DATE NOT NULL,
    expirationDate DATE NOT NULL,
    PRIMARY KEY(invitationId, userId)
)