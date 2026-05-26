--EMPLOYEE LOGIN

CREATE OR ALTER  PROCEDURE sp_login_employee
(
    @email VARCHAR(150),
    @password_hash VARCHAR(100)
)
AS
BEGIN

    SET NOCOUNT ON;

    BEGIN TRY

        -- =====================================
        -- VALIDATE INPUTS
        -- =====================================

        IF (@email IS NULL OR LTRIM(RTRIM(@email)) = '')
        BEGIN
            RAISERROR('Email is required.', 16, 1);
            RETURN;
        END

        IF (@password_hash IS NULL OR LTRIM(RTRIM(@password_hash)) = '')
        BEGIN
            RAISERROR('Password is required.', 16, 1);
            RETURN;
        END


        -- =====================================
        -- VALIDATE EMPLOYEE LOGIN
        -- =====================================

        IF NOT EXISTS
        (
            SELECT 1
            FROM employees
            WHERE email = @email
            AND password_hash = @password_hash
            AND status = 1
        )
        BEGIN
            RAISERROR('Invalid email or password.', 16, 1);
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

            m.first_name + ' ' + m.last_name AS manager_name,

            e.created_at

        FROM employees e

        INNER JOIN roles r
            ON e.role_id = r.role_id

        --Self Join
        LEFT JOIN employees m
            ON e.manager_id = m.employee_id

        WHERE e.email = @email
        AND e.password_hash = @password_hash
        AND e.status = 1;

    END TRY

    BEGIN CATCH

        SELECT
            ERROR_MESSAGE() AS error_message;

    END CATCH

END;