export const API_BASE = 'https://localhost:7128/api';

export const API_ENDPOINTS = {
  signup: `${API_BASE}/Auth/signup`,
  login: `${API_BASE}/Auth/login`,
  role: `${API_BASE}/Auth/role`,
  requests: `${API_BASE}/Auth/requests`,
  approve: `${API_BASE}/Auth/approve`,
  reject: `${API_BASE}/Auth/reject`,
  refresh: `${API_BASE}/Auth/refresh`,

  employeeList: `${API_BASE}/Employee/all`,
  employeeInfo: `${API_BASE}/Employee/info`,
  employeeNames: `${API_BASE}/Employee/names`,
  addEmployee: `${API_BASE}/Employee/add`,
  removeEmployee: `${API_BASE}/Employee/remove`,

  worklogs: `${API_BASE}/Worklogs/get`,
  addWorklogs: `${API_BASE}/Worklogs/add`,
  updateWorklog: `${API_BASE}/Worklogs/update`,
  removeWorklog: `${API_BASE}/Worklogs/remove`,

  getAttendance: `${API_BASE}/Attendance/get`,
  getTodaysAttendance: `${API_BASE}/Attendance/today`,
  checkIn: `${API_BASE}/Attendance/checkin`,
  checkOut: `${API_BASE}/Attendance/checkout`,
  updateLeave: `${API_BASE}/Attendance/updateLeave`,
  status: `${API_BASE}/Attendance/status`
};
