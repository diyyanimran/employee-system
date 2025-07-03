using EmployeeSystem.DTOs;

namespace EmployeeSystem.Interface
{
    public interface IAuthenticationService
    {
        public Task<bool> Signup(LoginInfoDto request);
        public Task<TokenResponseDto?> Login(LoginInfoDto request);
        public Task<List<RequestDto>> GetRequests();
        public Task<string?> GetRole(int employeeId);
        public Task<bool> ApproveRequest(RequestDto request);
        public Task<bool> RejectRequest(RequestDto request);
        public Task<TokenResponseDto?> RefreshTokensAsync(string refreshToken);
    }
}
