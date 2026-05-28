CREATE OR ALTER PROCEDURE sp_upsert_leave_request
(
    @leave_request_id INT = NULL,
    @employee_id INT,
    @leave_type_id INT,
    @from_date DATE,
    @to_date DATE,
    @reason VARCHAR(100) = NULL,
    @notify_employee_id INT = NULL
)
AS
BEGIN

    SET NOCOUNT ON;

    BEGIN TRY

        BEGIN TRANSACTION;

        DECLARE @total_days INT;
        DECLARE @remaining_leaves INT;

        -- =====================================
        -- VALIDATE EMPLOYEE
        -- =====================================

        IF NOT EXISTS
        (
            SELECT 1
            FROM employees
            WHERE employee_id = @employee_id
            AND status = 1
        )
        BEGIN

            RAISERROR(
                'Invalid employee.',
                16,
                1
            );

            ROLLBACK TRANSACTION;

            RETURN;

        END


        -- =====================================
        -- VALIDATE DATES
        -- =====================================

        IF (@from_date > @to_date)
        BEGIN

            RAISERROR(
                'From date cannot be greater than To date.',
                16,
                1
            );

            ROLLBACK TRANSACTION;

            RETURN;

        END


        -- =====================================
        -- PREVENT PAST DATE LEAVES
        -- =====================================

        IF (@from_date < CAST(GETDATE() AS DATE))
        BEGIN

            RAISERROR(
                'Cannot apply leave for past dates.',
                16,
                1
            );

            ROLLBACK TRANSACTION;

            RETURN;

        END


        -- =====================================
        -- CALCULATE TOTAL DAYS
        -- =====================================

        SET @total_days =
        DATEDIFF(
            DAY,
            @from_date,
            @to_date
        ) + 1;


        -- =====================================
        -- CHECK OVERLAPPING LEAVES
        -- =====================================

        IF EXISTS
        (
            SELECT 1
            FROM leave_requests
            WHERE employee_id = @employee_id
            AND status IN ('Pending', 'Approved')
            AND
            (
                @from_date BETWEEN from_date AND to_date
                OR
                @to_date BETWEEN from_date AND to_date
                OR
                from_date BETWEEN @from_date AND @to_date
            )
            AND
            (
                @leave_request_id IS NULL
                OR leave_request_id <> @leave_request_id
            )
        )
        BEGIN

            RAISERROR(
                'Overlapping leave request already exists.',
                16,
                1
            );

            ROLLBACK TRANSACTION;

            RETURN;

        END


        -- =====================================
        -- GET REMAINING LEAVES
        -- =====================================

        SELECT
            @remaining_leaves = remaining_leaves
        FROM employee_leave_balances
        WHERE employee_id = @employee_id
        AND leave_type_id = @leave_type_id;


        -- =====================================
        -- VALIDATE LEAVE BALANCE
        -- =====================================

        IF (@remaining_leaves IS NULL)
        BEGIN

            RAISERROR(
                'Leave balance not assigned.',
                16,
                1
            );

            ROLLBACK TRANSACTION;

            RETURN;

        END


        IF (@remaining_leaves < @total_days)
        BEGIN

            RAISERROR(
                'Exceeding number of leaves.',
                16,
                1
            );

            ROLLBACK TRANSACTION;

            RETURN;

        END


        -- =====================================
        -- INSERT MODE
        -- =====================================

        IF (@leave_request_id IS NULL)
        BEGIN

            INSERT INTO leave_requests
            (
                employee_id,
                leave_type_id,
                from_date,
                to_date,
                total_days,
                reason,
                notify_employee_id,
                status,
                applied_at
            )
            VALUES
            (
                @employee_id,
                @leave_type_id,
                @from_date,
                @to_date,
                @total_days,
                @reason,
                @notify_employee_id,
                'Pending',
                GETDATE()
            );

        END


        -- =====================================
        -- UPDATE MODE
        -- =====================================

        ELSE
        BEGIN

            IF NOT EXISTS
            (
                SELECT 1
                FROM leave_requests
                WHERE leave_request_id = @leave_request_id
                AND employee_id = @employee_id
                AND status = 'Pending'
            )
            BEGIN

                RAISERROR(
                    'Only pending leave requests can be edited.',
                    16,
                    1
                );

                ROLLBACK TRANSACTION;

                RETURN;

            END


            UPDATE leave_requests
            SET
                leave_type_id = @leave_type_id,
                from_date = @from_date,
                to_date = @to_date,
                total_days = @total_days,
                reason = @reason,
                notify_employee_id = @notify_employee_id

            WHERE leave_request_id = @leave_request_id;

        END


        -- =====================================
        -- COMMIT
        -- =====================================

        COMMIT TRANSACTION;


        -- =====================================
        -- SUCCESS RESPONSE
        -- =====================================

        SELECT
            'Success' AS message;

    END TRY

    BEGIN CATCH

        ROLLBACK TRANSACTION;

        SELECT
            ERROR_MESSAGE() AS error_message;

    END CATCH

END;