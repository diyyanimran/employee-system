import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoginService } from '../services/login-service';
import { Router } from '@angular/router';
import { catchError, EMPTY, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('/login')
    || req.url.includes('/signup')
    ||req.url.includes('/names')
    ) {
    return next(req);
  }

  const loginService = inject(LoginService);
  const router = inject(Router);

  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  const isExpired = accessToken
    ? (JSON.parse(atob(accessToken.split('.')[1]))).exp * 1000 < Date.now()
    : true;

  if (!isExpired) {
    const cloned = req.clone
      ({
        setHeaders: { Authorization: `Bearer ${accessToken}` }
      })
    return next(cloned);
  }

  if (!refreshToken) {
    router.navigate(['/login']);
    return EMPTY;
  }

  return loginService.refreshTokens({ refreshToken: refreshToken }).pipe
    (
      switchMap(response => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);

        const clone = req.clone
          ({
            setHeaders: { Authorization: `Bearer ${response.accessToken}` }
          })

        return next(clone);
      }
      ),
      catchError(err => {
        if (err.status == 401) {
          console.error(err.error);
        }
        else {
          console.error("Unexpected Error while refreshing tokens");
        }
        router.navigate(['/login']);
        return EMPTY;
      }
      )
    )
};
