/* =========================================================
   GET EMPLOYEES PROCEDURE
   Supports:
   - Get All Employees
   - Get Employee By ID
   - Get Employees By Department
   - Get Employees By Role
========================================================= */

CREATE PROCEDURE sp_get_employees
    @employee_id INT = NULL,
    @department_id INT = NULL,
    @role_id INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY

        SELECT
            e.employee_id,
            e.employee_code,

            e.first_name + ' ' + e.last_name AS employee_name,

            e.email,
            e.phone,

            d.department_name,

            r.role_name,

            m.first_name + ' ' + m.last_name AS manager_name,

            e.hire_date,

            CASE
                WHEN e.is_active = 1 THEN 'Active'
                ELSE 'Inactive'
            END AS employee_status

        FROM employees e

        LEFT JOIN departments d
            ON e.department_id = d.department_id

        LEFT JOIN roles r
            ON e.role_id = r.role_id

        LEFT JOIN employees m
            ON e.manager_id = m.employee_id

        WHERE
            (@employee_id IS NULL OR e.employee_id = @employee_id)

            AND

            (@department_id IS NULL OR e.department_id = @department_id)

            AND

            (@role_id IS NULL OR e.role_id = @role_id)

        ORDER BY e.employee_id;

    END TRY

    BEGIN CATCH

        SELECT
            ERROR_NUMBER() AS error_number,
            ERROR_MESSAGE() AS error_message;

    END CATCH

END;
GO

EXEC sp_get_employees;

EXEC sp_get_employees @employee_id = 4;

EXEC sp_get_employees @department_id = 2;

EXEC sp_get_employees @role_id = 3;