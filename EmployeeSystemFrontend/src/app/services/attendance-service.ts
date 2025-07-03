import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAttendance } from '../DTOs/attendance';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { IStatus } from '../DTOs/status';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  constructor(private http: HttpClient) { }

  getAttendances(employeeId: number): Observable<IAttendance[]> {
    return this.http.get<IAttendance[]>
      (`${API_ENDPOINTS.getAttendance}/${employeeId}`);
  }
  
  getTodaysAttendance(employeeId: number): Observable<IAttendance[]>
  {
    return this.http.get<IAttendance[]>
    (`${API_ENDPOINTS.getTodaysAttendance}/${employeeId}`);
  }

  checkIn(employeeId: number): Observable<void> {
    return this.http.post<void>(`${API_ENDPOINTS.checkIn}/${employeeId}`, null);
  }

  checkOut(employeeId: number): Observable<void> {
    return this.http.post<void>(`${API_ENDPOINTS.checkOut}/${employeeId}`, null);
  }

  updateLeave(employeeId: number, allowed: boolean, date: Date): Observable<void>
  {
    const body = 
    {
      allowed: allowed,
      date: date.toISOString()
    };
    return this.http.post<void>(`${API_ENDPOINTS.updateLeave}/${employeeId}`, body);
  }

  getStatus(employeeId: number, date: Date) : Observable<IStatus>
  {
    const params = { date: date.toISOString() };
    return this.http.get<IStatus>(`${API_ENDPOINTS.status}/${employeeId}`, {params})
  }
}
