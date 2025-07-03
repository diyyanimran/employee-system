import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { DialogService } from '../services/dialog-service';
import { catchError, EMPTY, throwError } from 'rxjs';

export const rateLimiterInterceptor: HttpInterceptorFn = (req, next) => {
  const dialogService = inject(DialogService);

  return next(req).pipe
  (
    catchError((err: HttpErrorResponse) =>
    {
      if (err.status == 503){
        dialogService.showError("Too many requests");
        return EMPTY;
      }
      else {
      return throwError(() => err);
      }
    })
  )
};
