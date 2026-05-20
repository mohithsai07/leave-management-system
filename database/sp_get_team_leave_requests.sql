CREATE PROCEDURE sp_get_team_leave_requests
(
    @manager_id INT
)
AS
BEGIN

    SET NOCOUNT ON;

    BEGIN TRY

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
            RETURN;
        END


        -- =====================================
        -- RETURN TEAM LEAVE REQUESTS
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

            lr.approved_at

        FROM leave_requests lr

        INNER JOIN employees e
            ON lr.employee_id = e.employee_id

        INNER JOIN leave_types lt
            ON lr.leave_type_id = lt.leave_type_id

        WHERE e.manager_id = @manager_id

        ORDER BY lr.applied_at DESC;

    END TRY

    BEGIN CATCH

        SELECT
            ERROR_MESSAGE() AS error_message;

    END CATCH

END;