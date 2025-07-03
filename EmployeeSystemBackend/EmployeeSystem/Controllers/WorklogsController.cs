using EmployeeSystem.DTOs;
using EmployeeSystem.Interface;
using EmployeeSystem.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorklogsController : ControllerBase
    {
        IWorklogService worklogService;
        public WorklogsController(IWorklogService worklogService_) 
        {
            worklogService = worklogService_;
        }

        [Authorize(Roles = "Admin, User")]
        [HttpGet("get/{employeeId}")]
        public async Task<ActionResult<List<WorklogDto>>> getWorklogs(int employeeId)
        {
            var worklogs = await worklogService.getWorklogs(employeeId);
            if (worklogs is null || worklogs.Count == 0)
                return BadRequest("No Worklogs for this employee");

            return Ok(worklogs);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("add/{employeeId}")]
        public async Task<IActionResult> addWorklog([FromBody] WorklogDto worklog, int employeeId)
        {
            if (!Enum.TryParse<DayOfWeek>(worklog.Day, true, out var parsedDay))
                return BadRequest("Invalid day string");

            var newWorklog = await worklogService.addWorklog(worklog, employeeId, parsedDay);

            return Ok();
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("update/{employeeId}")]
        public async Task<IActionResult> updateWorklog([FromBody] WorklogDto worklog, int employeeId)
        {
            if (!Enum.TryParse<DayOfWeek>(worklog.Day, true, out var parsedDay))
                return BadRequest("Invalid day string");

            var newWorklog = await worklogService.updateWorklog(worklog, employeeId, parsedDay);

            return Ok();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("remove/{employeeId}/{day}")]
        public async Task<IActionResult> RemoveWorklog(int employeeId, string day)
        {
            if (!Enum.TryParse<DayOfWeek>(day, true, out var parsedDay))
                return BadRequest("Invalid day string");
            bool removed = await worklogService.removeWorklog(employeeId, parsedDay);
            if (removed)
                return NoContent();
            else
                return NotFound();
        }
    }
}
