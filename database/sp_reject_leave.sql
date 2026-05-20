CREATE OR ALTER  PROCEDURE sp_reject_leave
(
    @leave_request_id INT,
    @manager_id INT,
    @manager_comments VARCHAR(MAX)
)
AS
BEGIN

    SET NOCOUNT ON;

    BEGIN TRY

        BEGIN TRANSACTION;

        DECLARE @employee_id INT;
        DECLARE @leave_type_id INT;
        DECLARE @total_days INT;

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
            RAISERROR('Invalid or inactive manager.', 16, 1);
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
            RAISERROR('Leave request not found.', 16, 1);
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
            RAISERROR('You are not authorized to reject this request.', 16, 1);
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
            RAISERROR('Only pending leave requests can be rejected.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END


        -- =====================================
        -- GET LEAVE DETAILS
        -- =====================================

        SELECT

            @employee_id = employee_id,

            @leave_type_id = leave_type_id,

            @total_days = total_days

        FROM leave_requests

        WHERE leave_request_id = @leave_request_id;


        -- =====================================
        -- REJECT LEAVE
        -- =====================================

        UPDATE leave_requests
        SET

            status = 'Rejected',

            approved_by = @manager_id,

            approved_at = GETDATE(),

            manager_comments = @manager_comments

        WHERE leave_request_id = @leave_request_id;


        -- =====================================
        -- RESTORE LEAVE BALANCE
        -- =====================================

        UPDATE employee_leave_balances
        SET

            used_leaves =
            used_leaves - @total_days,

            remaining_leaves =
            remaining_leaves + @total_days,

            updated_at = GETDATE()

        WHERE employee_id = @employee_id
        AND leave_type_id = @leave_type_id;


        COMMIT TRANSACTION;


        -- =====================================
        -- SUCCESS RESPONSE
        -- =====================================

        SELECT
            'Leave rejected successfully.' AS message;

    END TRY

    BEGIN CATCH

        ROLLBACK TRANSACTION;

        SELECT
            ERROR_MESSAGE() AS error_message;

    END CATCH

END;