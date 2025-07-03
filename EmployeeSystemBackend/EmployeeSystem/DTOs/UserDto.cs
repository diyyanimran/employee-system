using System.ComponentModel.DataAnnotations;

namespace EmployeeSystem.DTOs
{
    public class UserDto
    {
        [Key]
        public string username { get; set; } = string.Empty;
        public string passwordHash { get; set; } = string.Empty;
        public string role { get; set; } = string.Empty;
        public string? refreshToken { get; set; }
        public DateTime? refreshTokenExpiryTime { get; set; }
    }
}
