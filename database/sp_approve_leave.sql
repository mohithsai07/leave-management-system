CREATE PROCEDURE sp_approve_leave
(
    @leave_request_id INT,
    @manager_id INT,
    @manager_comments VARCHAR(MAX) = NULL
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
            RAISERROR('You are not authorized to approve this request.', 16, 1);
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
            RAISERROR('Only pending leave requests can be approved.', 16, 1);
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


        COMMIT TRANSACTION;


        -- =====================================
        -- SUCCESS RESPONSE
        -- =====================================

        SELECT
            'Leave approved successfully.' AS message;

    END TRY

    BEGIN CATCH

        ROLLBACK TRANSACTION;

        SELECT
            ERROR_MESSAGE() AS error_message;

    END CATCH

END;