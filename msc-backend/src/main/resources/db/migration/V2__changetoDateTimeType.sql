CREATE TABLE Form (
    formId VARCHAR(100) PRIMARY KEY,
    authorUserId VARCHAR(100) NOT NULL REFERENCES User(userId) ON UPDATE CASCADE ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(200),
    privacySetting VARCHAR(30) NOT NULL,
    backgroundColor VARCHAR(25),
    backgroundLink VARCHAR(100),
    createDate DATETIME,
    modifyDate DATETIME
)