CREATE TABLE User (
    userId VARCHAR(100) PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    [password] VARCHAR(100) NOT NULL,
    profileImage VARCHAR(255) NULL
)