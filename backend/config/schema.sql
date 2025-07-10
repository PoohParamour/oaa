-- Create database
CREATE DATABASE IF NOT EXISTS oaa_issue_tracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE oaa_issue_tracker;

-- Create admin table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
INSERT INTO admins (username, password) VALUES 
('admin', '$2a$10$yL8zqD8z1Q2x3X4X5X6X7uT8vM9B1C2D3E4F5G6H7I8J9K0L1M2N3O')
ON DUPLICATE KEY UPDATE username = username;

-- Create issues table
CREATE TABLE IF NOT EXISTS issues (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tracking_code VARCHAR(20) UNIQUE NOT NULL,
    customer_line_name VARCHAR(255) NOT NULL,
    emails JSON NOT NULL,
    problem_type ENUM('youtube_premium', 'family_plan', 'email_not_working') NOT NULL,
    problem_description TEXT NOT NULL,
    status ENUM('pending', 'in_progress', 'contact_admin', 'completed') DEFAULT 'pending',
    admin_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_tracking_code (tracking_code),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Create issue_images table
CREATE TABLE IF NOT EXISTS issue_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    issue_id INT NOT NULL,
    image_path VARCHAR(500) NOT NULL,
    image_size INT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    is_admin_image BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE,
    INDEX idx_issue_id (issue_id)
);

-- Create status_history table for tracking status changes
CREATE TABLE IF NOT EXISTS status_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    issue_id INT NOT NULL,
    previous_status ENUM('pending', 'in_progress', 'contact_admin', 'completed'),
    new_status ENUM('pending', 'in_progress', 'contact_admin', 'completed') NOT NULL,
    changed_by VARCHAR(50), -- admin username or 'system'
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE,
    INDEX idx_issue_id (issue_id),
    INDEX idx_changed_at (changed_at)
);

-- Create procedure for generating unique tracking codes
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS GenerateTrackingCode(OUT tracking_code VARCHAR(20))
BEGIN
    DECLARE code_exists INT DEFAULT 1;
    DECLARE new_code VARCHAR(20);
    
    WHILE code_exists > 0 DO
        SET new_code = CONCAT('OAA', DATE_FORMAT(NOW(), '%Y%m%d'), LPAD(FLOOR(RAND() * 10000), 4, '0'));
        SELECT COUNT(*) INTO code_exists FROM issues WHERE tracking_code = new_code;
    END WHILE;
    
    SET tracking_code = new_code;
END //
DELIMITER ;

-- Create event to auto-delete completed issues after 30 days
-- (This requires SUPER privilege, comment out if not available)
/*
SET GLOBAL event_scheduler = ON;

CREATE EVENT IF NOT EXISTS auto_cleanup_completed_issues
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_DATE + INTERVAL 1 DAY
DO
BEGIN
    -- Delete images files for issues completed more than 30 days ago
    DELETE FROM issue_images 
    WHERE issue_id IN (
        SELECT id FROM issues 
        WHERE status = 'completed' 
        AND updated_at < DATE_SUB(NOW(), INTERVAL 30 DAY)
    );
    
    -- Delete issues completed more than 30 days ago
    DELETE FROM issues 
    WHERE status = 'completed' 
    AND updated_at < DATE_SUB(NOW(), INTERVAL 30 DAY);
END;
*/ 