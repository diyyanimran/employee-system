import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IWorklog } from '../DTOs/worklogs';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class WorklogsService {

  constructor(private http:HttpClient) { }

  getWorkLogs(id: number): Observable<IWorklog[]>
  {
    return this.http.get<IWorklog[]>(`${API_ENDPOINTS.worklogs}/${id}`);
  }

  addWorklog(id: number, newWorklog: IWorklog): Observable<void>
  {
    return this.http.post<void>(`${API_ENDPOINTS.addWorklogs}/${id}`, newWorklog);
  }

  removeWorklog(id: number, day: string): Observable<void>
  {
    return this.http.delete<void>(`${API_ENDPOINTS.removeWorklog}/${id}/${day}`);
  }

  updateWorklog(id: number, newWorklog: IWorklog): Observable<void>
  {
    return this.http.post<void>(`${API_ENDPOINTS.updateWorklog}/${id}`, newWorklog)
  }
}
