using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;
using LeaveManagementAPI.Models;

namespace LeaveManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Employee")]
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

        [HttpGet("dashboard")]
        public IActionResult GetDashboard()
        {
            List<object> dashboard = new List<object>();

            int employeeId = Convert.ToInt32(
                User.FindFirst("employeeId")?.Value
            );

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

                    note = reader["note"],

                    year = reader["year"],

                    updated_at = reader["updated_at"],

                    updated_date = reader["updated_date"],

                    updated_time = reader["updated_time"]
                });
            }

            con.Close();

            return Ok(dashboard);
        }

        // =========================================
        // GET MY LEAVE REQUESTS
        // =========================================

        [HttpGet("my-leaves")]
        public IActionResult GetMyLeaves()
        {
            List<object> leaves = new List<object>();

            int employeeId = Convert.ToInt32(
                User.FindFirst("employeeId")?.Value
            );

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
        // GET LEAVE TYPES
        // =========================================

        [HttpGet("leave-types")]
        public IActionResult GetLeaveTypes()
        {
            List<object> leaveTypes = new List<object>();

            SqlConnection con = new SqlConnection(
                _configuration.GetConnectionString("DefaultConnection")
            );

            SqlCommand cmd = new SqlCommand(
                "sp_get_leave_types",
                con
            );

            cmd.CommandType = CommandType.StoredProcedure;

            con.Open();

            SqlDataReader reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                leaveTypes.Add(new
                {
                    leave_type_id = reader["leave_type_id"],

                    leave_name = reader["leave_name"],

                    total_leaves = reader["total_leaves"],

                    description = reader["description"],

                    status = reader["status"],

                    created_at = reader["created_at"]
                });
            }

            con.Close();

            return Ok(leaveTypes);
        }

        // =========================================
        // UPSERT LEAVE REQUEST
        // =========================================

        [HttpPost("upsert-leave")]
        public IActionResult UpsertLeave(
            [FromBody] LeaveRequestModel model
        )
        {
            int employeeId = Convert.ToInt32(
                User.FindFirst("employeeId")?.Value
            );

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
                (object?)model.LeaveRequestId ?? DBNull.Value
            );

            // Employee ID from JWT
            cmd.Parameters.AddWithValue(
                "@employee_id",
                employeeId
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
                (object?)model.Reason ?? DBNull.Value
            );

            cmd.Parameters.AddWithValue(
                "@notify_employee_id",
                (object?)model.NotifyEmployeeId ?? DBNull.Value
            );

            con.Open();

            SqlDataReader reader = cmd.ExecuteReader();

            List<object> response = new List<object>();

            while (reader.Read())
            {
                response.Add(new
                {
                    message = reader[0]
                });
            }

            con.Close();

            return Ok(response);
        }
    }
}
