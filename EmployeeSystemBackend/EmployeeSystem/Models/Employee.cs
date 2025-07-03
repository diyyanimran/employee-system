using System.ComponentModel.DataAnnotations;

namespace EmployeeSystem.Models
{
    public class Employee
    {
        [Key]
        public int Id { get; set; }
        public int Code { get; set; }
        public string Name  { get; set; } = string.Empty;
        public double TotalHours { get; set; }
        public double AverageHours { get; set; }
        public int TotalLeavesAllowed { get; set; }

        public User User { get; set; }

        public ICollection<WorkLog> WorkLogs { get; set; } = new List<WorkLog>();
        public ICollection<Attendance> Attendances {  get; set; } = new List<Attendance>();
    }
}

/*
    {
    "code": 212912,
        "name": "John Employee"
    },
    {
    "code": 182394,
        "name": "Jack Jobber"

    },
    {

    "code": 908923,
        "name": "Jamantha Servant"

    },
    {

    "code": 902849,
        "name": "Jebediah Worker"

    }
*/
