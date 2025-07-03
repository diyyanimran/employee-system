import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEmployee } from '../DTOs/employee-info';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { IBasicInfo } from '../DTOs/basic-info';
import { INewEmployee } from '../DTOs/new-employee';
import { IName } from '../DTOs/name';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http:HttpClient) { }

  getAllEmployees(): Observable<IEmployee[]>
  {
    return this.http.get<IEmployee[]>(API_ENDPOINTS.employeeList);
  }

  getAllNamesAndIDs(): Observable<IBasicInfo[]>
  {
    return this.http.get<IBasicInfo[]>(API_ENDPOINTS.employeeInfo);
  }

  getAllNames(): Observable<IName[]>
  {
    return this.http.get<IName[]>(API_ENDPOINTS.employeeNames);
  }

  addEmployee(newEmployee: INewEmployee): Observable<void>
  {
    return this.http.post<void>(API_ENDPOINTS.addEmployee, newEmployee);
  }

  removeEmployee(id: number): Observable<void>
  {
    return this.http.delete<void>(`${API_ENDPOINTS.removeEmployee}/${id}`);
  }
}
