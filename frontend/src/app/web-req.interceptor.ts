import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { PLATFORM_ID, inject } from '@angular/core';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { throwError, of } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const WebReqInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);

  // Log the request URL for debugging
  console.log('Intercepting request:', request.url);

  // Skip token for login/signup requests or when running on server
  const skipAuth = request.url.endsWith('/users/login') || request.url.endsWith('/users') || !isBrowser;
  if (skipAuth) {
    console.log('Skipping auth for:', request.url);
    return next(request);
  }

  let token: string | null;
  try {
    token = authService.getAccessToken();
  } catch (error) {
    console.warn('Error accessing localStorage, redirecting to login');
    if (isBrowser) redirectToLogin();
    return throwError(() => new Error('Authentication required'));
  }

  if (!token) {
    console.warn('Authentication token not found, redirecting to login');
    if (isBrowser) redirectToLogin();
    return throwError(() => new Error('Authentication required'));
  }

  const clonedRequest = request.clone({
    setHeaders: { 'x-access-token': token }
  });
  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token refresh logic...
      }
      return throwError(() => error);
    })
  );

  function redirectToLogin() {
    console.log('Redirecting to login page...');
    router.navigate(['/login']);
  }
};