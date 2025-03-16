import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Router } from '@angular/router';
import { shareReplay, tap, catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isBrowser: boolean;

  constructor(
    private http: HttpClient, 
    private webService: WebRequestService, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    console.log('AuthService initialized, isBrowser:', this.isBrowser);
  }

  login(email: string, password: string) {
    console.log('AuthService: Attempting login for', email);
    return this.webService.login(email, password).pipe(
      tap((res: HttpResponse<any>) => {
        console.log('AuthService: Login successful');
        // The auth tokens will be in the header of this response
        const accessToken = res.headers.get('x-access-token') || '';
        const refreshToken = res.headers.get('x-refresh-token') || '';
        this.setSession(res.body._id, accessToken, refreshToken);
      }),
      shareReplay(),
      catchError(error => {
        console.error('AuthService: Login failed', error);
        return throwError(() => error);
      })
    );
  }

  signup(email: string, password: string) {
    console.log('AuthService: Attempting signup for', email);
    return this.webService.signup(email, password).pipe(
      tap((res: HttpResponse<any>) => {
        console.log('AuthService: Signup successful');
        console.log('AuthService: Response headers:', {
          'x-access-token': res.headers.get('x-access-token') ? 'present' : 'missing',
          'x-refresh-token': res.headers.get('x-refresh-token') ? 'present' : 'missing'
        });
        console.log('AuthService: Response body:', res.body);
        
        // The auth tokens will be in the header of this response
        const accessToken = res.headers.get('x-access-token') || '';
        const refreshToken = res.headers.get('x-refresh-token') || '';
        this.setSession(res.body._id, accessToken, refreshToken);
      }),
      shareReplay(),
      catchError(error => {
        console.error('AuthService: Signup failed', error);
        return throwError(() => error);
      })
    );
  }

  setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('x-access-token', accessToken);
    localStorage.setItem('x-refresh-token', refreshToken);
  }

  logout() {
    this.removeSession();
    this.router.navigate(['/login']);
  }

  getAccessToken() {
    return localStorage.getItem('x-access-token');
  }

  getRefreshToken() {
    return localStorage.getItem('x-refresh-token');
  }

  getUserId() {
    return localStorage.getItem('user-id');
  }

  setAccessToken(accessToken: string) {
    localStorage.setItem('x-access-token', accessToken);
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser) return false;
    const token = this.getAccessToken();
    const userId = this.getUserId();
    const isLoggedIn = token != null && token.length > 0 && userId != null;
    console.log('isLoggedIn check:', isLoggedIn);
    return isLoggedIn;
  }

  private setSession(userId: string, accessToken: string, refreshToken: string) {
    try {
      console.log('AuthService: Setting session for user', userId);
      localStorage.setItem('user-id', userId);
      localStorage.setItem('x-access-token', accessToken);
      localStorage.setItem('x-refresh-token', refreshToken);
      console.log('AuthService: Session set successfully');
    } catch (error) {
      console.error('AuthService: Error setting session', error);
      throw error;
    }
  }

  private removeSession() {
    localStorage.removeItem('user-id');
    localStorage.removeItem('x-access-token');
    localStorage.removeItem('x-refresh-token');
  }

  getNewAccessToken() {
    console.log('AuthService: Getting new access token');
    const refreshToken = this.getRefreshToken();
    const userId = this.getUserId();
    
    if (!refreshToken || !userId) {
      console.error('AuthService: Missing refresh token or user ID');
      return new Observable(observer => {
        observer.error('Missing authentication data');
      });
    }
    
    return this.http.get(`${this.webService.ROOT_URL}/users/me/access-token`, {
      headers: {
        'x-refresh-token': refreshToken,
        '_id': userId
      },
      observe: 'response'
    }).pipe(
      tap((res: HttpResponse<any>) => {
        console.log('AuthService: New access token received');
        const accessToken = res.headers.get('x-access-token') || '';
        this.setAccessToken(accessToken);
      }),
      catchError(error => {
        console.error('AuthService: Failed to get new access token', error);
        return throwError(() => error);
      })
    );
  }
  
  // Alias for getNewAccessToken to maintain compatibility
  refreshAccessToken() {
    return this.getNewAccessToken();
  }
}
