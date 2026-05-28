using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;
using LeaveManagementAPI.Models;

namespace LeaveManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Manager")]
    public class ManagerController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public ManagerController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // =========================================
        // GET TEAM LEAVES
        // =========================================

        [HttpGet("team-leaves")]
        public IActionResult GetTeamLeaves(
            [FromQuery] int? employeeId
        )
        {
            List<object> leaves = new List<object>();

            int managerId = Convert.ToInt32(
                User.FindFirst("employeeId")?.Value
            );

            SqlConnection con = new SqlConnection(
                _configuration.GetConnectionString("DefaultConnection")
            );

            SqlCommand cmd = new SqlCommand(
                "sp_get_team_leave_requests",
                con
            );

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue(
                "@manager_id",
                managerId
            );

            cmd.Parameters.AddWithValue(
                "@employee_id",
                (object?)employeeId ?? DBNull.Value
            );

            con.Open();

            SqlDataReader reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                leaves.Add(new
                {
                    leave_request_id = reader["leave_request_id"],

                    employee_id = reader["employee_id"],

                    employee_code = reader["employee_code"],

                    employee_name = reader["employee_name"],

                    department = reader["department"],

                    leave_name = reader["leave_name"],

                    from_date = reader["from_date"],

                    to_date = reader["to_date"],

                    total_days = reader["total_days"],

                    reason = reader["reason"],

                    status = reader["status"],

                    applied_at = reader["applied_at"],

                    manager_comments = reader["manager_comments"],

                    approved_at = reader["approved_at"]
                });
            }

            con.Close();

            return Ok(leaves);
        }

        // =========================================
        // GET PENDING LEAVES
        // =========================================

        [HttpGet("pending")]
        public IActionResult GetPendingLeaves()
        {
            List<object> pendingLeaves = new List<object>();

            int managerId = Convert.ToInt32(
                User.FindFirst("employeeId")?.Value
            );

            SqlConnection con = new SqlConnection(
                _configuration.GetConnectionString("DefaultConnection")
            );

            SqlCommand cmd = new SqlCommand(
                "sp_get_pending_leave_requests",
                con
            );

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue(
                "@manager_id",
                managerId
            );

            con.Open();

            SqlDataReader reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                pendingLeaves.Add(new
                {
                    leave_request_id = reader["leave_request_id"],

                    employee_id = reader["employee_id"],

                    employee_code = reader["employee_code"],

                    employee_name = reader["employee_name"],

                    department = reader["department"],

                    leave_name = reader["leave_name"],

                    from_date = reader["from_date"],

                    to_date = reader["to_date"],

                    total_days = reader["total_days"],

                    reason = reader["reason"],

                    applied_at = reader["applied_at"]
                });
            }

            con.Close();

            return Ok(pendingLeaves);
        }


        [HttpGet("employee-history/{employeeId}")]
        public IActionResult GetEmployeeLeaveHistory(
    int employeeId
)
        {
            List<object> leaves = new List<object>();

            int managerId = Convert.ToInt32(
                User.FindFirst("employeeId")?.Value
            );

            SqlConnection con = new SqlConnection(
                _configuration.GetConnectionString("DefaultConnection")
            );

            SqlCommand cmd = new SqlCommand(
                "sp_get_employee_leave_history",
                con
            );

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue(
                "@manager_id",
                managerId
            );

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
                    leave_request_id =
                        reader["leave_request_id"],

                    employee_name =
                        reader["employee_name"],

                    leave_name =
                        reader["leave_name"],

                    from_date =
                        reader["from_date"],

                    to_date =
                        reader["to_date"],

                    total_days =
                        reader["total_days"],

                    reason =
                        reader["reason"],

                    status =
                        reader["status"],

                    applied_at =
                        reader["applied_at"]
                });
            }

            con.Close();

            return Ok(leaves);
        }

        // =========================================
        // APPROVE LEAVE
        // =========================================

        [HttpPut("approve")]
        public IActionResult ApproveLeave(
            [FromBody] ApproveRejectModel model
        )
        {
            int managerId = Convert.ToInt32(
                User.FindFirst("employeeId")?.Value
            );

            SqlConnection con = new SqlConnection(
                _configuration.GetConnectionString("DefaultConnection")
            );

            SqlCommand cmd = new SqlCommand(
                "sp_approve_leave",
                con
            );

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue(
                "@leave_request_id",
                model.LeaveRequestId
            );

            // IMPORTANT:
            // Manager ID comes from JWT token
            cmd.Parameters.AddWithValue(
                "@manager_id",
                managerId
            );

            cmd.Parameters.AddWithValue(
                "@manager_comments",
                (object?)model.ManagerComments ?? DBNull.Value
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

        // =========================================
        // REJECT LEAVE
        // =========================================

        [HttpPut("reject")]
        public IActionResult RejectLeave(
            [FromBody] ApproveRejectModel model
        )
        {
            int managerId = Convert.ToInt32(
                User.FindFirst("employeeId")?.Value
            );

            SqlConnection con = new SqlConnection(
                _configuration.GetConnectionString("DefaultConnection")
            );

            SqlCommand cmd = new SqlCommand(
                "sp_reject_leave",
                con
            );

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue(
                "@leave_request_id",
                model.LeaveRequestId
            );

            // IMPORTANT:
            // Manager ID comes from JWT token
            cmd.Parameters.AddWithValue(
                "@manager_id",
                managerId
            );

            cmd.Parameters.AddWithValue(
                "@manager_comments",
                (object?)model.ManagerComments ?? DBNull.Value
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
