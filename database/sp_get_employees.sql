CREATE PROCEDURE sp_get_employees
AS
BEGIN

    SET NOCOUNT ON;

    BEGIN TRY

        -- =====================================
        -- RETURN EMPLOYEE DETAILS
        -- =====================================

        SELECT

            e.employee_id,

            e.employee_code,

            e.first_name,

            e.last_name,

            e.first_name + ' ' +
            e.last_name AS employee_name,

            e.email,

            e.department,

            e.role_id,

            r.role_name,

            e.manager_id,

            manager.first_name + ' ' +
            manager.last_name AS manager_name,

            e.status,

            e.created_at,

            e.updated_at

        FROM employees e

        INNER JOIN roles r
            ON e.role_id = r.role_id

        LEFT JOIN employees manager
            ON e.manager_id = manager.employee_id

        ORDER BY e.first_name ASC;

    END TRY

    BEGIN CATCH

        SELECT
            ERROR_MESSAGE() AS error_message;

    END CATCH

END;