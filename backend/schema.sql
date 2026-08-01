CREATE DATABASE IF NOT EXISTS nanny_db;
USE nanny_db;

-- Main Nannies Table
CREATE TABLE IF NOT EXISTS nannies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    gender ENUM('Female', 'Male', 'Other') NOT NULL,
    mobile_number VARCHAR(20) NOT NULL,
    email_address VARCHAR(255) NOT NULL,
    nationality VARCHAR(100),
    preferred_language VARCHAR(255),
    
    -- Address details (Current & Permanent)
    current_address TEXT,
    current_area VARCHAR(100),
    current_city VARCHAR(100),
    current_state VARCHAR(100),
    current_pincode VARCHAR(20),
    
    permanent_address TEXT,
    permanent_area VARCHAR(100),
    permanent_city VARCHAR(100),
    permanent_state VARCHAR(100),
    permanent_pincode VARCHAR(20),
    
    -- KYC
    gov_id_type VARCHAR(100),
    gov_id_number VARCHAR(100),
    
    -- Work Info
    years_experience VARCHAR(50),
    preferred_job_type VARCHAR(100),
    expected_salary DECIMAL(10, 2),
    available_from DATE,
    available_working_hours VARCHAR(100),
    preferred_work_location VARCHAR(255),
    willing_to_travel BOOLEAN DEFAULT FALSE,
    overnight_stay BOOLEAN DEFAULT FALSE,
    live_in_option BOOLEAN DEFAULT FALSE,
    available_weekends BOOLEAN DEFAULT FALSE,
    available_holidays BOOLEAN DEFAULT FALSE,
    can_travel_with_family BOOLEAN DEFAULT FALSE,
    
    -- Medical Info
    medical_condition BOOLEAN DEFAULT FALSE,
    medical_condition_details TEXT,
    allergies BOOLEAN DEFAULT FALSE,
    allergies_details TEXT,
    physical_limitations BOOLEAN DEFAULT FALSE,
    physical_limitations_details TEXT,
    blood_group VARCHAR(10),
    vaccination_status VARCHAR(100),
    
    -- Background Info
    convicted_crime BOOLEAN DEFAULT FALSE,
    background_check_willing BOOLEAN DEFAULT FALSE,
    police_verification BOOLEAN DEFAULT FALSE,
    
    -- Education
    highest_qualification VARCHAR(100),
    can_read_english BOOLEAN DEFAULT FALSE,
    can_speak_english BOOLEAN DEFAULT FALSE,
    can_read_hindi BOOLEAN DEFAULT FALSE,
    other_languages VARCHAR(255),
    
    -- Bank Details
    bank_name VARCHAR(255),
    account_holder_name VARCHAR(255),
    account_number VARCHAR(100),
    ifsc_code VARCHAR(50),
    upi_id VARCHAR(100),
    
    -- Additional Info
    height_cm DECIMAL(5, 2),
    weight_kg DECIMAL(5, 2),
    smoking_status VARCHAR(50),
    pet_friendly BOOLEAN DEFAULT FALSE,
    comfortable_multiple_children BOOLEAN DEFAULT FALSE,
    comfortable_infants BOOLEAN DEFAULT FALSE,
    can_swim BOOLEAN DEFAULT FALSE,
    own_vehicle BOOLEAN DEFAULT FALSE,
    passport_available BOOLEAN DEFAULT FALSE,
    uniform_size VARCHAR(20),
    expected_joining_date DATE,
    preferred_city_work VARCHAR(100),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Skills Table (Many-to-Many)
CREATE TABLE IF NOT EXISTS nanny_skills (
    nanny_id INT,
    skill_name VARCHAR(100),
    PRIMARY KEY (nanny_id, skill_name),
    FOREIGN KEY (nanny_id) REFERENCES nannies(id) ON DELETE CASCADE
);

-- References Table (One-to-Many)
CREATE TABLE IF NOT EXISTS nanny_references (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nanny_id INT,
    name VARCHAR(255),
    relationship VARCHAR(100),
    phone_number VARCHAR(20),
    FOREIGN KEY (nanny_id) REFERENCES nannies(id) ON DELETE CASCADE
);

-- Documents Table (One-to-Many)
CREATE TABLE IF NOT EXISTS nanny_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nanny_id INT,
    document_type VARCHAR(100),
    file_path VARCHAR(500),
    FOREIGN KEY (nanny_id) REFERENCES nannies(id) ON DELETE CASCADE
);

-- Drop procedure if exists to allow recreating
DROP PROCEDURE IF EXISTS RegisterNanny;

-- Stored Procedure to insert Nanny along with skills, references, and documents
DELIMITER //

CREATE PROCEDURE RegisterNanny(
    IN p_nanny_data JSON,
    IN p_skills JSON,
    IN p_references JSON,
    IN p_documents JSON,
    OUT p_nanny_id INT
)
BEGIN
    DECLARE v_nanny_id INT;
    DECLARE i INT DEFAULT 0;
    DECLARE skill_count INT;
    DECLARE ref_count INT;
    DECLARE doc_count INT;
    
    -- Start Transaction
    START TRANSACTION;

    -- 1. Insert into main nannies table
    INSERT INTO nannies (
        full_name, dob, gender, mobile_number, email_address, nationality, preferred_language,
        current_address, current_area, current_city, current_state, current_pincode,
        permanent_address, permanent_area, permanent_city, permanent_state, permanent_pincode,
        gov_id_type, gov_id_number,
        years_experience, preferred_job_type, expected_salary, available_from, available_working_hours, preferred_work_location,
        willing_to_travel, overnight_stay, live_in_option, available_weekends, available_holidays, can_travel_with_family,
        medical_condition, medical_condition_details, allergies, allergies_details, physical_limitations, physical_limitations_details, blood_group, vaccination_status,
        convicted_crime, background_check_willing, police_verification,
        highest_qualification, can_read_english, can_speak_english, can_read_hindi, other_languages,
        bank_name, account_holder_name, account_number, ifsc_code, upi_id,
        height_cm, weight_kg, smoking_status, pet_friendly, comfortable_multiple_children, comfortable_infants, can_swim, own_vehicle, passport_available, uniform_size, expected_joining_date, preferred_city_work
    ) VALUES (
        JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.fullName')),
        JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.dob')),
        JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.gender')),
        JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.mobileNumber')),
        JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.emailAddress')),
        JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.nationality')),
        JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.preferredLanguage')),
        
        JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.currentAddress')),
        JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.currentArea')),
        JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.currentCity')),
        JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.currentState')),
        JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.currentPincode')),
        
        JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.permanentAddress')),
        JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.permanentArea')),
        JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.permanentCity')),
        JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.permanentState')),
        JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.permanentPincode')),
        
        JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.govIdType')),
        JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.govIdNumber')),
        
        JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.yearsExperience')),
        JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.preferredJobType')),
        IF(JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.expectedSalary')) = 'null' OR JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.expectedSalary')) = '', NULL, CAST(JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.expectedSalary')) AS DECIMAL(10,2))),
        IF(JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.availableFrom')) = 'null' OR JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.availableFrom')) = '', NULL, JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.availableFrom'))),
        JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.availableWorkingHours')),
        JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.preferredWorkLocation')),
        
        JSON_EXTRACT(p_nanny_data, '$.willingToTravel') = true,
        JSON_EXTRACT(p_nanny_data, '$.overnightStay') = true,
        JSON_EXTRACT(p_nanny_data, '$.liveInOption') = true,
        JSON_EXTRACT(p_nanny_data, '$.availableWeekends') = true,
        JSON_EXTRACT(p_nanny_data, '$.availableHolidays') = true,
        JSON_EXTRACT(p_nanny_data, '$.canTravelWithFamily') = true,
        
        JSON_EXTRACT(p_nanny_data, '$.medicalCondition') = true,
        JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.medicalConditionDetails')),
        JSON_EXTRACT(p_nanny_data, '$.allergies') = true,
        JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.allergiesDetails')),
        JSON_EXTRACT(p_nanny_data, '$.physicalLimitations') = true,
        JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.physicalLimitationsDetails')),
        JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.bloodGroup')),
        JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.vaccinationStatus')),
        
        JSON_EXTRACT(p_nanny_data, '$.convictedCrime') = true,
        JSON_EXTRACT(p_nanny_data, '$.backgroundCheckWilling') = true,
        JSON_EXTRACT(p_nanny_data, '$.policeVerification') = true,
        
        JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.highestQualification')),
        JSON_EXTRACT(p_nanny_data, '$.canReadEnglish') = true,
        JSON_EXTRACT(p_nanny_data, '$.canSpeakEnglish') = true,
        JSON_EXTRACT(p_nanny_data, '$.canReadHindi') = true,
        JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.otherLanguages')),
        
        JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.bankName')),
        JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.accountHolderName')),
        JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.accountNumber')),
        JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.ifscCode')),
        JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.upiId')),
        
        IF(JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.heightCm')) = 'null' OR JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.heightCm')) = '', NULL, CAST(JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.heightCm')) AS DECIMAL(5,2))),
        IF(JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.weightKg')) = 'null' OR JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.weightKg')) = '', NULL, CAST(JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.weightKg')) AS DECIMAL(5,2))),
        JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.smokingStatus')),
        JSON_EXTRACT(p_nanny_data, '$.petFriendly') = true,
        JSON_EXTRACT(p_nanny_data, '$.comfortableMultipleChildren') = true,
        JSON_EXTRACT(p_nanny_data, '$.comfortableInfants') = true,
        JSON_EXTRACT(p_nanny_data, '$.canSwim') = true,
        JSON_EXTRACT(p_nanny_data, '$.ownVehicle') = true,
        JSON_EXTRACT(p_nanny_data, '$.passportAvailable') = true,
        JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.uniformSize')),
        IF(JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.expectedJoiningDate')) = 'null' OR JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.expectedJoiningDate')) = '', NULL, JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.expectedJoiningDate'))),
        JSON_UNQUOTE(JSON_EXTRACT(p_nanny_data, '$.preferredCityWork'))
    );
    
    SET v_nanny_id = LAST_INSERT_ID();
    SET p_nanny_id = v_nanny_id;

    -- 2. Insert Skills (JSON Array)
    IF p_skills IS NOT NULL THEN
        SET skill_count = JSON_LENGTH(p_skills);
        SET i = 0;
        WHILE i < skill_count DO
            INSERT INTO nanny_skills (nanny_id, skill_name)
            VALUES (v_nanny_id, JSON_UNQUOTE(JSON_EXTRACT(p_skills, CONCAT('$[', i, ']'))));
            SET i = i + 1;
        END WHILE;
    END IF;

    -- 3. Insert References (JSON Array of Objects)
    IF p_references IS NOT NULL THEN
        SET ref_count = JSON_LENGTH(p_references);
        SET i = 0;
        WHILE i < ref_count DO
            INSERT INTO nanny_references (nanny_id, name, relationship, phone_number)
            VALUES (
                v_nanny_id,
                JSON_UNQUOTE(JSON_EXTRACT(p_references, CONCAT('$[', i, '].name'))),
                JSON_UNQUOTE(JSON_EXTRACT(p_references, CONCAT('$[', i, '].relationship'))),
                JSON_UNQUOTE(JSON_EXTRACT(p_references, CONCAT('$[', i, '].phoneNumber')))
            );
            SET i = i + 1;
        END WHILE;
    END IF;

    -- 4. Insert Documents (JSON Array of Objects)
    IF p_documents IS NOT NULL THEN
        SET doc_count = JSON_LENGTH(p_documents);
        SET i = 0;
        WHILE i < doc_count DO
            INSERT INTO nanny_documents (nanny_id, document_type, file_path)
            VALUES (
                v_nanny_id,
                JSON_UNQUOTE(JSON_EXTRACT(p_documents, CONCAT('$[', i, '].type'))),
                JSON_UNQUOTE(JSON_EXTRACT(p_documents, CONCAT('$[', i, '].path')))
            );
            SET i = i + 1;
        END WHILE;
    END IF;

    COMMIT;
END //
DELIMITER ;
