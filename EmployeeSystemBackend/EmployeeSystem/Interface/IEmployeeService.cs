using EmployeeSystem.DTOs;
using EmployeeSystem.Models;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeSystem.Interface
{
    public interface IEmployeeService
    {
        public Task<List<EmployeeDto>> GetAllEmployees();
        public Task<List<BasicInfoDto>> GetAllNamesAndIDs();
        public Task<List<NameDto>> GetAllNames();
        public Task<List<BasicInfoDto>> GetAdmins();
        public Task<EmployeeDto?> AddEmployee(NewEmployeeDto newEmployee);
        public Task<bool> RemoveEmployee(int id);
    }
}
