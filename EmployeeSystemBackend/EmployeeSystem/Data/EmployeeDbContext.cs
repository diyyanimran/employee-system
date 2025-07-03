using EmployeeSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeSystem.Data
{
    public class EmployeeDbContext(DbContextOptions<EmployeeDbContext> options) : DbContext(options)
    {
        public DbSet<User> Logins {  get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<WorkLog> WorkLogs { get; set; }
        public DbSet<Attendance> Attendances { get; set; }
    }
}
