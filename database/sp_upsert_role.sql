CREATE OR ALTER PROCEDURE sp_upsert_role
(
    @role_id INT = NULL,
    @role_name VARCHAR(100)
)
AS
BEGIN

    SET NOCOUNT ON;

    BEGIN TRY

        BEGIN TRANSACTION;

        -- =====================================
        -- VALIDATE ROLE NAME
        -- =====================================

        IF EXISTS
        (
            SELECT 1
            FROM roles
            WHERE role_name = @role_name
            AND
            (
                @role_id IS NULL
                OR role_id <> @role_id
            )
        )
        BEGIN

            RAISERROR(
                'Role already exists.',
                16,
                1
            );

            ROLLBACK TRANSACTION;

            RETURN;

        END

        -- =====================================
        -- INSERT
        -- =====================================

        IF @role_id IS NULL
        BEGIN

            INSERT INTO roles
            (
                role_name,
                created_at
            )
            VALUES
            (
                @role_name,
                GETDATE()
            );

        END

        -- =====================================
        -- UPDATE
        -- =====================================

        ELSE
        BEGIN

            UPDATE roles
            SET
                role_name = @role_name
            WHERE role_id = @role_id;

        END

        COMMIT TRANSACTION;

        SELECT
            1 AS success,
            'Role saved successfully'
            AS message;

    END TRY

    BEGIN CATCH

        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        THROW;

    END CATCH

END