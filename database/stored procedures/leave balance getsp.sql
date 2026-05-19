
CREATE PROCEDURE sp_get_leave_balance
    @employee_id INT = NULL,
    @leave_type_id INT = NULL,
    @leave_year INT = NULL
AS
BEGIN

    SET NOCOUNT ON;

    SELECT
        lb.balance_id,

        e.employee_code,

        e.first_name + ' ' + e.last_name AS employee_name,

        d.department_name,

        lt.leave_name,

        lb.total_allocated,

        lb.used_days,

        lb.remaining_days,

        lb.leave_year

    FROM leave_balances lb

    INNER JOIN employees e
        ON lb.employee_id = e.employee_id

    INNER JOIN departments d
        ON e.department_id = d.department_id

    INNER JOIN leave_types lt
        ON lb.leave_type_id = lt.leave_type_id

    WHERE
        (@employee_id IS NULL OR lb.employee_id = @employee_id)
        AND
        (@leave_type_id IS NULL OR lb.leave_type_id = @leave_type_id)
        AND
        (@leave_year IS NULL OR lb.leave_year = @leave_year)

    ORDER BY e.employee_code, lt.leave_name;

END;
GO