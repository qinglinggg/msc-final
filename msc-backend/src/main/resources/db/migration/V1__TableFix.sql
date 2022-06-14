CREATE TABLE User (
    userId VARCHAR(100) PRIMARY KEY,
    userDomain VARCHAR(100) NOT NULL,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    profileImage VARCHAR(255) NULL
)