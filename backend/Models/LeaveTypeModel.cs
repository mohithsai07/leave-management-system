namespace LeaveManagementAPI.Models
{
    public class LeaveTypeModel
    {
        public int? LeaveTypeId { get; set; }

        public string? LeaveName { get; set; }

        public int TotalLeaves { get; set; }

        public string? Description { get; set; }

        public bool Status { get; set; }
    }
}
