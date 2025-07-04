# Employee Management System

A full stack employee management system built using Angular 20 (frontend), ASP.NET Core 9 (backend), and SQL Server. The system supports role-based access for admins and employees, secure authentication, and features to manage attendance and worklogs efficiently.

## Features

- JWT-based authentication system
- Employee self-registration with admin approval flow
- Role-based access control (Admin and Employee)
- Interceptor-based token handling on the frontend
- Weekly worklog tracking per employee
- QR code-based check-in and timed check-out system
- Attendance logs accessible per role:
  - Employees: personal attendance only
  - Admins: attendance records of all employees
- Loading screen for smoother UX
- Rate limiting to prevent abuse
- Backend architecture using controllers, services, and LINQ for database communication

## Technology Stack

| Layer       | Technology              |
|-------------|-------------------------|
| Frontend    | Angular 20              |
| Backend     | ASP.NET Core 9          |
| Database    | SQL Server (SSMS 2019)  |
| ORM         | Entity Framework Core 9 |

## Project Structure

- `EmployeeSystemFrontend/` – Angular project
- `EmployeeSystemBackend/` – ASP.NET Core Web API
