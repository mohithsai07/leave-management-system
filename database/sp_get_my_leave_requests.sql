--EMPLOYEE SP TO GET THEIR LEAVE REQUEST

CREATE OR ALTER  PROCEDURE sp_get_my_leave_requests
(
    @employee_id INT
)
AS
BEGIN

    SET NOCOUNT ON;

    BEGIN TRY

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
            RAISERROR('Invalid or inactive employee.', 16, 1);
            RETURN;
        END


        -- =====================================
        -- RETURN LEAVE HISTORY
        -- =====================================

        SELECT

            lr.leave_request_id,

            lt.leave_name,

            lr.from_date,

            lr.to_date,

            lr.total_days,

            lr.reason,

            lr.status,

            lr.applied_at,

            lr.manager_comments,

            lr.approved_at,

            approver.first_name + ' ' +
            approver.last_name AS approved_by_name

        FROM leave_requests lr

        INNER JOIN leave_types lt
            ON lr.leave_type_id = lt.leave_type_id

        LEFT JOIN employees approver
            ON lr.approved_by = approver.employee_id

        WHERE lr.employee_id = @employee_id

        ORDER BY lr.applied_at DESC;

    END TRY

    BEGIN CATCH

        SELECT
            ERROR_MESSAGE() AS error_message;

    END CATCH

END;