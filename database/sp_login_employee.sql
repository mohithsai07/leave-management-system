CREATE OR ALTER PROCEDURE sp_login_employee
(
    @email VARCHAR(150)
)
AS
BEGIN

    SET NOCOUNT ON;

    BEGIN TRY

        -- =====================================
        -- VALIDATE EMAIL
        -- =====================================

        IF (@email IS NULL OR LTRIM(RTRIM(@email)) = '')
        BEGIN
            RAISERROR('Email is required.', 16, 1);
            RETURN;
        END

        -- =====================================
        -- VALIDATE EMPLOYEE
        -- =====================================

        IF NOT EXISTS
        (
            SELECT 1
            FROM employees
            WHERE email = @email
            AND status = 1
        )
        BEGIN
            RAISERROR(
                'Invalid email.',
                16,
                1
            );
            RETURN;
        END

        -- =====================================
        -- RETURN EMPLOYEE DETAILS
        -- =====================================

        SELECT

            e.employee_id,
            e.employee_code,
            e.first_name,
            e.last_name,
            e.email,
            e.department,
            e.role_id,
            r.role_name,
            e.manager_id,
            e.password_hash,
            m.first_name + ' ' + m.last_name AS manager_name,
            e.created_at

        FROM employees e

        INNER JOIN roles r
            ON e.role_id = r.role_id

        LEFT JOIN employees m
            ON e.manager_id = m.employee_id

        WHERE e.email = @email
        AND e.status = 1;

    END TRY

    BEGIN CATCH

        SELECT
            ERROR_MESSAGE() AS error_message;

    END CATCH

END;