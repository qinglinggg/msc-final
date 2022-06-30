CREATE TABLE Form (
    formId VARCHAR(100) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(200),
    privacySetting VARCHAR(30) NOT NULL,
    createDate BIGINT,
    modifyDate BIGINT,
    backgroundColor VARCHAR(25),
    backgroundLink VARCHAR(100),
    versionNo INT NOT NULL
)