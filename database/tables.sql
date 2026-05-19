USE LeaveManagementSystem;
GO

/* =========================================================
   1. DEPARTMENTS TABLE
========================================================= */

CREATE TABLE departments (
    department_id INT IDENTITY(1,1) PRIMARY KEY,

    department_name NVARCHAR(100) NOT NULL UNIQUE,

    department_code NVARCHAR(20) NOT NULL UNIQUE,

    created_at DATETIME2 DEFAULT GETDATE()
);
GO


/* =========================================================
   2. ROLES TABLE
========================================================= */

CREATE TABLE roles (
    role_id INT IDENTITY(1,1) PRIMARY KEY,

    role_name NVARCHAR(50) NOT NULL UNIQUE,

    created_at DATETIME2 DEFAULT GETDATE()
);
GO


/* =========================================================
   3. LEAVE TYPES TABLE
========================================================= */

CREATE TABLE leave_types (
    leave_type_id INT IDENTITY(1,1) PRIMARY KEY,

    leave_name NVARCHAR(50) NOT NULL UNIQUE,

    default_days INT NOT NULL CHECK (default_days >= 0),

    description NVARCHAR(255),

    created_at DATETIME2 DEFAULT GETDATE()
);
GO


/* =========================================================
   4. EMPLOYEES TABLE
========================================================= */

CREATE TABLE employees (
    employee_id INT IDENTITY(1,1) PRIMARY KEY,

    employee_code NVARCHAR(20) NOT NULL UNIQUE,

    first_name NVARCHAR(50) NOT NULL,

    last_name NVARCHAR(50) NOT NULL,

    email NVARCHAR(100) NOT NULL UNIQUE,

    password_hash NVARCHAR(255) NOT NULL,

    phone NVARCHAR(15),

    hire_date DATE NOT NULL,

    department_id INT NOT NULL,

    role_id INT NOT NULL,

    manager_id INT NULL,

    is_active BIT DEFAULT 1,

    created_at DATETIME2 DEFAULT GETDATE(),

    CONSTRAINT FK_Employees_Departments
        FOREIGN KEY (department_id)
        REFERENCES departments(department_id),

    CONSTRAINT FK_Employees_Roles
        FOREIGN KEY (role_id)
        REFERENCES roles(role_id),

    CONSTRAINT FK_Employees_Manager
        FOREIGN KEY (manager_id)
        REFERENCES employees(employee_id)
);
GO


/* =========================================================
   5. HOLIDAYS TABLE
========================================================= */

CREATE TABLE holidays (
    holiday_id INT IDENTITY(1,1) PRIMARY KEY,

    holiday_name NVARCHAR(100) NOT NULL,

    holiday_date DATE NOT NULL UNIQUE,

    description NVARCHAR(255),

    created_at DATETIME2 DEFAULT GETDATE()
);
GO


/* =========================================================
   6. LEAVE BALANCES TABLE
========================================================= */

CREATE TABLE leave_balances (
    balance_id INT IDENTITY(1,1) PRIMARY KEY,

    employee_id INT NOT NULL,

    leave_type_id INT NOT NULL,

    total_allocated DECIMAL(5,2) NOT NULL
        CHECK (total_allocated >= 0),

    used_days DECIMAL(5,2) DEFAULT 0
        CHECK (used_days >= 0),

    remaining_days AS (total_allocated - used_days),

    leave_year INT NOT NULL,

    created_at DATETIME2 DEFAULT GETDATE(),

    CONSTRAINT FK_LeaveBalances_Employees
        FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id),

    CONSTRAINT FK_LeaveBalances_LeaveTypes
        FOREIGN KEY (leave_type_id)
        REFERENCES leave_types(leave_type_id),

    CONSTRAINT UQ_Employee_Leave_Year
        UNIQUE (employee_id, leave_type_id, leave_year)
);
GO


/* =========================================================
   7. LEAVE REQUESTS TABLE
========================================================= */

CREATE TABLE leave_requests (
    leave_request_id INT IDENTITY(1,1) PRIMARY KEY,

    employee_id INT NOT NULL,

    leave_type_id INT NOT NULL,

    start_date DATE NOT NULL,

    end_date DATE NOT NULL,

    total_days DECIMAL(5,2) NOT NULL
        CHECK (total_days > 0),

    reason NVARCHAR(500) NOT NULL,

    status NVARCHAR(20) DEFAULT 'Pending'
        CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Cancelled')),

    approved_by INT NULL,

    approved_at DATETIME2 NULL,

    remarks NVARCHAR(500),

    applied_at DATETIME2 DEFAULT GETDATE(),

    CONSTRAINT FK_LeaveRequests_Employees
        FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id),

    CONSTRAINT FK_LeaveRequests_LeaveTypes
        FOREIGN KEY (leave_type_id)
        REFERENCES leave_types(leave_type_id),

    CONSTRAINT FK_LeaveRequests_ApprovedBy
        FOREIGN KEY (approved_by)
        REFERENCES employees(employee_id),

    CONSTRAINT CHK_LeaveDates
        CHECK (end_date >= start_date)
);
GO


/* =========================================================
   8. NOTIFICATIONS TABLE (OPTIONAL)
========================================================= */

CREATE TABLE notifications (
    notification_id INT IDENTITY(1,1) PRIMARY KEY,

    employee_id INT NOT NULL,

    title NVARCHAR(100) NOT NULL,

    message NVARCHAR(500) NOT NULL,

    is_read BIT DEFAULT 0,

    created_at DATETIME2 DEFAULT GETDATE(),

    CONSTRAINT FK_Notifications_Employees
        FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id)
);
GO