using EmployeeSystem.DTOs;

namespace EmployeeSystem.Interface
{
    public interface IAttendanceService
    {
        public Task<List<AttendanceDto>?> GetAttendances(int employeeId);
        public Task<List<AttendanceDto>?> GetTodaysAttendance(int employeeId);
        public Task<bool> CheckIn(int employeeId);
        public Task<bool> CheckOut(int employeeId);
        public Task<bool> UpdateLeave(int employeeId, bool allowed, DateOnly date);
        public Task<StatusDto?> CheckStatus(int employeeId, DateOnly date);
    }
}
