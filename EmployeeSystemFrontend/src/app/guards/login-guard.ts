import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { LoginService } from '../services/login-service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export const LoginGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken') ?? '';

  if (!accessToken) {
    return of(router.parseUrl('/login'));
  }

  try {
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    const isExpired = payload.exp * 1000 < Date.now();

    if (!isExpired) {
      return of(true);
    }

    return loginService.refreshTokens({ refreshToken: refreshToken }).pipe(
      map(response => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        return true;
      }),
      catchError(err => {
        console.error('Refresh failed', err);
        return of(router.parseUrl('/login'));
      })
    );

  } catch (e) {
    console.error('Token parse error', e);
    return of(router.parseUrl('/login'));
  }
};
