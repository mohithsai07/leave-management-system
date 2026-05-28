using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

// =====================================
// CORS
// =====================================

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// =====================================
// CONTROLLERS
// =====================================

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

// =====================================
// JWT AUTHENTICATION
// =====================================

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,

                ValidateAudience = true,

                ValidateLifetime = true,

                ValidateIssuerSigningKey = true,

                ValidIssuer =
                    builder.Configuration["Jwt:Issuer"],

                ValidAudience =
                    builder.Configuration["Jwt:Audience"],

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(
                            builder.Configuration["Jwt:Key"] ?? ""
                        )
                    ),

                RoleClaimType = ClaimTypes.Role
            };
    });

// =====================================
// AUTHORIZATION
// =====================================

builder.Services.AddAuthorization();

var app = builder.Build();

// =====================================
// MIDDLEWARE
// =====================================

app.UseHttpsRedirection();

// Enable CORS

app.UseCors("AllowReactApp");

// IMPORTANT

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
