using System.ComponentModel.DataAnnotations;

namespace EmployeeSystem.Models
{
    public class WorkLog
    {
        [Key]
        public int Id { get; set; }
        public DayOfWeek Day { get; set; }
        public double Developing {  get; set; }
        public double Designing { get; set; }
        public double Fixing {  get; set; }

        public int EmployeeId { get; set; }
        public Employee Employee { get; set; } = null!;
    }
}
