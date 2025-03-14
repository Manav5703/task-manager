import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { PLATFORM_ID, inject } from '@angular/core';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { throwError, of } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const WebReqInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);

  // Skip token for login requests or when running on server
  if (request.url.includes('/users/login') || request.url.includes('/users/signup') || !isBrowser) {
    return next(request);
  }

  let token: string | null;
  try {
    token = authService.getAccessToken();
  } catch (error) {
    console.warn('Error accessing localStorage, redirecting to login');
    if (isBrowser) {
      redirectToLogin();
    }
    return throwError(() => new Error('Authentication required'));
  }

  if (!token) {
    console.warn('Authentication token not found, redirecting to login');
    if (isBrowser) {
      redirectToLogin();
    }
    return throwError(() => new Error('Authentication required'));
  }

  // Clone the request and add the token header
  const clonedRequest = request.clone({
    setHeaders: {
      'x-access-token': token
    }
  });

  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.log('401 Unauthorized error detected, attempting token refresh');
        // Try to refresh the token first
        return authService.refreshAccessToken().pipe(
          switchMap(() => {
            console.log('Token refreshed successfully, retrying request');
            // Retry the failed request with the new token
            const newRequest = request.clone({
              setHeaders: {
                'x-access-token': authService.getAccessToken() || ''
              }
            });
            return next(newRequest);
          }),
          catchError((refreshError) => {
            // If refresh fails, redirect to login
            console.warn('Token refresh failed, redirecting to login');
            if (isBrowser) {
              authService.logout(); // This already navigates to login
              // Force redirect to ensure navigation happens
              redirectToLogin();
            }
            return throwError(() => new Error('Unauthorized'));
          })
        );
      }
      return throwError(() => error);
    })
  );

  // Helper function to handle login redirection
  function redirectToLogin() {
    console.log('Redirecting to login page...');
    router.navigate(['/login']);
  }
};
