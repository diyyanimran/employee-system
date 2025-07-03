using EmployeeSystem.DTOs;
using EmployeeSystem.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private IEmployeeService employeeService;
        public EmployeeController(IEmployeeService employeeService_) 
        { 
            employeeService = employeeService_;
        }

        [Authorize(Roles = "Admin, User")]
        [HttpGet("all")]
        public async Task<ActionResult<List<EmployeeDto>>> GetAllEmployees()
        {
            List<EmployeeDto> employees = await employeeService.GetAllEmployees();
            if (employees.Count == 0)
                return BadRequest("No Employees Found");
            return Ok(employees);
        }

        [Authorize(Roles = "Admin, User")]
        [HttpGet("info")]
        public async Task<ActionResult<List<BasicInfoDto>>> GetAllNamesAndIDs()
        {
            List<BasicInfoDto> info = await employeeService.GetAllNamesAndIDs();
            if (info.Count == 0)
                return BadRequest("No Employees Found");
            return Ok(info);
        }

        [HttpGet("names")]
        public async Task<ActionResult<List<NameDto>>> GetAllNames()
        {
            List<NameDto> names = await employeeService.GetAllNames();
            if (names.Count == 0)
                return BadRequest("No Employees Found");
            return Ok(names);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("add")]
        public async Task<IActionResult> AddEmployee(NewEmployeeDto newEmployee)
        {
            var employee = await employeeService.AddEmployee(newEmployee);
            if (employee == null)
                return BadRequest("Invalid Details");
            return Ok();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("remove/{id}")]
        public async Task<IActionResult> RemoveEmployee(int id)
        {
            bool removed = await employeeService.RemoveEmployee(id);
            if (removed)
                return NoContent();
            else
                return NotFound("Employee Not Found");
        }
    }
}
