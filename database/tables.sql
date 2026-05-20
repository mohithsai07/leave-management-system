

CREATE DATABASE leave_management_system;
GO

USE leave_management_system;
GO



-- =========================================
-- TABLE 1 : roles
-- =========================================

CREATE TABLE roles (

    role_id INT IDENTITY(1,1) PRIMARY KEY,

    role_name VARCHAR(50) UNIQUE NOT NULL,

    created_at DATETIME DEFAULT GETDATE()
);



-- =========================================
-- DEFAULT ROLES
-- =========================================

INSERT INTO roles (role_name)
VALUES
('Admin'),
('Manager'),
('Employee');



-- =========================================
-- TABLE 2 : employees
-- =========================================

CREATE TABLE employees (

    employee_id INT IDENTITY(1,1) PRIMARY KEY,

    employee_code VARCHAR(20) UNIQUE NOT NULL,

    first_name VARCHAR(100) NOT NULL,

    last_name VARCHAR(100),

    email VARCHAR(150) UNIQUE NOT NULL,

    password_hash VARCHAR(MAX) NOT NULL,

    role_id INT NOT NULL,

    manager_id INT,

    department VARCHAR(100),

    status BIT DEFAULT 1,

    created_at DATETIME DEFAULT GETDATE(),

    updated_at DATETIME DEFAULT GETDATE(),

    CONSTRAINT fk_employee_role
        FOREIGN KEY (role_id)
        REFERENCES roles(role_id),

    CONSTRAINT fk_employee_manager
        FOREIGN KEY (manager_id)
        REFERENCES employees(employee_id)
);



-- =========================================
-- TABLE 3 : leave_types
-- =========================================

CREATE TABLE leave_types (

    leave_type_id INT IDENTITY(1,1) PRIMARY KEY,

    leave_name VARCHAR(100) UNIQUE NOT NULL,

    total_leaves INT NOT NULL,

    description VARCHAR(MAX),

    status BIT DEFAULT 1,

    created_at DATETIME DEFAULT GETDATE()
);



-- =========================================
-- DEFAULT LEAVE TYPES
-- =========================================

INSERT INTO leave_types
(leave_name, total_leaves, description)
VALUES

('Sick Leave', 12, 'Medical leave'),

('Casual Leave', 10, 'Personal leave'),

('Earned Leave', 15, 'Paid leave');



-- =========================================
-- TABLE 4 : employee_leave_balances
-- =========================================

CREATE TABLE employee_leave_balances (

    balance_id INT IDENTITY(1,1) PRIMARY KEY,

    employee_id INT NOT NULL,

    leave_type_id INT NOT NULL,

    total_leaves INT NOT NULL,

    used_leaves INT DEFAULT 0,

    remaining_leaves INT NOT NULL,

    year INT NOT NULL,

    updated_at DATETIME DEFAULT GETDATE(),

    CONSTRAINT fk_balance_employee
        FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id),

    CONSTRAINT fk_balance_leave_type
        FOREIGN KEY (leave_type_id)
        REFERENCES leave_types(leave_type_id)
);



-- =========================================
-- TABLE 5 : leave_requests
-- =========================================

CREATE TABLE leave_requests (

    leave_request_id INT IDENTITY(1,1) PRIMARY KEY,

    employee_id INT NOT NULL,

    leave_type_id INT NOT NULL,

    from_date DATE NOT NULL,

    to_date DATE NOT NULL,

    total_days INT NOT NULL,

    reason VARCHAR(MAX),

    notify_employee_id INT,

    status VARCHAR(20)
    DEFAULT 'Pending'
    CHECK (status IN ('Pending','Approved','Rejected','Cancelled')),

    applied_at DATETIME DEFAULT GETDATE(),

    manager_comments VARCHAR(MAX),

    approved_by INT,

    approved_at DATETIME NULL,

    CONSTRAINT fk_leave_employee
        FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id),

    CONSTRAINT fk_leave_type
        FOREIGN KEY (leave_type_id)
        REFERENCES leave_types(leave_type_id),

    CONSTRAINT fk_notify_employee
        FOREIGN KEY (notify_employee_id)
        REFERENCES employees(employee_id),

    CONSTRAINT fk_approved_by
        FOREIGN KEY (approved_by)
        REFERENCES employees(employee_id)
);



-- =========================================
-- TABLE 6 : notifications
-- =========================================

CREATE TABLE notifications (

    notification_id INT IDENTITY(1,1) PRIMARY KEY,

    employee_id INT NOT NULL,

    title VARCHAR(255) NOT NULL,

    message VARCHAR(MAX) NOT NULL,

    is_read BIT DEFAULT 0,

    created_at DATETIME DEFAULT GETDATE(),

    CONSTRAINT fk_notification_employee
        FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id)
);



-- =========================================
-- INDEXES
-- =========================================

CREATE INDEX idx_employee_email
ON employees(email);

CREATE INDEX idx_employee_manager
ON employees(manager_id);

CREATE INDEX idx_leave_employee
ON leave_requests(employee_id);

CREATE INDEX idx_leave_status
ON leave_requests(status);