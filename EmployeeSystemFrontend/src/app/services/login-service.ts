import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILoginResponse } from '../DTOs/login-response';
import { Observable, tap } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { IRequest } from '../DTOs/request';

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    private loggedIn: boolean = false;
    private rawHttp: HttpClient;

    constructor(private http: HttpClient, private handler: HttpBackend) 
    {
        this.rawHttp = new HttpClient(this.handler);
    }

    checkLogin(loginInfo: any): Observable<ILoginResponse> {
        return this.http.post<ILoginResponse>(API_ENDPOINTS.login, loginInfo);
    }

    getRole(employeeId: number) : Observable<{role: string}>
    {
        return this.http.get<{role: string}>(`${API_ENDPOINTS.role}/${employeeId}`)
    }

    getRequests(): Observable<IRequest[]>
    {
        return this.http.post<IRequest[]>(API_ENDPOINTS.requests, null);
    }

    approveRequest(request: any): Observable<void>
    {
        return this.http.post<void>(API_ENDPOINTS.approve, request);
    }

    rejectRequest(request: any): Observable<void>
    {
        return this.http.post<void>(API_ENDPOINTS.reject, request);
    }

    refreshTokens(refreshToken: any): Observable<ILoginResponse> {
        return this.rawHttp.post<ILoginResponse>(API_ENDPOINTS.refresh, refreshToken);
    }
}
