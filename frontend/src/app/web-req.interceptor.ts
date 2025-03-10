import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

export const WebReqInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Skip token for login requests
  if (request.url.includes('/users/login')) {
    return next(request);
  }

  let token: string | null;
  try {
    token = authService.getAccessToken();
  } catch (error) {
    console.warn('Error accessing localStorage, redirecting to login');
    router.navigate(['/login']);
    return throwError(() => new Error('Authentication required'));
  }

  if (!token) {
    console.warn('Authentication token not found, redirecting to login');
    router.navigate(['/login']);
    return throwError(() => new Error('Authentication required'));
  }

  // Clone the request and add the token header
  const clonedRequest = request.clone({
    setHeaders: {
      'x-access-token': token
    }
  });

  return next(clonedRequest).pipe(
    tap({
      error: (error) => {
        if (error.status === 401) {
          console.warn('Unauthorized access, redirecting to login');
          router.navigate(['/login']);
        }
      }
    }),
    catchError((error: HttpErrorResponse) => {
      return throwError(() => error);
    })
  );
};
