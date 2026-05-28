using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
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
            try
            {
                // =====================================
                // EMAIL VALIDATION
                // =====================================

                if (!Regex.IsMatch(
                    model.Email ?? "",
                    @"^[a-zA-Z0-9._%+-]+@company\.com$"
                ))
                {
                    return BadRequest(new
                    {
                        message = "Only company email is allowed."
                    });
                }

                SqlConnection con = new SqlConnection(
                    _configuration.GetConnectionString(
                        "DefaultConnection"
                    )
                );

                SqlCommand cmd = new SqlCommand(
                    "sp_login_employee",
                    con
                );

                cmd.CommandType =
                    CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue(
                    "@email",
                    model.Email ?? ""
                );

                cmd.Parameters.AddWithValue(
                    "@password_hash",
                    model.PasswordHash ?? ""
                );

                con.Open();

                SqlDataReader reader =
                    cmd.ExecuteReader();

                if (!reader.Read())
                {
                    con.Close();

                    return Unauthorized(new
                    {
                        message =
                            "Invalid email or password."
                    });
                }

                // =====================================
                // FETCH EMPLOYEE DETAILS
                // =====================================

                int employeeId = Convert.ToInt32(
                    reader["employee_id"]
                );

                string roleName =
                    reader["role_name"]?.ToString()
                    ?? "";

                string firstName =
                    reader["first_name"]?.ToString()
                    ?? "";

                string lastName =
                    reader["last_name"]?.ToString()
                    ?? "";

                string email =
                    reader["email"]?.ToString()
                    ?? "";

                // =====================================
                // CREATE JWT TOKEN
                // =====================================

                var claims = new[]
                {
                    new Claim(
                        "employeeId",
                        employeeId.ToString()
                    ),

                    new Claim(
                        ClaimTypes.Role,
                        roleName
                    ),

                    new Claim(
                        ClaimTypes.Email,
                        email
                    )
                };

                var key = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(
                        _configuration["Jwt:Key"] ?? ""
                    )
                );

                var creds = new SigningCredentials(
                    key,
                    SecurityAlgorithms.HmacSha256
                );

                var token = new JwtSecurityToken(
                    issuer:
                        _configuration["Jwt:Issuer"],

                    audience:
                        _configuration["Jwt:Audience"],

                    claims: claims,

                    expires:
                        DateTime.Now.AddHours(8),

                    signingCredentials: creds
                );

                string jwtToken =
                    new JwtSecurityTokenHandler()
                        .WriteToken(token);

                con.Close();

                // =====================================
                // RETURN RESPONSE
                // =====================================

                return Ok(new
                {
                    employee_id = employeeId,

                    first_name = firstName,

                    last_name = lastName,

                    email = email,

                    role_name = roleName,

                    token = jwtToken
                });
            }

            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = ex.Message
                });
            }
        }
    }
}
