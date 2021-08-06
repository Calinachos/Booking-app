CREATE DATABASE testDB;

DROP TABLE users;
DROP TABLE organisations;
DROP TABLE rooms;
DROP TABLE booking;

CREATE TABLE users(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(30),
    password VARCHAR(32),
    type INT NOT NULL,
    org_id INT NOT NULL
);
INSERT INTO users(username, password, type, org_id) VALUES("denddyprod", "test123", 1, 1);

CREATE TABLE organisations(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50)
);
INSERT INTO organisations(name) VALUES('Organisation A');
INSERT INTO organisations(name) VALUES('Organisation B');

CREATE TABLE rooms(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30),
    description VARCHAR(120),
    org_id INT NOT NULL
);
INSERT INTO rooms(name, org_id) VALUES("BN202", "Used for classes of math, 9-12 grade.", 1);

CREATE TABLE booking(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    reason VARCHAR(120),
    start_at TIME,
    end_at TIME,
    user_id INT NOT NULL
);
