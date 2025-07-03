using EmployeeSystem.Data;
using EmployeeSystem.DTOs;
using EmployeeSystem.Interface;
using EmployeeSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeSystem.Implementation
{
    public class AttendanceService : IAttendanceService
    {
        EmployeeDbContext context;
        public AttendanceService(EmployeeDbContext context_) 
        {
            context = context_;
        }
        public async Task<List<AttendanceDto>?> GetAttendances(int employeeId)
        {
            if (await context.Logins.AnyAsync(e => e.employeeId == employeeId && !e.Active))
                return null;

            return await context.Attendances
                .Where(a => a.EmployeeId == employeeId && a.CheckInTime != null)
                .OrderBy(a => a.Date)
                .Select(a => new AttendanceDto
                {
                    CheckInTime = a.CheckInTime,
                    CheckOutTime = a.CheckOutTime,
                    Present = a.Present,
                    LeaveAllowed = a.LeaveAllowed
                })
                .ToListAsync();
        }

        public async Task<List<AttendanceDto>?> GetTodaysAttendance(int employeeId)
        {
            if (await context.Logins.AnyAsync(e => e.employeeId == employeeId && !e.Active))
                return null;

            return await context.Attendances
                .Where(a => a.EmployeeId == employeeId
                && a.Date == DateOnly.FromDateTime(DateTime.Today))
                .Select(a => new AttendanceDto
                {
                    CheckInTime = a.CheckInTime,
                    CheckOutTime = a.CheckOutTime, 
                    Present = a.Present, 
                    LeaveAllowed = a.LeaveAllowed
                })
                .ToListAsync();
        }

        public async Task<bool> CheckIn(int employeeId)
        {
            if (await context.Logins.AnyAsync(e => e.employeeId == employeeId && !e.Active))
                return false;

            var exists = await context.Attendances
                .Where(a => a.EmployeeId == employeeId && a.Date == DateOnly.FromDateTime(DateTime.Today) && a.CheckInTime != null)
                .OrderByDescending(a => a.CheckInTime)
                .FirstOrDefaultAsync();


            if (exists != null && exists.CheckOutTime == null)
                return false;

            Attendance newCheckIn = new Attendance
            {
                Date = DateOnly.FromDateTime(DateTime.Now),
                CheckInTime = DateTime.Now,
                CheckOutTime = null,
                Present = false,
                LeaveAllowed = false,
                EmployeeId = employeeId
            };

            context.Attendances.Add(newCheckIn);
            await context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> CheckOut(int employeeId)
        {
            if (await context.Logins.AnyAsync(e => e.employeeId == employeeId && !e.Active))
                return false;

            var current = await context.Attendances
                .Where(a =>
                a.EmployeeId == employeeId
                && a.Date == DateOnly.FromDateTime(DateTime.Today) 
                && a.CheckInTime != null
                && a.CheckOutTime == null
                )
                .FirstOrDefaultAsync();

            if (current == null || current.CheckInTime == null)
                return false;

            if ((DateTime.Now - current.CheckInTime.Value).TotalHours < 2)
                return false;


            current.CheckOutTime = DateTime.Now;

            current.Present = await checkPresent(employeeId, DateTime.Now);

            var leaves = await context.Attendances.Where(e => e.EmployeeId == employeeId && e.LeaveAllowed)
                .ToListAsync();
            foreach (var leave in leaves)
                leave.Present = current.Present;

            await context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateLeave(int employeeId, bool allowed, DateOnly date)
        {
            if (await context.Logins.AnyAsync(e => e.employeeId == employeeId && !e.Active))
                return false;

            var attendance = await context.Attendances
                .Where(a => a.EmployeeId == employeeId 
                && a.Date.Equals(date)
                && a.CheckInTime == null)
                .FirstOrDefaultAsync();

            if (attendance is null)
            {
                attendance = new Attendance
                {
                    CheckInTime = null,
                    CheckOutTime = null,
                    Present = false,
                    LeaveAllowed = true,
                    EmployeeId = employeeId,
                    Date = date
                };
                context.Add(attendance);
            }

            attendance.LeaveAllowed = allowed;
            await context.SaveChangesAsync();
            return true;
        }

        public async Task<StatusDto?> CheckStatus(int employeeId, DateOnly date)
        {
            if (await context.Logins.AnyAsync(e => e.employeeId == employeeId && !e.Active))
                return null;

            var attendances = await context.Attendances
                .Where(
                a => a.EmployeeId == employeeId 
                && a.Date == date
                )
                .ToListAsync();
            if (attendances is null)
                return null;

            StatusDto toReturn = new StatusDto { present = false, leaveAllowed = false};
            toReturn.present = attendances.Any(a => a.Present == true);
            toReturn.leaveAllowed = attendances.Any(a => a.LeaveAllowed && a.CheckInTime is null);

            return toReturn;
        }

        private async Task<bool> checkPresent(int employeeId, DateTime checkOutTime)
        {
            if (await context.Logins.AnyAsync(e => e.employeeId == employeeId && !e.Active))
                return false;

            var attendances = await context.Attendances
                .Where(a => a.EmployeeId == employeeId 
                && a.CheckInTime >= DateTime.Today
                && a.CheckInTime < DateTime.Today.AddDays(1)
                )
                .OrderBy(a => a.CheckInTime)
                .ToListAsync();

            if (attendances is null || attendances.Any(a => a.Present))
                return false;

            var firstCheckIn = attendances.FirstOrDefault()!.CheckInTime;
            if (firstCheckIn == null) return false;

            if ((checkOutTime - firstCheckIn.Value).TotalHours > 1)
                return true;
            return false;
        }
    }
}
