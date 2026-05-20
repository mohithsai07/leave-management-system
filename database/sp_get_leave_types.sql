CREATE PROCEDURE sp_get_leave_types
AS
BEGIN

    SET NOCOUNT ON;

    BEGIN TRY

        -- =====================================
        -- RETURN LEAVE TYPES
        -- =====================================

        SELECT

            leave_type_id,

            leave_name,

            total_leaves,

            description,

            status,

            created_at

        FROM leave_types

        ORDER BY leave_name ASC;

    END TRY

    BEGIN CATCH

        SELECT
            ERROR_MESSAGE() AS error_message;

    END CATCH

END;