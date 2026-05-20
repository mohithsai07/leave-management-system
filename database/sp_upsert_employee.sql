CREATE PROCEDURE sp_upsert_employee
(
    @employee_id INT = NULL,
    @employee_code VARCHAR(20),
    @first_name VARCHAR(100),
    @last_name VARCHAR(100) = NULL,
    @email VARCHAR(150),
    @password_hash VARCHAR(MAX),
    @role_id INT,
    @manager_id INT = NULL,
    @department VARCHAR(100) = NULL,
    @status BIT = 1
)
AS
BEGIN

    SET NOCOUNT ON;

    BEGIN TRY

        BEGIN TRANSACTION;

        DECLARE @new_employee_id INT;

        -- =====================================
        -- VALIDATE ROLE
        -- =====================================

        IF NOT EXISTS
        (
            SELECT 1
            FROM roles
            WHERE role_id = @role_id
        )
        BEGIN
            RAISERROR('Invalid role.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END


        -- =====================================
        -- CHECK DUPLICATE EMAIL
        -- =====================================

        IF EXISTS
        (
            SELECT 1
            FROM employees
            WHERE email = @email
            AND (
                    @employee_id IS NULL
                    OR employee_id <> @employee_id
                )
        )
        BEGIN
            RAISERROR('Email already exists.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END


        -- =====================================
        -- CHECK DUPLICATE EMPLOYEE CODE
        -- =====================================

        IF EXISTS
        (
            SELECT 1
            FROM employees
            WHERE employee_code = @employee_code
            AND (
                    @employee_id IS NULL
                    OR employee_id <> @employee_id
                )
        )
        BEGIN
            RAISERROR('Employee code already exists.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END


        -- =====================================
        -- INSERT MODE
        -- =====================================

        IF (@employee_id IS NULL)
        BEGIN

            INSERT INTO employees
            (
                employee_code,
                first_name,
                last_name,
                email,
                password_hash,
                role_id,
                manager_id,
                department,
                status,
                created_at,
                updated_at
            )
            VALUES
            (
                @employee_code,
                @first_name,
                @last_name,
                @email,
                @password_hash,
                @role_id,
                @manager_id,
                @department,
                @status,
                GETDATE(),
                GETDATE()
            );



            SET @new_employee_id = SCOPE_IDENTITY();


            -- =================================
            -- AUTO CREATE LEAVE BALANCES
            -- =================================

            INSERT INTO employee_leave_balances
            (
                employee_id,
                leave_type_id,
                total_leaves,
                used_leaves,
                remaining_leaves,
                year,
                updated_at
            )

            SELECT

                @new_employee_id,

                leave_type_id,

                total_leaves,

                0,

                total_leaves,

                YEAR(GETDATE()),

                GETDATE()

            FROM leave_types

            WHERE status = 1;

        END


        -- =====================================
        -- UPDATE MODE
        -- =====================================

        ELSE
        BEGIN

            IF NOT EXISTS
            (
                SELECT 1
                FROM employees
                WHERE employee_id = @employee_id
            )
            BEGIN
                RAISERROR('Employee not found.', 16, 1);
                ROLLBACK TRANSACTION;
                RETURN;
            END


            UPDATE employees
            SET

                employee_code = @employee_code,

                first_name = @first_name,

                last_name = @last_name,

                email = @email,

                password_hash = @password_hash,

                role_id = @role_id,

                manager_id = @manager_id,

                department = @department,

                status = @status,

                updated_at = GETDATE()

            WHERE employee_id = @employee_id;

        END


        COMMIT TRANSACTION;


        -- =====================================
        -- SUCCESS RESPONSE
        -- =====================================

        SELECT
            'Employee saved successfully.' AS message;

    END TRY

    BEGIN CATCH

        ROLLBACK TRANSACTION;

        SELECT
            ERROR_MESSAGE() AS error_message;

    END CATCH

END;