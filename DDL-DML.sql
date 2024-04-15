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
CREATE TABLE traveldairy (
    id VARCHAR(50) PRIMARY KEY,
    userId VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(255) NOT NULL,
    category VARCHAR(20) NOT NULL,
    location VARCHAR(255) NOT NULL,
    travelledDate DATE NOT NULL,
    photo VARCHAR(255),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);



/* Query to create USER-TABLE-DAIRY table **/
CREATE TABLE usertraveldairy (
    userId VARCHAR(50),
    travelDairyId VARCHAR(50),
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (travelDairyId) REFERENCES traveldairy(id)
);


ALTER TABLE usertraveldairy
ADD CONSTRAINT fk_user_traveldairy FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE usertraveldairy
 ADD CONSTRAINT fk_user_traveldairy3 FOREIGN KEY (travelDairyId) REFERENCES traveldairy(id) ON DELETE CASCADE;




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




/* Triggger for automatically adding a feild in junction table when a new travel is added at travelDairy*/
DELIMITER //

CREATE TRIGGER add_userTraveldairy_row AFTER INSERT ON travelDairy
FOR EACH ROW
BEGIN
    INSERT INTO usertraveldairy (userId, travelDairyId) VALUES (NEW.userId, NEW.id);
END;
//

DELIMITER ;



/*  Trigger for automatically deleting all the user related fields from the junction table when user from users table deleted   */
DELIMITER //

CREATE TRIGGER delete_userTraveldairy_row BEFORE DELETE ON user
FOR EACH ROW
BEGIN
    DELETE FROM usertraveldairy WHERE userId = OLD.id;
END;
//

DELIMITER ;