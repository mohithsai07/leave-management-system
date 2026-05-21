using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;
using LeaveManagementAPI.Models;

namespace LeaveManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public EmployeeController(IConfiguration configuration)
        {
            _configuration = configuration;
        }


        // =========================================
        // GET DASHBOARD
        // =========================================

        [HttpGet("dashboard/{employeeId}")]
        public IActionResult GetDashboard(int employeeId)
        {
            List<object> dashboard = new List<object>();

            SqlConnection con = new SqlConnection(
                _configuration.GetConnectionString("DefaultConnection")
            );

            SqlCommand cmd = new SqlCommand(
                "sp_get_leave_dashboard",
                con
            );

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue(
                "@employee_id",
                employeeId
            );

            con.Open();

            SqlDataReader reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                dashboard.Add(new
                {
                    leave_type_id = reader["leave_type_id"],
                    leave_name = reader["leave_name"],
                    total_leaves = reader["total_leaves"],
                    used_leaves = reader["used_leaves"],
                    remaining_leaves = reader["remaining_leaves"],
                    year = reader["year"],
                    updated_at = reader["updated_at"]
                });
            }

            con.Close();

            return Ok(dashboard);
        }


        // =========================================
        // GET MY LEAVE REQUESTS
        // =========================================

        [HttpGet("my-leaves/{employeeId}")]
        public IActionResult GetMyLeaves(int employeeId)
        {
            List<object> leaves = new List<object>();

            SqlConnection con = new SqlConnection(
                _configuration.GetConnectionString("DefaultConnection")
            );

            SqlCommand cmd = new SqlCommand(
                "sp_get_my_leave_requests",
                con
            );

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue(
                "@employee_id",
                employeeId
            );

            con.Open();

            SqlDataReader reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                leaves.Add(new
                {
                    leave_request_id = reader["leave_request_id"],
                    leave_name = reader["leave_name"],
                    from_date = reader["from_date"],
                    to_date = reader["to_date"],
                    total_days = reader["total_days"],
                    reason = reader["reason"],
                    status = reader["status"],
                    applied_at = reader["applied_at"]
                });
            }

            con.Close();

            return Ok(leaves);
        }


        // =========================================
        // UPSERT LEAVE REQUEST
        // =========================================

        [HttpPost("upsert-leave")]
        public IActionResult UpsertLeave(
            LeaveRequestModel model
        )
        {
            SqlConnection con = new SqlConnection(
                _configuration.GetConnectionString("DefaultConnection")
            );

            SqlCommand cmd = new SqlCommand(
                "sp_upsert_leave_request",
                con
            );

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue(
                "@leave_request_id",
                model.LeaveRequestId ?? (object)DBNull.Value
            );

            cmd.Parameters.AddWithValue(
                "@employee_id",
                model.EmployeeId
            );

            cmd.Parameters.AddWithValue(
                "@leave_type_id",
                model.LeaveTypeId
            );

            cmd.Parameters.AddWithValue(
                "@from_date",
                model.FromDate
            );

            cmd.Parameters.AddWithValue(
                "@to_date",
                model.ToDate
            );

            cmd.Parameters.AddWithValue(
                "@reason",
                model.Reason ?? (object)DBNull.Value
            );

            cmd.Parameters.AddWithValue(
                "@notify_employee_id",
                model.NotifyEmployeeId ?? (object)DBNull.Value
            );

            con.Open();

            SqlDataReader reader = cmd.ExecuteReader();

            List<object> response = new List<object>();

            while (reader.Read())
            {
                response.Add(new
                {
                    message = reader["message"]
                });
            }

            con.Close();

            return Ok(response);
        }
    }
}