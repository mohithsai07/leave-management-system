namespace LeaveManagementAPI.Models
{
    public class LeaveRequestModel
    {
        public int? LeaveRequestId { get; set; }

        public int EmployeeId { get; set; }

        public int LeaveTypeId { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public string? Reason { get; set; }

        public int? NotifyEmployeeId { get; set; }
    }
}
