using System.Diagnostics;
using EmployeeSystem.Data;
using EmployeeSystem.DTOs;
using EmployeeSystem.Interface;
using EmployeeSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeSystem.Implementation
{
    public class WorklogService : IWorklogService
    {
        private EmployeeDbContext context;
        public WorklogService(EmployeeDbContext context_) 
        {
            context = context_;
        }

        public async Task<List<WorklogDto>?> getWorklogs(int employeeId)
        {
            if (await context.Logins.AnyAsync(e => e.employeeId == employeeId && !e.Active))
                return null;

            return await context.WorkLogs.
                Where(w => employeeId == w.EmployeeId).
                OrderBy(w => w.Day).
                Select(w => new WorklogDto
                    {
                        Day = w.Day.ToString(),
                        Developing = w.Developing,
                        Designing = w.Designing,
                        Fixing = w.Fixing
                    }).
                ToListAsync();
        }

        public async Task<bool> addWorklog(WorklogDto worklog, int employeeId, DayOfWeek day)
        {
            double totalHours = Math.Round(worklog.Developing + worklog.Designing + worklog.Fixing, 2);
            var isActive = await context.Logins
                .Where(a => a.employeeId == employeeId && a.Active)
                .FirstOrDefaultAsync();

            if (isActive is null)
                return false;

            var exists = await context.WorkLogs
                .Where(w => w.EmployeeId == employeeId 
                && w.Day == day)
                .FirstOrDefaultAsync();
            if (exists != null)
            {
                exists.Designing += worklog.Designing;
                exists.Developing += worklog.Developing;
                exists.Fixing += worklog.Fixing;
            }
            else
            {
                WorkLog newWorklog = new WorkLog
                {
                    Day = day,
                    Developing = worklog.Developing,
                    Designing = worklog.Designing,
                    Fixing = worklog.Fixing,
                    EmployeeId = employeeId
                };
                context.Add(newWorklog);
                
            }
            await context.SaveChangesAsync();

            await updateEmployeeHours(employeeId, totalHours);

            return true;
        }

        public async Task<bool> updateWorklog(WorklogDto worklog, int employeeId, DayOfWeek parsedDay)
        {
            double initialHours = 0, finalHours = 0, totalHours = 0;
            var isActive = await context.Logins
                .Where(a => a.employeeId == employeeId && a.Active)
                .FirstOrDefaultAsync();

            if (isActive is null)
                return false;

            var exists = await context.WorkLogs
                .Where(w => w.EmployeeId == employeeId && w.Day == parsedDay)
                .FirstOrDefaultAsync();

            if (exists != null)
            {
                initialHours = exists.Developing + exists.Designing + exists.Fixing;

                exists.Developing = worklog.Developing;
                exists.Fixing = worklog.Fixing;
                exists.Designing = worklog.Designing;

                finalHours = exists.Developing + exists.Designing + exists.Fixing;
                totalHours = Math.Round(finalHours - initialHours, 2);
            }
            else
            {
                WorkLog newWorklog = new WorkLog
                {
                    Day = parsedDay,
                    Developing = worklog.Developing,
                    Designing = worklog.Designing,
                    Fixing = worklog.Fixing,
                    EmployeeId = employeeId
                };
                context.Add(newWorklog);
                totalHours = worklog.Developing + worklog.Designing + worklog.Fixing;
            }

            await context.SaveChangesAsync();

            await updateEmployeeHours(employeeId, totalHours);

            return true;
        }

        public async Task<bool> removeWorklog(int employeeId, DayOfWeek day)
        {
            var isActive = await context.Employees
                .Where(a => a.Id == employeeId && a.User.Active)
                .FirstOrDefaultAsync();

            if (isActive is null)
                return false;

            var worklog = await context.WorkLogs
                .Where(w => (w.EmployeeId == employeeId) && (w.Day == day))
                .FirstOrDefaultAsync();
            if (worklog is null)
                return false;

            double totalHours = Math.Round(worklog.Designing + worklog.Developing + worklog.Fixing, 2);

            context.WorkLogs.Remove(worklog);
            await context.SaveChangesAsync();

            await updateEmployeeHours(employeeId, -totalHours);

            return true;
        }

        private async Task updateEmployeeHours(int id, double totalHours)
        {
            var employee = await context.Employees.Where(e => e.Id == id).FirstOrDefaultAsync();
            if (employee is null || !employee.User.Active)
                return;

            employee.TotalHours += Math.Round(totalHours, 2);
            employee.AverageHours = Math.Round(employee.TotalHours / 7.0, 2);

            await context.SaveChangesAsync();
        }
    }
}
