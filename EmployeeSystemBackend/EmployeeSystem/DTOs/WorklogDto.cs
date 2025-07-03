using System.ComponentModel.DataAnnotations;

namespace EmployeeSystem.DTOs
{
    public class WorklogDto
    {
        public string Day { get; set; } = string.Empty;
        public double Developing {  get; set; }
        public double Designing { get; set; }
        public double Fixing {  get; set; }
    }
}
