namespace EmployeeSystem.DTOs
{
    public class TokenResponseDto
    {
        public required string accessToken { get; set; }
        public required string refreshToken { get; set; }

        public int? employeeId { get; set; }
    }
}
