
CREATE PROCEDURE sp_get_leave_requests
    @employee_id INT = NULL,
    @status NVARCHAR(20) = NULL
AS
BEGIN

    SET NOCOUNT ON;

    SELECT
        lr.leave_request_id,

        e.employee_code,

        e.first_name + ' ' + e.last_name AS employee_name,

        d.department_name,

        lt.leave_name,

        lr.start_date,
        lr.end_date,
        lr.total_days,

        lr.reason,

        lr.status,

        a.first_name + ' ' + a.last_name AS approved_by,

        lr.approved_at,

        lr.remarks,

        lr.applied_at

    FROM leave_requests lr

    INNER JOIN employees e
        ON lr.employee_id = e.employee_id

    INNER JOIN departments d
        ON e.department_id = d.department_id

    INNER JOIN leave_types lt
        ON lr.leave_type_id = lt.leave_type_id

    LEFT JOIN employees a
        ON lr.approved_by = a.employee_id

    WHERE
        (@employee_id IS NULL OR lr.employee_id = @employee_id)
        AND
        (@status IS NULL OR lr.status = @status)

    ORDER BY lr.applied_at DESC;

END;
GO
