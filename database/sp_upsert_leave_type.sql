--ADMIN SP

CREATE OR ALTER  PROCEDURE sp_upsert_leave_type
(
    @leave_type_id INT = NULL,
    @leave_name VARCHAR(100),
    @total_leaves INT,
    @description VARCHAR(100) = NULL,
    @status BIT = 1
)
AS
BEGIN

    SET NOCOUNT ON;

    BEGIN TRY

        BEGIN TRANSACTION;

        DECLARE @new_leave_type_id INT;

        -- =====================================
        -- VALIDATE TOTAL LEAVES
        -- =====================================

        IF (@total_leaves < 0)
        BEGIN
            RAISERROR('Total leaves cannot be negative.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END


        -- =====================================
        -- CHECK DUPLICATE LEAVE NAME
        -- =====================================

        IF EXISTS
        (
            SELECT 1
            FROM leave_types
            WHERE leave_name = @leave_name
            AND (
                    @leave_type_id IS NULL
                    OR leave_type_id <> @leave_type_id
                )
        )
        BEGIN
            RAISERROR('Leave type already exists.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END


        -- =====================================
        -- INSERT MODE
        -- =====================================

        IF (@leave_type_id IS NULL)
        BEGIN

            INSERT INTO leave_types
            (
                leave_name,
                total_leaves,
                description,
                status,
                created_at
            )
            VALUES
            (
                @leave_name,
                @total_leaves,
                @description,
                @status,
                GETDATE()
            );

            --stores last inserted value
            SET @new_leave_type_id = SCOPE_IDENTITY();


            -- =================================
            -- AUTO CREATE BALANCES
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

                employee_id,

                @new_leave_type_id,

                @total_leaves,

                0,

                @total_leaves,

                YEAR(GETDATE()),

                GETDATE()

            FROM employees

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
                FROM leave_types
                WHERE leave_type_id = @leave_type_id
            )
            BEGIN
                RAISERROR('Leave type not found.', 16, 1);
                ROLLBACK TRANSACTION;
                RETURN;
            END


            UPDATE leave_types
            SET

                leave_name = @leave_name,

                total_leaves = @total_leaves,

                description = @description,

                status = @status

            WHERE leave_type_id = @leave_type_id;


            -- =================================
            -- UPDATE EMPLOYEE BALANCES
            -- =================================

            UPDATE employee_leave_balances
            SET

                total_leaves = @total_leaves,

                remaining_leaves =
                @total_leaves - used_leaves,

                updated_at = GETDATE()

            WHERE leave_type_id = @leave_type_id;

        END


        COMMIT TRANSACTION;


        -- =====================================
        -- SUCCESS RESPONSE
        -- =====================================

        SELECT
            'Leave type saved successfully.' AS message;

    END TRY

    BEGIN CATCH

        ROLLBACK TRANSACTION;

        SELECT
            ERROR_MESSAGE() AS error_message;

    END CATCH

END;