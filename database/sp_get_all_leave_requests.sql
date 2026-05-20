CREATE OR ALTER  PROCEDURE sp_get_all_leave_requests
AS
BEGIN

    SET NOCOUNT ON;

    BEGIN TRY

        -- =====================================
        -- RETURN ALL LEAVE REQUESTS
        -- =====================================

        SELECT

            lr.leave_request_id,

            e.employee_id,

            e.employee_code,

            e.first_name + ' ' +
            e.last_name AS employee_name,

            e.department,

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

        INNER JOIN employees e
            ON lr.employee_id = e.employee_id

        INNER JOIN leave_types lt
            ON lr.leave_type_id = lt.leave_type_id

        LEFT JOIN employees approver
            ON lr.approved_by = approver.employee_id

        ORDER BY lr.applied_at DESC;

    END TRY

    BEGIN CATCH

        SELECT
            ERROR_MESSAGE() AS error_message;

    END CATCH

END;