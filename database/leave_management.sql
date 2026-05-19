-- CREATE EMPLOYEES TABLE

CREATE TABLE employee (
    id SERIAL PRIMARY KEY,

    employee_name VARCHAR(100),

    email VARCHAR(100) UNIQUE,

    password VARCHAR(255),

    department VARCHAR(50),

    role VARCHAR(20),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- CREATE LEAVE TYPES TABLE

CREATE TABLE leave_types (
    id SERIAL PRIMARY KEY,

    leave_name VARCHAR(50),

    max_days INT
);



-- CREATE LEAVE REQUESTS TABLE

CREATE TABLE leave_requests (
    id SERIAL PRIMARY KEY,

    employee_id INT REFERENCES employees(id),

    leave_type_id INT REFERENCES leave_types(id),

    start_date DATE,

    end_date DATE,

    reason TEXT,

    status VARCHAR(20) DEFAULT 'PENDING',

    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- INSERT SAMPLE EMPLOYEES

INSERT INTO employees
(employee_name, email, password, department, role)

VALUES
('John', 'john@gmail.com', '123', 'IT', 'EMPLOYEE'),

('Sarah', 'sarah@gmail.com', '123', 'Finance', 'EMPLOYEE'),

('David', 'david@gmail.com', '123', 'HR', 'EMPLOYEE'),

('Michael', 'michael@gmail.com', '123', 'Marketing', 'EMPLOYEE'),

('Emma', 'emma@gmail.com', '123', 'IT', 'EMPLOYEE'),

('Sophia', 'sophia@gmail.com', '123', 'Operations', 'EMPLOYEE'),

('Daniel', 'daniel@gmail.com', '123', 'Finance', 'EMPLOYEE'),

('Olivia', 'olivia@gmail.com', '123', 'HR', 'EMPLOYEE'),

('James', 'james@gmail.com', '123', 'Marketing', 'EMPLOYEE'),

('Admin', 'admin@gmail.com', '123', 'Management', 'ADMIN');



-- INSERT LEAVE TYPES

INSERT INTO leave_types
(leave_name, max_days)

VALUES
('Sick Leave', 12),

('Casual Leave', 10),

('Earned Leave', 15),

('Maternity Leave', 90),

('Paternity Leave', 15),

('Bereavement Leave', 7),

('Marriage Leave', 10),

('Compensatory Off', 5),

('Work From Home', 30),

('Emergency Leave', 8);



-- INSERT LEAVE REQUESTS

INSERT INTO leave_requests
(employee_id, leave_type_id, start_date, end_date, reason)

VALUES
(1, 1, '2026-05-20', '2026-05-22', 'Fever'),

(2, 2, '2026-05-25', '2026-05-26', 'Family Function'),

(3, 3, '2026-06-01', '2026-06-05', 'Vacation'),

(4, 1, '2026-06-10', '2026-06-11', 'Medical Checkup'),

(5, 4, '2026-06-15', '2026-09-15', 'Maternity Leave'),

(6, 5, '2026-06-18', '2026-06-22', 'Newborn Care'),

(7, 6, '2026-06-25', '2026-06-27', 'Family Emergency'),

(8, 7, '2026-07-01', '2026-07-05', 'Marriage'),

(9, 8, '2026-07-10', '2026-07-11', 'Extra Working Day Compensation'),

(1, 9, '2026-07-15', '2026-07-20', 'Remote Work Request');



-- FULL JOIN QUERY

SELECT

    leave_requests.id,

    employees.employee_name,

    employees.department,

    leave_types.leave_name,

    leave_requests.start_date,

    leave_requests.end_date,

    leave_requests.reason,

    leave_requests.status

FROM leave_requests

JOIN employees
ON leave_requests.employee_id = employees.id

JOIN leave_types
ON leave_requests.leave_type_id = leave_types.id;