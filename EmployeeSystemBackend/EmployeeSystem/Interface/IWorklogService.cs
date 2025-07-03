using EmployeeSystem.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeSystem.Interface
{
    public interface IWorklogService
    {
        public Task<List<WorklogDto>?> getWorklogs(int employeeId);
        public Task<bool> addWorklog(WorklogDto worklog, int employeeId, DayOfWeek parsedDay);
        public Task<bool> removeWorklog(int employeeId, DayOfWeek day);
        public Task<bool> updateWorklog(WorklogDto worklog, int employeeId, DayOfWeek parsedDay);
    }
}
