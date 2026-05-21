using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;
using LeaveManagementAPI.Models;

namespace LeaveManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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

        [HttpGet("team-leaves/{managerId}")]
        public IActionResult GetTeamLeaves(int managerId)
        {
            List<object> leaves = new List<object>();

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
                    applied_at = reader["applied_at"]
                });
            }

            con.Close();

            return Ok(leaves);
        }


        // =========================================
        // GET PENDING LEAVES
        // =========================================

        [HttpGet("pending/{managerId}")]
        public IActionResult GetPendingLeaves(int managerId)
        {
            List<object> pendingLeaves = new List<object>();

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


        // =========================================
        // APPROVE LEAVE
        // =========================================

        [HttpPut("approve")]
        public IActionResult ApproveLeave(
            ApproveRejectModel model
        )
        {
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

            cmd.Parameters.AddWithValue(
                "@manager_id",
                model.ManagerId
            );

            cmd.Parameters.AddWithValue(
                "@manager_comments",
                model.ManagerComments ?? (object)DBNull.Value
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


        // =========================================
        // REJECT LEAVE
        // =========================================

        [HttpPut("reject")]
        public IActionResult RejectLeave(
            ApproveRejectModel model
        )
        {
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

            cmd.Parameters.AddWithValue(
                "@manager_id",
                model.ManagerId
            );

            cmd.Parameters.AddWithValue(
                "@manager_comments",
                model.ManagerComments ?? (object)DBNull.Value
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