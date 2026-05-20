CREATE PROCEDURE sp_get_leave_dashboard
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
        -- RETURN LEAVE DASHBOARD
        -- =====================================

        SELECT

            lt.leave_type_id,

            lt.leave_name,

            elb.total_leaves,

            elb.used_leaves,

            elb.remaining_leaves,

            elb.year,

            elb.updated_at

        FROM employee_leave_balances elb

        INNER JOIN leave_types lt
            ON elb.leave_type_id = lt.leave_type_id

        WHERE elb.employee_id = @employee_id

        ORDER BY lt.leave_name;

    END TRY

    BEGIN CATCH

        SELECT
            ERROR_MESSAGE() AS error_message;

    END CATCH

END;