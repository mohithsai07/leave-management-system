using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;
using LeaveManagementAPI.Models;

namespace LeaveManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public AuthController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("login")]
        public IActionResult Login(LoginModel model)
        {
            List<object> employee = new List<object>();

            SqlConnection con = new SqlConnection(
                _configuration.GetConnectionString("DefaultConnection")
            );

            SqlCommand cmd = new SqlCommand(
                "sp_login_employee",
                con
            );

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@email", model.Email);

            cmd.Parameters.AddWithValue(
                "@password_hash",
                model.PasswordHash
            );

            con.Open();

            SqlDataReader reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                employee.Add(new
                {
                    employee_id = reader["employee_id"],
                    employee_code = reader["employee_code"],
                    first_name = reader["first_name"],
                    last_name = reader["last_name"],
                    email = reader["email"],
                    department = reader["department"],
                    role_id = reader["role_id"],
                    role_name = reader["role_name"]
                });
            }

            con.Close();

            return Ok(employee);
        }
    }
}