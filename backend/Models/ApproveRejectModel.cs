namespace LeaveManagementAPI.Models
{
    public class ApproveRejectModel
    {
        public int LeaveRequestId { get; set; }

        public int ManagerId { get; set; }

        public string? ManagerComments { get; set; }
    }
}
