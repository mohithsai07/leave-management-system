CREATE OR ALTER PROCEDURE sp_upsert_employee
(
    @employee_id INT = NULL,

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

        DECLARE @employee_code VARCHAR(20);

        DECLARE @next_number INT;

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
        -- VALIDATE MANAGER
        -- ONLY ADMIN OR MANAGER CAN BE MANAGER
        -- =====================================

        IF @manager_id IS NOT NULL
        BEGIN

            IF NOT EXISTS
            (
                SELECT 1
                FROM employees
                WHERE employee_id = @manager_id
                AND role_id IN (1,2)
            )
            BEGIN

                RAISERROR(
                    'Invalid manager_id. Selected employee is not a Manager or Admin.',
                    16,
                    1
                );

                ROLLBACK TRANSACTION;

                RETURN;

            END

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
        -- INSERT MODE
        -- =====================================

        IF (@employee_id IS NULL)
        BEGIN

            -- =================================
            -- MANAGER CODE GENERATION
            -- MGR2001 SERIES
            -- =================================

            IF @role_id = 2
            BEGIN

                SELECT
                    @next_number =
                    ISNULL(
                        MAX(
                            TRY_CAST(
                                SUBSTRING(employee_code,4,LEN(employee_code))
                                AS INT
                            )
                        ),
                        2000
                    )

                FROM employees
                WHERE employee_code LIKE 'MGR2%';


                SET @next_number = @next_number + 1;


                SET @employee_code =
                    'MGR' + CAST(@next_number AS VARCHAR);

            END


            -- =================================
            -- EMPLOYEE CODE GENERATION
            -- EMP1001 SERIES
            -- =================================

            ELSE IF @role_id = 3
            BEGIN

                SELECT
                    @next_number =
                    ISNULL(
                        MAX(
                            TRY_CAST(
                                SUBSTRING(employee_code,4,LEN(employee_code))
                                AS INT
                            )
                        ),
                        1000
                    )

                FROM employees
                WHERE employee_code LIKE 'EMP1%';


                SET @next_number = @next_number + 1;


                SET @employee_code =
                    'EMP' + CAST(@next_number AS VARCHAR);

            END


            -- =================================
            -- ADMIN CODE GENERATION
            -- ADMIN001 SERIES
            -- =================================

            ELSE IF @role_id = 1
            BEGIN

                SELECT
                    @next_number =
                    ISNULL(
                        MAX(
                            TRY_CAST(
                                SUBSTRING(employee_code,6,LEN(employee_code))
                                AS INT
                            )
                        ),
                        0
                    ) + 1

                FROM employees
                WHERE employee_code LIKE 'ADMIN%';


                SET @employee_code =
                    'ADMIN' +
                    RIGHT('000' + CAST(@next_number AS VARCHAR),3);

            END

            -- =====================================
-- PASSWORD VALIDATION
-- =====================================

IF @password_hash IS NULL
   OR LTRIM(RTRIM(@password_hash)) = ''
BEGIN

    RAISERROR(
        'Password is required for new employees.',
        16,
        1
    );

    ROLLBACK TRANSACTION;

    RETURN;

END


            -- =================================
            -- INSERT EMPLOYEE
            -- =================================

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


            -- =================================
            -- EMPLOYEE CODE WILL NOT CHANGE
            -- =================================

            UPDATE employees
SET
    first_name = @first_name,

    last_name = @last_name,

    email = @email,

    password_hash =
        CASE
            WHEN @password_hash IS NULL
                 OR LTRIM(RTRIM(@password_hash)) = ''
            THEN password_hash
            ELSE @password_hash
        END,

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

            'Employee saved successfully.' AS message,

            @employee_code AS employee_code;

    END TRY

    BEGIN CATCH

        ROLLBACK TRANSACTION;

        SELECT
            ERROR_MESSAGE() AS error_message;

    END CATCH

END;