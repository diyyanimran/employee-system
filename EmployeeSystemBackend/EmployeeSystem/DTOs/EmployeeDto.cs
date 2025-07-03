using System.ComponentModel.DataAnnotations;

namespace EmployeeSystem.DTOs
{
    public class EmployeeDto
    {
        public int Id { get; set; }
        public int Code { get; set; }
        public string Name  { get; set; } = string.Empty;
        public double TotalHours { get; set; }
        public double AverageHours { get; set; }
        public int DaysPresent { get; set; }
        public int LeavesTaken { get; set; }
    }
}
