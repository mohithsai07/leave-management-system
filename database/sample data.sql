USE LeaveManagementSystem;
GO

/* =========================================================
   1. INSERT DEPARTMENTS
========================================================= */

INSERT INTO departments (department_name, department_code)
VALUES
('Human Resources', 'HR'),
('Information Technology', 'IT'),
('Finance', 'FIN'),
('Marketing', 'MKT');
GO


/* =========================================================
   2. INSERT ROLES
========================================================= */

INSERT INTO roles (role_name)
VALUES
('Admin'),
('Manager'),
('Employee');
GO


/* =========================================================
   3. INSERT LEAVE TYPES
========================================================= */

INSERT INTO leave_types (leave_name, default_days, description)
VALUES
('Sick Leave', 10, 'Medical or health-related leave'),
('Casual Leave', 12, 'Personal short-term leave'),
('Earned Leave', 15, 'Paid annual leave'),
('Maternity Leave', 90, 'Leave for maternity purposes');
GO


/* =========================================================
   4. INSERT EMPLOYEES
========================================================= */

-- Admin Employee
INSERT INTO employees (
    employee_code,
    first_name,
    last_name,
    email,
    password_hash,
    phone,
    hire_date,
    department_id,
    role_id,
    manager_id
)
VALUES
(
    'EMP001',
    'Aarav',
    'Sharma',
    'aarav.admin@company.com',
    'hashed_password_1',
    '9876543210',
    '2022-01-10',
    1,
    1,
    NULL
);
GO


-- Manager Employees
INSERT INTO employees (
    employee_code,
    first_name,
    last_name,
    email,
    password_hash,
    phone,
    hire_date,
    department_id,
    role_id,
    manager_id
)
VALUES
(
    'EMP002',
    'Priya',
    'Reddy',
    'priya.manager@company.com',
    'hashed_password_2',
    '9876543211',
    '2022-03-15',
    2,
    2,
    1
),
(
    'EMP003',
    'Rahul',
    'Verma',
    'rahul.manager@company.com',
    'hashed_password_3',
    '9876543212',
    '2022-05-20',
    3,
    2,
    1
);
GO


-- Employee Users
INSERT INTO employees (
    employee_code,
    first_name,
    last_name,
    email,
    password_hash,
    phone,
    hire_date,
    department_id,
    role_id,
    manager_id
)
VALUES
(
    'EMP004',
    'Sneha',
    'Patel',
    'sneha.employee@company.com',
    'hashed_password_4',
    '9876543213',
    '2023-01-05',
    2,
    3,
    2
),
(
    'EMP005',
    'Kiran',
    'Kumar',
    'kiran.employee@company.com',
    'hashed_password_5',
    '9876543214',
    '2023-02-10',
    2,
    3,
    2
),
(
    'EMP006',
    'Anjali',
    'Mehta',
    'anjali.employee@company.com',
    'hashed_password_6',
    '9876543215',
    '2023-04-01',
    3,
    3,
    3
);
GO


/* =========================================================
   5. INSERT HOLIDAYS
========================================================= */

INSERT INTO holidays (
    holiday_name,
    holiday_date,
    description
)
VALUES
('Republic Day', '2026-01-26', 'National Holiday'),
('Independence Day', '2026-08-15', 'National Holiday'),
('Diwali', '2026-11-08', 'Festival Holiday'),
('Christmas', '2026-12-25', 'Festival Holiday');
GO


/* =========================================================
   6. INSERT LEAVE BALANCES
========================================================= */

INSERT INTO leave_balances (
    employee_id,
    leave_type_id,
    total_allocated,
    used_days,
    leave_year
)
VALUES
(4, 1, 10, 2, 2026),
(4, 2, 12, 3, 2026),
(4, 3, 15, 5, 2026),

(5, 1, 10, 1, 2026),
(5, 2, 12, 4, 2026),
(5, 3, 15, 6, 2026),

(6, 1, 10, 0, 2026),
(6, 2, 12, 2, 2026),
(6, 3, 15, 1, 2026);
GO


/* =========================================================
   7. INSERT LEAVE REQUESTS
========================================================= */

INSERT INTO leave_requests (
    employee_id,
    leave_type_id,
    start_date,
    end_date,
    total_days,
    reason,
    status,
    approved_by,
    approved_at,
    remarks
)
VALUES
(
    4,
    1,
    '2026-05-10',
    '2026-05-12',
    3,
    'Fever and medical rest',
    'Approved',
    2,
    GETDATE(),
    'Approved. Take care.'
),
(
    5,
    2,
    '2026-06-01',
    '2026-06-03',
    3,
    'Family function',
    'Pending',
    NULL,
    NULL,
    NULL
),
(
    6,
    3,
    '2026-07-15',
    '2026-07-20',
    6,
    'Vacation trip',
    'Rejected',
    3,
    GETDATE(),
    'Project deadline in progress.'
);
GO


/* =========================================================
   8. INSERT NOTIFICATIONS
========================================================= */

INSERT INTO notifications (
    employee_id,
    title,
    message
)
VALUES
(
    4,
    'Leave Approved',
    'Your sick leave request has been approved.'
),
(
    5,
    'Leave Request Submitted',
    'Your leave request is pending manager approval.'
),
(
    6,
    'Leave Rejected',
    'Your leave request was rejected due to project workload.'
);
GO