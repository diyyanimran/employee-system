using System.ComponentModel.DataAnnotations;

namespace EmployeeSystem.Models
{
    public class User
    {
        [Key]
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string? RefreshToken { get; set; } 
        public DateTime? RefreshTokenExpiryTime { get; set; }
        public bool Active { get; set; }
        public bool Approved { get; set; }

        public Employee Employee { get; set; }
        public int? employeeId { get; set; }
    }
}
