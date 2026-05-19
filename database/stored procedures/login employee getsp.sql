/* =========================================================
   LOGIN EMPLOYEE PROCEDURE
========================================================= */

CREATE PROCEDURE sp_login_employee
    @email NVARCHAR(100),
    @password_hash NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY

        SELECT
            e.employee_id,
            e.employee_code,

            e.first_name,
            e.last_name,

            e.email,

            d.department_name,

            r.role_name,

            e.is_active

        FROM employees e

        INNER JOIN departments d
            ON e.department_id = d.department_id

        INNER JOIN roles r
            ON e.role_id = r.role_id

        WHERE
            e.email = @email
            AND e.password_hash = @password_hash
            AND e.is_active = 1;

    END TRY

    BEGIN CATCH

        SELECT
            ERROR_NUMBER() AS error_number,
            ERROR_MESSAGE() AS error_message;

    END CATCH

END;
GO

EXEC sp_login_employee
    @email = 'sneha.employee@company.com',
    @password_hash = 'hashed_password_4';

