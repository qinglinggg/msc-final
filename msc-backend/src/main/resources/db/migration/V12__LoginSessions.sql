CREATE TABLE LoginSessions (
    userId VARCHAR(255) NOT NULL,
    bearerToken VARCHAR(255) NOT NULL,
    PRIMARY KEY (userId)
)