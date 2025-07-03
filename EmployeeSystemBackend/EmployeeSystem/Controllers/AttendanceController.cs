using Azure.Core;
using EmployeeSystem.DTOs;
using EmployeeSystem.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace EmployeeSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttendanceController : ControllerBase
    {
        IAttendanceService attendanceService;
        public AttendanceController(IAttendanceService attendanceService_) 
        {
            attendanceService = attendanceService_;
        }

        [Authorize(Roles = "Admin, User")]
        [HttpGet("get/{employeeId}")]
        public async Task<ActionResult<List<AttendanceDto>>> GetAttendances(int employeeId)
        {
            var attendances = await attendanceService.GetAttendances(employeeId);
            if (attendances == null || attendances.Count == 0)
                return BadRequest("No Attendances Found");
            return Ok(attendances);
        }

        [Authorize(Roles = "Admin, User")]
        [HttpGet("today/{employeeId}")]
        public async Task<ActionResult<List<AttendanceDto>>> GetTodaysAttendance(int employeeId)
        {
            var checkIns = await attendanceService.GetTodaysAttendance(employeeId);
            if (checkIns is null || checkIns.Count == 0)
                return BadRequest("Didnt CheckIn Today");
            return Ok(checkIns);
        }

        [Authorize(Roles = "Admin, User")]
        [HttpPost("checkin/{employeeId}")]
        public async Task<IActionResult> CheckIn(int employeeId)
        {
            bool checkedIn = await attendanceService.CheckIn(employeeId);
            if (!checkedIn)
                return BadRequest("Already checked in");
            return Ok();
        }

        [Authorize(Roles = "Admin, User")]
        [HttpPost("checkout/{employeeId}")]
        public async Task<IActionResult> CheckOut(int employeeId)
        {
            bool checkedOut = await attendanceService.CheckOut(employeeId);
            if (!checkedOut)
                return BadRequest("You must wait atleast 2 hours before checking out");
            return Ok();
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("updateLeave/{employeeId}")]
        public async Task<IActionResult> UpdateLeave(int employeeId, [FromBody] UpdateLeaveDto request)
        {
            bool updated = await attendanceService.UpdateLeave(employeeId, request.allowed, DateOnly.FromDateTime(request.date));
            if (!updated)
                return BadRequest("No records found");
            return Ok();
        }

        [Authorize(Roles = "Admin, User")]
        [HttpGet("status/{employeeId}")]
        public async Task<ActionResult<StatusDto>> CheckStatus(int employeeId, [FromQuery] DateTime date)
        {
            var status = await attendanceService.CheckStatus(employeeId, DateOnly.FromDateTime(date));
            if (status is null)
                return BadRequest("No records found");
            return Ok(status);
        }
    }
}
