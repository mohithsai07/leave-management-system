CREATE OR ALTER PROCEDURE sp_approve_leave
(
    @leave_request_id INT,
    @manager_id INT,
    @manager_comments VARCHAR(100) = NULL
)
AS
BEGIN

    SET NOCOUNT ON;

    BEGIN TRY

        BEGIN TRANSACTION;


        -- =====================================
        -- VALIDATE MANAGER
        -- =====================================

        IF NOT EXISTS
        (
            SELECT 1
            FROM employees
            WHERE employee_id = @manager_id
            AND status = 1
        )
        BEGIN

            RAISERROR(
                'Invalid or inactive manager.',
                16,
                1
            );

            ROLLBACK TRANSACTION;
            RETURN;

        END


        -- =====================================
        -- VALIDATE LEAVE REQUEST
        -- =====================================

        IF NOT EXISTS
        (
            SELECT 1
            FROM leave_requests
            WHERE leave_request_id = @leave_request_id
        )
        BEGIN

            RAISERROR(
                'Leave request not found.',
                16,
                1
            );

            ROLLBACK TRANSACTION;
            RETURN;

        END


        -- =====================================
        -- VALIDATE MANAGER ACCESS
        -- =====================================

        IF NOT EXISTS
        (
            SELECT 1
            FROM leave_requests lr

            INNER JOIN employees e
                ON lr.employee_id = e.employee_id

            WHERE lr.leave_request_id = @leave_request_id
            AND e.manager_id = @manager_id
        )
        BEGIN

            RAISERROR(
                'You are not authorized to approve this request.',
                16,
                1
            );

            ROLLBACK TRANSACTION;
            RETURN;

        END


        -- =====================================
        -- VALIDATE PENDING STATUS
        -- =====================================

        IF EXISTS
        (
            SELECT 1
            FROM leave_requests
            WHERE leave_request_id = @leave_request_id
            AND status <> 'Pending'
        )
        BEGIN

            RAISERROR(
                'Only pending leave requests can be approved.',
                16,
                1
            );

            ROLLBACK TRANSACTION;
            RETURN;

        END


        -- =====================================
        -- GET LEAVE DETAILS
        -- =====================================

        DECLARE @employee_id INT;
        DECLARE @leave_type_id INT;
        DECLARE @total_days INT;
        DECLARE @remaining_leaves INT;

        SELECT

            @employee_id = employee_id,

            @leave_type_id = leave_type_id,

            @total_days = total_days

        FROM leave_requests

        WHERE leave_request_id = @leave_request_id;


        -- =====================================
        -- CHECK CURRENT LEAVE BALANCE
        -- =====================================

        SELECT

            @remaining_leaves = remaining_leaves

        FROM employee_leave_balances

        WHERE employee_id = @employee_id
        AND leave_type_id = @leave_type_id;


        IF (@remaining_leaves < @total_days)
        BEGIN

            RAISERROR(
                'Insufficient remaining leave balance.',
                16,
                1
            );

            ROLLBACK TRANSACTION;
            RETURN;

        END


        -- =====================================
        -- APPROVE LEAVE
        -- =====================================

        UPDATE leave_requests
        SET

            status = 'Approved',

            approved_by = @manager_id,

            approved_at = GETDATE(),

            manager_comments = @manager_comments

        WHERE leave_request_id = @leave_request_id;


        -- =====================================
        -- UPDATE LEAVE BALANCE
        -- =====================================

        UPDATE employee_leave_balances
        SET
            -- total days -> new request(no.of days employee applied for leave)
            -- used leaves -> days employee used already  
            used_leaves =
                used_leaves + @total_days,

            remaining_leaves =
                remaining_leaves - @total_days,

            updated_at = GETDATE()

        WHERE employee_id = @employee_id
        AND leave_type_id = @leave_type_id;


        COMMIT TRANSACTION;


        -- =====================================
        -- SUCCESS RESPONSE
        -- =====================================

        SELECT

            1 AS success,

            'Leave approved successfully.' AS message;

    END TRY

    BEGIN CATCH

        ROLLBACK TRANSACTION;

        SELECT

            0 AS success,

            ERROR_MESSAGE() AS message;

    END CATCH

END;