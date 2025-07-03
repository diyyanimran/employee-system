import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILoginInfo } from '../DTOs/login-info';
import { ILoginResponse } from '../DTOs/login-response';
import { Observable, tap } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { IRefreshToken } from '../DTOs/refresh-token';
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

    login(): void {
        this.loggedIn = true;
    }

    logout(): void {
        this.loggedIn = false;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }

    isLoggedIn(): boolean {
        return this.loggedIn;
    }

    checkLogin(loginInfo: ILoginInfo): Observable<ILoginResponse> {
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

    approveRequest(request: IRequest): Observable<void>
    {
        return this.http.post<void>(API_ENDPOINTS.approve, request);
    }

    rejectRequest(request: IRequest): Observable<void>
    {
        return this.http.post<void>(API_ENDPOINTS.reject, request);
    }

    refreshTokens(refreshToken: IRefreshToken): Observable<ILoginResponse> {
        return this.rawHttp.post<ILoginResponse>(API_ENDPOINTS.refresh, refreshToken);
    }
}
