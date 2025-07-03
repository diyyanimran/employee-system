namespace EmployeeSystem.DTOs
{
    public class AttendanceDto
    {
        public DateTime? CheckInTime { get; set; }
        public DateTime? CheckOutTime { get; set; }
        public bool Present { get; set; }
        public bool LeaveAllowed { get; set; }
    }
}
