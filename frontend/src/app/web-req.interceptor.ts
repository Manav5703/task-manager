import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { PLATFORM_ID, inject } from '@angular/core';
import { catchError, tap, switchMap, throwError, of } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler } from '@angular/common/http';
import { Observable, empty, Subject } from 'rxjs';

// Keep the class-based interceptor for backward compatibility
@Injectable({
  providedIn: 'root'
})
export class WebReqInterceptor implements HttpInterceptor {

  refreshingAccessToken: boolean = false;
  accessTokenRefreshed: Subject<any> = new Subject();

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);
    const isBrowser = isPlatformBrowser(platformId);

    // Log the request URL for debugging
    console.log('Intercepting request:', request.url);

    // Check if this is an auth request (login or signup)
    const isAuthRequest = request.url.includes('/users/login') || 
                          (request.url.includes('/users') && !request.url.includes('/users/me'));
    
    console.log('Is auth request?', isAuthRequest, 'URL:', request.url);
    
    if (isAuthRequest) {
      console.log('Skipping auth for:', request.url);
      // Don't add auth header for auth requests
      return next.handle(request).pipe(
        tap(response => console.log('Response from skipped auth request:', request.url)),
        catchError((error: HttpErrorResponse) => {
          console.log('Error in skipped auth request:', error);
          return throwError(() => error);
        })
      );
    }

    // This is a non-auth request, so add the access token
    let accessToken = '';
    try {
      // Debug localStorage contents
      const userId = localStorage.getItem('user-id');
      const token = localStorage.getItem('x-access-token');
      const refreshToken = localStorage.getItem('x-refresh-token');
      
      console.log('localStorage contents:', {
        'user-id': userId,
        'x-access-token': token ? token.substring(0, 10) + '...' : 'missing',
        'x-refresh-token': refreshToken ? 'exists' : 'missing'
      });
      
      accessToken = this.authService.getAccessToken() || '';
      console.log('Access token retrieved:', accessToken ? 'Token exists' : 'No token');
      if (accessToken) {
        console.log('Token value (first 10 chars):', accessToken.substring(0, 10) + '...');
      }
    } catch (e) {
      console.error('Error accessing localStorage:', e);
    }

    if (accessToken) {
      // Add the access token to the request
      request = this.addAuthHeader(request, accessToken);
      console.log('Added auth header to request:', request.url);
      
      // Log the headers for debugging
      const headers = request.headers.keys();
      console.log('Request headers:', headers);
      console.log('x-access-token header present:', request.headers.has('x-access-token'));
      if (request.headers.has('x-access-token')) {
        console.log('x-access-token value (first 10 chars):', request.headers.get('x-access-token')?.substring(0, 10) + '...');
      }
    } else {
      console.log('No access token available for request:', request.url);
    }

    // Handle the response
    return next.handle(request).pipe(
      tap(response => {
        console.log('Response received for:', request.url);
      }),
      catchError((error: HttpErrorResponse) => {
        console.log('Error caught in interceptor:', error.status, error.message, 'URL:', request.url);

        if (error.status === 401) {
          // 401 error, so we need to refresh the access token
          console.log('Attempting to refresh token due to 401 error for URL:', request.url);
          return this.refreshAccessToken().pipe(
            switchMap(() => {
              // Now that we have a new access token, retry the request
              const newToken = this.authService.getAccessToken() || '';
              console.log('Retrying request with new token:', request.url);
              console.log('New token value (first 10 chars):', newToken.substring(0, 10) + '...');
              request = this.addAuthHeader(request, newToken);
              return next.handle(request);
            }),
            catchError((err) => {
              console.log('Error refreshing access token:', err);
              this.authService.logout();
              return throwError(() => err);
            })
          );
        }

        return throwError(() => error);
      })
    );
  }

  refreshAccessToken() {
    if (this.refreshingAccessToken) {
      return new Observable(observer => {
        this.accessTokenRefreshed.subscribe(() => {
          // This code will run when the access token has been refreshed
          observer.next(null);
          observer.complete();
        });
      });
    } else {
      this.refreshingAccessToken = true;
      
      // Call auth service to refresh the token
      return this.authService.getNewAccessToken().pipe(
        tap(() => {
          console.log('Access Token Refreshed!');
          this.refreshingAccessToken = false;
          this.accessTokenRefreshed.next('');
        })
      );
    }
  }

  addAuthHeader(request: HttpRequest<any>, token: string) {
    // Clone the request and add the auth header
    const clonedRequest = request.clone({
      setHeaders: {
        'x-access-token': token
      }
    });
    
    console.log('Auth header added:', token ? 'Token present' : 'No token');
    return clonedRequest;
  }
}