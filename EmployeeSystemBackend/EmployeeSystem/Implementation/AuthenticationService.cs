using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using EmployeeSystem.Data;
using EmployeeSystem.DTOs;
using EmployeeSystem.Interface;
using EmployeeSystem.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace EmployeeSystem.Implementation
{
    public class AuthenticationService : IAuthenticationService
    {
        private EmployeeDbContext context;
        private IConfiguration config;
        public AuthenticationService(EmployeeDbContext _context, IConfiguration _config) 
        {
            context = _context;
            config = _config;
        }
        public async Task<bool> Signup(LoginInfoDto request)
        {
            var existingUser = await context.Logins.Where(x => x.Username == request.Username).FirstOrDefaultAsync();
            if ( existingUser != null)
                return false;

            var newUser = new User
            {
                Username = request.Username,
                Role = request.Role,
                Active = request.Role == "Admin" ? true : false,
                employeeId = null,
                Approved = false
            };
            newUser.PasswordHash = new PasswordHasher<User>().HashPassword(newUser, request.Password);

            context.Logins.Add(newUser);
            await context.SaveChangesAsync();
            return true;
        }
        public async Task<TokenResponseDto?> Login(LoginInfoDto request)
        {
            var user = await context.Logins.Where(x => x.Username == request.Username).FirstOrDefaultAsync();
            if (user is null || !user.Active)
                return null;

            if (!user.Approved)
                return new TokenResponseDto
                {
                    accessToken = "",
                    refreshToken = ""
                };

            if (new PasswordHasher<User>().VerifyHashedPassword(user, user.PasswordHash, request.Password) == PasswordVerificationResult.Success)
                return await CreateTokenResponse(user);
            else
                return null;
        }
        public async Task<string?> GetRole(int employeeId)
        {
            var role = await context.Logins
                .Where(l => l.employeeId == employeeId)
                .Select(l => l.Role)
                .FirstOrDefaultAsync();

            return role;
        }
        public async Task<List<RequestDto>> GetRequests()
        {
            return await context.Logins
                .Where(l => !l.Approved)
                .Select(l => new RequestDto
                {
                    Name = l.Username,
                    Role = l.Role
                })
                .ToListAsync();
        }
        public async Task<bool> ApproveRequest(RequestDto request)
        {
            var approved = await context.Logins
                .Where(l => l.Username == request.Name && l.Role == request.Role)
                .FirstOrDefaultAsync();
            if (approved is null)
                return false;

            approved.Approved = true;
            await context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> RejectRequest(RequestDto request)
        {
            var rejected = await context.Logins
                .Where(l => l.Username == request.Name && l.Role == request.Role)
                .FirstOrDefaultAsync();
            if (rejected is null)
                return false;

            rejected.Active = false;
            await context.SaveChangesAsync();
            return true;
        }
        public async Task<TokenResponseDto?> RefreshTokensAsync(string refreshToken)
        {
            var user = await ValidateRefreshToken(refreshToken);
            if (user is null)
                return null;

            return await CreateTokenResponse(user);
        }
        private async Task<TokenResponseDto> CreateTokenResponse(User user)
        {
            return new TokenResponseDto
            {
                accessToken = CreateToken(user),
                refreshToken = await GenerateAndSaveRefreshTokenAsync(user),
                employeeId = user.employeeId
            };
        }
        private string CreateToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey
            (
                Encoding.UTF8.GetBytes(config.GetValue<string>("AppSettings:Token")!)
            );

            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            var tokenDescriptor = new JwtSecurityToken
            (
                issuer: config.GetValue<string>("AppSettings:Issuer"),
                audience: config.GetValue<string>("AppSettings:Audience"),
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(10),
                signingCredentials: cred
            );

            return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
        }
        private async Task<string> GenerateAndSaveRefreshTokenAsync(User user)
        {
            user.RefreshToken = GenerateRefreshToken();
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(1);
            await context.SaveChangesAsync();
            return user.RefreshToken;
        }
        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
        private async Task<User?> ValidateRefreshToken(string refreshToken)
        {
            var user = await context.Logins.Where(x => x.RefreshToken == refreshToken).FirstOrDefaultAsync();
            if (user is null || user.RefreshTokenExpiryTime < DateTime.UtcNow)
                return null;

            return user;
        }

    }
}
