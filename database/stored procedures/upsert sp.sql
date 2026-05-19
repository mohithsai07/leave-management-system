CREATE OR ALTER PROCEDURE sp_upsert_leave_balance
(
    @employee_id INT,
    @leave_type_id INT,
    @total_allocated DECIMAL(5,2),
    @used_days DECIMAL(5,2),
    @leave_year INT
)
AS
BEGIN
    
    SET NOCOUNT ON;


    BEGIN TRY



        BEGIN TRANSACTION;


       

        -- Check if allocated leave is negative
        IF @total_allocated < 0
        BEGIN
            RAISERROR(
                'Total allocated leave cannot be negative.',
                16,
                1
            );
            RETURN;
        END


        -- Check if used leave is negative
        IF @used_days < 0
        BEGIN
            RAISERROR(
                'Used leave days cannot be negative.',
                16,
                1
            );
            RETURN;
        END


        -- Check if used leave exceeds allocated leave
        IF @used_days > @total_allocated
        BEGIN
            RAISERROR(
                'Used leave days cannot exceed allocated leave.',
                16,
                1
            );
            RETURN;
        END


        /* 
           UPSERT LOGIC SECTION
         */

        -- Check if leave balance record already exists
        IF EXISTS
        (
            SELECT 1
            FROM leave_balances
            WHERE employee_id = @employee_id
              AND leave_type_id = @leave_type_id
              AND leave_year = @leave_year
        )

        BEGIN

            /* 
               UPDATE EXISTING RECORD
             */

            UPDATE leave_balances
            SET
                total_allocated = @total_allocated,
                used_days = @used_days
            WHERE employee_id = @employee_id
              AND leave_type_id = @leave_type_id
              AND leave_year = @leave_year;


            PRINT 'Existing leave balance updated successfully.';

        END

        ELSE

        BEGIN

            /* 
               INSERT NEW RECORD
             */

            INSERT INTO leave_balances
            (
                employee_id,
                leave_type_id,
                total_allocated,
                used_days,
                leave_year
            )
            VALUES
            (
                @employee_id,
                @leave_type_id,
                @total_allocated,
                @used_days,
                @leave_year
            );


            PRINT 'New leave balance inserted successfully.';

        END



        COMMIT TRANSACTION;

    END TRY


   

    BEGIN CATCH

    

        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;


        PRINT 'Error occurred while processing leave balance.';

        PRINT ERROR_MESSAGE();

    END CATCH

END;
GO