/* Query to create USERS table **/
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY NOT NULL,
    userName VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    location VARCHAR(255) NOT NULL,
    userPassword VARCHAR(255) NOT NULL
);


/* Query to create TRAVEL-DAIRY table  **/
CREATE TABLE travelDairy (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(255) NOT NULL,
    category VARCHAR(20) NOT NULL,
    location VARCHAR(255) NOT NULL,
    travelledDate Date NOT NULL,
    photo VARCHAR(255)
);


/* Query to create USER-TABLE-DAIRY table **/
CREATE TABLE userTravelDairy (
    userId VARCHAR(50),
    travelDairyId VARCHAR(50),
    PRIMARY KEY (userId, travelDairyId),
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (travelDairyId) REFERENCES travelDairy(id)
);


/* Query to Inert new users in USERS table  **/
INSERT INTO users (id, userName, phone, email, gender, location, userPassword) 
VALUES ('1', 'John Doe', '1234567890', 'john@example.com', 'Male', 'City, Country', 'password123');


/* Query to Inert new travelDairies in TRAVEL-DAIRY table  **/
INSERT INTO travelDairy (id, title, description, category, location, travelledDate, photo) 
VALUES ('1', 'Trip to Paris', 'Visited the Eiffel Tower and Louvre Museum', 'Sightseeing', 'Paris, France', '2023-07-15', 'paris_photo.jpg');


/* Query to Inert new user && traveData in USER-TRAVEL-DAIRY table  **/
INSERT INTO userTravelDairy (userId, travelDairyId) 
VALUES ('1', '1'),
       ('1', '2'),
       ('2', '3');