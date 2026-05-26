var builder = WebApplication.CreateBuilder(args);
 
// 1. 🛡️ THE SECURITY BRIDGE (CORS)

// This tells the C# API to accept requests from your React Frontend

builder.Services.AddCors(options =>

{

    options.AddPolicy("AllowReactApp",

        policy =>

        {

            policy.WithOrigins("http://localhost:5173") // Your exact React port

                  .AllowAnyHeader()

                  .AllowAnyMethod();

        });

});
 
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();
 
var app = builder.Build();
 
// Configure the HTTP request pipeline.

if (app.Environment.IsDevelopment())

{

    app.UseSwagger();

    app.UseSwaggerUI();

}
 
app.UseHttpsRedirection();
 
// 2. 🚦 ACTIVATE CORS (Must be placed right here, before Authorization)

app.UseCors("AllowReactApp");
 
app.UseAuthorization();
 
app.MapControllers();
 
app.Run();
 