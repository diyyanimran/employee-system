import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISignupInfo } from '../DTOs/signup-info';
import { ISignupResponse } from '../DTOs/signup-response';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

    constructor(private http: HttpClient) { }

    signUp(signupInfo: any): Observable<ISignupResponse> {
        return this.http.post<ISignupResponse>(API_ENDPOINTS.signup, signupInfo)
    }
}

