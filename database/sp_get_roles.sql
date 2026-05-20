CREATE PROCEDURE sp_get_roles
AS
BEGIN

    SET NOCOUNT ON;

    BEGIN TRY

        -- =====================================
        -- RETURN ROLES
        -- =====================================

        SELECT

            role_id,

            role_name,

            created_at

        FROM roles

        ORDER BY role_name ASC;

    END TRY

    BEGIN CATCH

        SELECT
            ERROR_MESSAGE() AS error_message;

    END CATCH

END;