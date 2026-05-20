-- INSERT ADMIN


EXEC sp_upsert_employee

    @employee_code = 'ADMIN001',

    @first_name = 'System',

    @last_name = 'Admin',

    @email = 'admin@company.com',

    @password_hash = 'admin123',

    @role_id = 1,

    @manager_id = NULL,

    @department = 'Administration';



-- INSERT MANAGER

EXEC sp_upsert_employee

    @employee_code = 'MGR001',

    @first_name = 'John',

    @last_name = 'Manager',

    @email = 'manager@company.com',

    @password_hash = 'manager123',

    @role_id = 2,

    @manager_id = NULL,

    @department = 'IT';



-- INSERT EMPLOYEE 1

EXEC sp_upsert_employee

    @employee_code = 'EMP001',

    @first_name = 'Rahul',

    @last_name = 'Kumar',

    @email = 'rahul@company.com',

    @password_hash = 'rahul123',

    @role_id = 3,

    @manager_id = 2,

    @department = 'Development';


-- INSERT EMPLOYEE 2

EXEC sp_upsert_employee

    @employee_code = 'EMP002',

    @first_name = 'Priya',

    @last_name = 'Sharma',

    @email = 'priya@company.com',

    @password_hash = 'priya123',

    @role_id = 3,

    @manager_id = 2,

    @department = 'Testing';



-- APPLY LEAVE - EMPLOYEE 1

EXEC sp_upsert_leave_request

    @employee_id = 3,

    @leave_type_id = 1,

    @from_date = '2026-05-25',

    @to_date = '2026-05-27',

    @reason = 'Medical leave';


-- APPLY LEAVE - EMPLOYEE 2

EXEC sp_upsert_leave_request

    @employee_id = 4,

    @leave_type_id = 2,

    @from_date = '2026-05-28',

    @to_date = '2026-05-29',

    @reason = 'Personal work';



-- APPROVE LEAVE

EXEC sp_approve_leave

    @leave_request_id = 1,

    @manager_id = 2,

    @manager_comments = 'Approved';



-- REJECT LEAVE

EXEC sp_reject_leave

    @leave_request_id = 2,

    @manager_id = 2,

    @manager_comments = 'Project deadline';


    SELECT * FROM employees;
    SELECT * FROM leave_types;
    SELECT * FROM employee_leave_balances;
    SELECT * FROM leave_requests;

    EXEC sp_login_employee
    @email = 'admin@company.com',
    @password_hash = 'admin123';

    EXEC sp_login_employee
    @email = 'wrong@company.com',
    @password_hash = '123';

    EXEC sp_get_leave_dashboard
    @employee_id = 3;

    EXEC sp_get_team_leave_requests
    @manager_id = 2;

    EXEC sp_get_leave_dashboard
    @employee_id = 3;