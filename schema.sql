-- SQL Schema for Internat Admission System
-- Database: PostgreSQL

-- Create Custom Types
CREATE TYPE user_role AS ENUM ('student', 'admin');
CREATE TYPE student_type AS ENUM ('CPGE', 'Lycée Technique');
CREATE TYPE application_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE document_type AS ENUM ('CIN_copy', 'transcript', 'residency_cert');

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Profiles Table
CREATE TABLE profiles (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    cin VARCHAR(20) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL,
    CONSTRAINT chk_province CHECK (province IN ('Azilal', 'Fkih Ben Salah', 'Khénifra', 'Khouribga', 'Beni Mellal'))
);

-- Applications Table
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_type student_type NOT NULL,
    filière VARCHAR(255) NOT NULL,
    grade_average DECIMAL(4, 2) NOT NULL,
    status application_status NOT NULL DEFAULT 'pending',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Documents Table
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    application_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    document_type document_type NOT NULL,
    file_url TEXT NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_documents_application_id ON documents(application_id);
