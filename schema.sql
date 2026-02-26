-- SilverCare PostgreSQL Database Schema
-- Run this script to generate the tables required for the platform.

CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('Elder', 'Caregiver')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE EmergencyContacts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id) ON DELETE CASCADE,
    contact_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    relationship VARCHAR(50)
);

CREATE TABLE Medications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id) ON DELETE CASCADE,
    medicine_name VARCHAR(150) NOT NULL,
    dosage VARCHAR(50) NOT NULL,
    scheduled_time TIME NOT NULL,
    status VARCHAR(20) CHECK (status IN ('Taken', 'Missed', 'Pending')) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE DoctorRatings (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id) ON DELETE CASCADE,
    doctor_name VARCHAR(150) NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Feedback (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id) ON DELETE CASCADE,
    app_rating INT CHECK (app_rating >= 1 AND app_rating <= 5) NOT NULL,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mock Data Insertion
INSERT INTO Users (name, email, password_hash, role) 
VALUES ('Rajendra Kumar', 'rajendra@example.com', 'hashed_pass', 'Elder');

INSERT INTO EmergencyContacts (user_id, contact_name, phone_number, relationship) 
VALUES (1, 'Rohan Kumar', '9876543210', 'Son');

INSERT INTO Medications (user_id, medicine_name, dosage, scheduled_time, status)
VALUES 
(1, 'Aspirin', '1 Pill', '08:00:00', 'Pending'),
(1, 'Metformin', '500mg', '13:00:00', 'Taken'),
(1, 'Lisinopril', '10mg', '20:00:00', 'Missed');
