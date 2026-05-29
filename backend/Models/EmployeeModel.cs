namespace LeaveManagementAPI.Models
{
    public class EmployeeModel
    {
        public int? EmployeeId { get; set; }

        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public string? Email { get; set; }

        public string? PasswordHash { get; set; }

        public int RoleId { get; set; }

        public int? ManagerId { get; set; }

        public string? Department { get; set; }

        public bool Status { get; set; }
    }
}