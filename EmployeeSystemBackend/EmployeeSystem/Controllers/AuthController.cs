using EmployeeSystem.DTOs;
using EmployeeSystem.Interface;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private IAuthenticationService authService;
        public AuthController(IAuthenticationService auth_) 
        {
            authService = auth_;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] LoginInfoDto request)
        {
            bool accountMade = await authService.Signup(request);
            if (!accountMade)
                return BadRequest("Username already exists");

            return Created(string.Empty, new { message = "Signed up request queued" });
        }

        [HttpPost("login")]
        public async Task<ActionResult<TokenResponseDto>> Login([FromBody] LoginInfoDto request)
        {
            var response = await authService.Login(request);
            if (response is null)
                return BadRequest("Incorrect Username Or Password");

            if (response.accessToken == "")
                return BadRequest("Your account request is pending approval");

            return Ok(response);
        }

        [HttpGet("role/{employeeId}")]
        public async Task<ActionResult<string>> GetRole(int employeeId)
        {
            var toReturn = await authService.GetRole(employeeId);
            if (toReturn is null)
                return BadRequest("Role not found");
            return Ok(new { role = toReturn });
        }

        [HttpPost("requests")]
        public async Task<ActionResult<List<RequestDto>>> GetRequests()
        {
            var requests = await authService.GetRequests();
            if (requests.Count == 0)
                return BadRequest("No pending requests");
            return Ok(requests);
        }
        [HttpPost("approve")]
        public async Task<ActionResult> ApproveRequest([FromBody] RequestDto request)
        {
            bool found = await authService.ApproveRequest(request);
            if (!found)
                return BadRequest("Request not found");
            return Ok();
        }
        [HttpPost("reject")]
        public async Task<ActionResult> RejectRequest([FromBody] RequestDto request)
        {
            bool found = await authService.RejectRequest(request);
            if (!found)
                return BadRequest("Request not found");
            return Ok();
        }

        [HttpPost("refresh")]
        public async Task<ActionResult<TokenResponseDto>> RefreshTokens([FromBody] RefreshTokenRequestDto request)
        {
            for (int i = 0; i < 10; i++)
                Console.WriteLine("ReachingBackend");

            var result = await authService.RefreshTokensAsync(request.refreshToken);
            if (result is null || result.accessToken is null || result.refreshToken is null)
                return Unauthorized("Invalid Refresh Token");

            for (int i=0; i<10; i++)
                Console.WriteLine("RefreshedToken");
            return Ok(result);
        }
    }
}
