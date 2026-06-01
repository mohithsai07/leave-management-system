using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Text.RegularExpressions;
using LeaveManagementAPI.Models;
using BCrypt.Net;

namespace LeaveManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public AdminController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // =========================================
        // GET ALL EMPLOYEES
        // =========================================

        [HttpGet("employees")]
        public IActionResult GetEmployees()
        {
            List<object> employees = new List<object>();

            SqlConnection con = new SqlConnection(
                _configuration.GetConnectionString("DefaultConnection")
            );

            SqlCommand cmd = new SqlCommand(
                "sp_get_employees",
                con
            );

            cmd.CommandType = CommandType.StoredProcedure;

            con.Open();

            SqlDataReader reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                employees.Add(new
                {
                    employee_id = reader["employee_id"],
                    employee_code = reader["employee_code"],
                    first_name = reader["first_name"],
                    last_name = reader["last_name"],
                    employee_name = reader["employee_name"],
                    email = reader["email"],
                    department = reader["department"],
                    role_id = reader["role_id"],
                    role_name = reader["role_name"],
                    manager_id = reader["manager_id"],
                    manager_name = reader["manager_name"],
                    status = reader["status"],
                    created_at = reader["created_at"],
                    updated_at = reader["updated_at"]
                });
            }

            con.Close();

            return Ok(employees);
        }

        // =========================================
        // GET SINGLE EMPLOYEE
        // =========================================

        [HttpGet("employees/{id}")]
        public IActionResult GetEmployeeById(int id)
        {
            List<object> employees = new List<object>();

            SqlConnection con = new SqlConnection(
                _configuration.GetConnectionString("DefaultConnection")
            );

            SqlCommand cmd = new SqlCommand(
                "sp_get_employees",
                con
            );

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue(
                "@employee_id",
                id
            );

            con.Open();

            SqlDataReader reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                employees.Add(new
                {
                    employee_id = reader["employee_id"],
                    employee_code = reader["employee_code"],
                    first_name = reader["first_name"],
                    last_name = reader["last_name"],
                    employee_name = reader["employee_name"],
                    email = reader["email"],
                    department = reader["department"],
                    role_id = reader["role_id"],
                    role_name = reader["role_name"],
                    manager_id = reader["manager_id"],
                    manager_name = reader["manager_name"],
                    status = reader["status"],
                    created_at = reader["created_at"],
                    updated_at = reader["updated_at"]
                });
            }

            con.Close();

            return Ok(employees);
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
        // GET ROLES
        // =========================================

        [HttpGet("roles")]
        public IActionResult GetRoles()
        {
            List<object> roles = new List<object>();

            SqlConnection con = new SqlConnection(
                _configuration.GetConnectionString("DefaultConnection")
            );

            SqlCommand cmd = new SqlCommand(
                "sp_get_roles",
                con
            );

            cmd.CommandType = CommandType.StoredProcedure;

            con.Open();

            SqlDataReader reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                roles.Add(new
                {
                    role_id = reader["role_id"],
                    role_name = reader["role_name"],
                    created_at = reader["created_at"]
                });
            }

            con.Close();

            return Ok(roles);
        }

        // =========================================
        // GET ALL LEAVE REQUESTS
        // =========================================

        [HttpGet("all-leaves")]
        public IActionResult GetAllLeaves(
            [FromQuery] int? employeeId
        )
        {
            List<object> leaves = new List<object>();

            SqlConnection con = new SqlConnection(
                _configuration.GetConnectionString("DefaultConnection")
            );

            SqlCommand cmd = new SqlCommand(
                "sp_get_all_leave_requests",
                con
            );

            cmd.CommandType = CommandType.StoredProcedure;

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

                    approved_at = reader["approved_at"],

                    approved_by_name = reader["approved_by_name"]
                });
            }

            con.Close();

            return Ok(leaves);
        }

        // =========================================
        // UPSERT EMPLOYEE
        // =========================================

        [HttpPost("upsert-employee")]
        public IActionResult UpsertEmployee(
    [FromBody] EmployeeModel model
)
        {
            // =====================================
            // EMAIL VALIDATION
            // =====================================


            if (
                string.IsNullOrWhiteSpace(
                    model.Email
                )
                ||
                !Regex.IsMatch(
                    model.Email,
                    @"^[a-zA-Z0-9._%+-]+@company\.com$"
                )
            )
            {
                return BadRequest(new
                {
                    message =
                        "Only company email allowed."
                });
            }


            // =====================================
            // PASSWORD VALIDATION
            // =====================================

            // PASSWORD VALIDATION FOR NEW EMPLOYEE

            if (
                model.EmployeeId == null &&
                string.IsNullOrWhiteSpace(model.PasswordHash)
            )
            {
                return BadRequest(new
                {
                    message = "Password is required for new employees."
                });
            }

            SqlConnection con = new SqlConnection(
                _configuration.GetConnectionString("DefaultConnection")
            );

            SqlCommand cmd = new SqlCommand(
                "sp_upsert_employee",
                con
            );

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue(
                "@employee_id",
                model.EmployeeId ?? (object)DBNull.Value
            );

            cmd.Parameters.AddWithValue(
                "@first_name",
                model.FirstName
            );

            cmd.Parameters.AddWithValue(
                "@last_name",
                model.LastName ?? (object)DBNull.Value
            );

            cmd.Parameters.AddWithValue(
                "@email",
                model.Email
            );

            string passwordToStore =
          model.PasswordHash ?? "";

            if (
                !string.IsNullOrWhiteSpace(
                    passwordToStore
                )
                &&
                !passwordToStore.StartsWith(
                    "$2"
                )
            )
            {
                passwordToStore =
                    BCrypt.Net.BCrypt.HashPassword(
                        passwordToStore
                    );
            }

            cmd.Parameters.AddWithValue(
                "@password_hash",
                passwordToStore
            );

            cmd.Parameters.AddWithValue(
                "@role_id",
                model.RoleId
            );

            cmd.Parameters.AddWithValue(
                "@manager_id",
                model.ManagerId ?? (object)DBNull.Value
            );

            cmd.Parameters.AddWithValue(
                "@department",
                model.Department ?? (object)DBNull.Value
            );

            cmd.Parameters.AddWithValue(
                "@status",
                model.Status
            );

            con.Open();

            SqlDataReader reader = cmd.ExecuteReader();

            List<object> response = new List<object>();

            while (reader.Read())
            {
                response.Add(new
                {
                    message = reader["message"],
                    employee_code = reader["employee_code"]
                });
            }

            con.Close();

            return Ok(response);
        }


        [HttpPost("upsert-role")]
        public IActionResult UpsertRole(
    [FromBody] RoleModel role
)
        {
            try
            {
                using SqlConnection conn =
                    new SqlConnection(
                        _configuration.GetConnectionString(
                            "DefaultConnection"
                        )
                    );

                using SqlCommand cmd =
                    new SqlCommand(
                        "sp_upsert_role",
                        conn
                    );

                cmd.CommandType =
                    CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue(
                    "@role_id",
                    role.RoleId == 0
                        ? DBNull.Value
                        : role.RoleId
                );

                cmd.Parameters.AddWithValue(
                    "@role_name",
                    role.RoleName
                );

                conn.Open();

                cmd.ExecuteNonQuery();

                return Ok(
                    new
                    {
                        message =
                            "Role saved successfully"
                    }
                );
            }
            catch (Exception ex)
            {
                return BadRequest(
                    ex.Message
                );
            }
        }


        [HttpGet("employee/{id}/leave-balance")]
        public IActionResult GetEmployeeLeaveBalance(int id)
        {
            List<object> balances = new();

            SqlConnection con = new SqlConnection(
                _configuration.GetConnectionString(
                    "DefaultConnection"
                )
            );

            SqlCommand cmd = new SqlCommand(
                "sp_get_leave_dashboard",
                con
            );

            cmd.CommandType =
                CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue(
                "@employee_id",
                id
            );

            con.Open();

            SqlDataReader reader =
                cmd.ExecuteReader();

            while (reader.Read())
            {
                balances.Add(new
                {
                    leave_type_id =
                        reader["leave_type_id"],

                    leave_name =
                        reader["leave_name"],

                    total_leaves =
                        reader["total_leaves"],

                    used_leaves =
                        reader["used_leaves"],

                    remaining_leaves =
                        reader["remaining_leaves"],

                    note =
                        reader["note"],

                    year =
                        reader["year"],

                    updated_at =
                        reader["updated_at"]
                });
            }

            con.Close();

            return Ok(balances);
        }

        // =========================================
        // UPSERT LEAVE TYPE
        // =========================================

        [HttpPost("upsert-leave-type")]
        public IActionResult UpsertLeaveType(
    [FromBody] LeaveTypeModel model
)
        {
            SqlConnection con = new SqlConnection(
                _configuration.GetConnectionString("DefaultConnection")
            );

            SqlCommand cmd = new SqlCommand(
                "sp_upsert_leave_type",
                con
            );

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue(
                "@leave_type_id",
                model.LeaveTypeId ?? (object)DBNull.Value
            );

            cmd.Parameters.AddWithValue(
                "@leave_name",
                model.LeaveName
            );

            cmd.Parameters.AddWithValue(
                "@total_leaves",
                model.TotalLeaves
            );

            cmd.Parameters.AddWithValue(
                "@description",
                model.Description ?? (object)DBNull.Value
            );

            cmd.Parameters.AddWithValue(
                "@status",
                model.Status
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