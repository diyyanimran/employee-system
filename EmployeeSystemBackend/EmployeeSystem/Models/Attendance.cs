using System.ComponentModel.DataAnnotations;

namespace EmployeeSystem.Models
{
    public class Attendance
    {
        [Key]
        public int Id { get; set; }
        public DateOnly Date { get; set; }
        public DateTime? CheckInTime { get; set; }
        public DateTime? CheckOutTime { get; set; }
        public bool Present { get; set; }
        public bool LeaveAllowed { get; set; }

        public int EmployeeId { get; set; }
        public Employee Employee { get; set; } = null!;
    }
}
