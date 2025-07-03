using EmployeeSystem.Data;
using EmployeeSystem.DTOs;
using EmployeeSystem.Interface;
using EmployeeSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeSystem.Implementation
{
    public class EmployeeService : IEmployeeService
    {
        private readonly EmployeeDbContext context;
        public EmployeeService(EmployeeDbContext _context) 
        {
            context = _context;
        }
        public async Task<List<EmployeeDto>> GetAllEmployees()
        {
            List<Employee> employees =  await context.Employees.OrderBy(e => e.Id)
                .Where(e => e.User.Active)
                .ToListAsync();

            List<EmployeeDto> result = new List<EmployeeDto>();
            foreach (var emp in employees)
            {
                result.Add(new EmployeeDto
                {
                    Id = emp.Id,
                    Name = emp.Name,
                    Code = emp.Code,
                    TotalHours = emp.TotalHours,
                    AverageHours = emp.AverageHours,
                    DaysPresent = await getDaysPresent(emp.Id), 
                    LeavesTaken = await getLeavesTaken(emp.Id)
                });
            }

            return result;
        }

        private async Task<int> getDaysPresent(int employeeId)
        {
            if (await context.Logins.AnyAsync(e => e.employeeId == employeeId && !e.Active))
                return 0;

            int daysPresent = 0;
            List <Attendance> attendances = await context.Attendances
                .Where(a => a.EmployeeId == employeeId)
                .OrderBy(a => a.CheckInTime)
                .ToListAsync();

            HashSet<DateOnly> dates = new HashSet<DateOnly>();

            foreach (Attendance attendance in attendances)
            {
                DateOnly date = attendance.Date;
                if (attendance.Present && !dates.Contains(date))
                {
                    daysPresent++;
                    dates.Add(date);
                }
            }
            return daysPresent;
        }

        private async Task<int> getLeavesTaken(int employeeId)
        {
            if (await context.Employees.AnyAsync(e => e.Id == employeeId && !e.User.Active))
                return 0;

            int leavesTaken = 0;
            List<Attendance> attendances = await context.Attendances
                .Where(a => a.EmployeeId == employeeId)
                .OrderBy(a => a.Date)
                .ToListAsync();

            HashSet<DateOnly> dates = new HashSet<DateOnly>();
            foreach (Attendance attendance in attendances)
            {
                DateOnly date = attendance.Date;
                if (attendance.LeaveAllowed && !dates.Contains(date) && !attendance.Present)
                {
                    leavesTaken++;
                }
            }
            return leavesTaken;
        }

        public async Task<List<BasicInfoDto>> GetAllNamesAndIDs()
        {
            return await context.Employees
                .OrderBy(e => e.Id)
                .Where(e => e.User.Active)
                .Select(e => new BasicInfoDto{ Id = e.Id, Name = e.Name })
                .ToListAsync();
        }

        public async Task<List<NameDto>> GetAllNames()
        {
            return await context.Employees
                .Where(e => e.User.Active)
                .Select(e => new NameDto { Name = e.Name } )
                .ToListAsync();
        }

        public async Task<EmployeeDto?> AddEmployee(NewEmployeeDto newEmployee)
        {
            var user = await context.Logins
                .Where(l => l.Username == newEmployee.Name)
                .FirstOrDefaultAsync();

            if (user is null)
                return null;

            if (await context.Employees.AnyAsync(e => e.Name == newEmployee.Name))
                return null;

            if (!user.Approved)
                return null;

            Employee employee = new Employee
            {
                Name = newEmployee.Name,
                Code = newEmployee.Code,
                AverageHours = 0,
                TotalHours = 0,
                TotalLeavesAllowed = 5
            };

            context.Employees.Add(employee);
            await context.SaveChangesAsync();

            user.employeeId = employee.Id;
            user.Active = true;
            await context.SaveChangesAsync();

            return new EmployeeDto
            {
                Id = employee.Id,
                Name = employee.Name,
                Code = employee.Code,
                AverageHours = employee.AverageHours,
                TotalHours = employee.TotalHours
            };
        }

        public async Task<bool> RemoveEmployee(int id)
        {
            var employee = await context.Logins
                .Where(e => e.employeeId == id).FirstOrDefaultAsync();
            if (employee is null)
                return false;

            employee.Active = false;

            await context.SaveChangesAsync();
            return true;
        }
    }
}
