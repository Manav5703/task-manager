import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Router } from '@angular/router';
import { shareReplay, tap, catchError, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

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
  }

  login(email: string, password: string) {
    return this.webService.login(email, password).pipe(
      tap((res: any) => {
        const accessToken = res.headers.get('x-access-token');
        const refreshToken = res.headers.get('x-refresh-token');
        const userId = res.body._id;

        this.setSession(userId, accessToken, refreshToken);
      })
    );
  }

  signup(email: string, password: string) {
    return this.webService.signup(email, password).pipe(
      tap((res: any) => {
        const accessToken = res.headers.get('x-access-token');
        const refreshToken = res.headers.get('x-refresh-token');
        const userId = res.body._id;

        this.setSession(userId, accessToken, refreshToken);
      })
    );
  }

  logout() {
    this.removeSession();
    console.log('User logged out, redirecting to login page');
    this.router.navigate(['/login']);
  }

  getAccessToken() {
    if (!this.isBrowser) return null;
    return localStorage.getItem('x-access-token');
  }

  getRefreshToken() {
    if (!this.isBrowser) return null;
    return localStorage.getItem('x-refresh-token');
  }

  getUserId() {
    if (!this.isBrowser) return null;
    return localStorage.getItem('user-id');
  }

  setAccessToken(accessToken: string) {
    if (!this.isBrowser) return;
    localStorage.setItem('x-access-token', accessToken);
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser) return false;
    const token = this.getAccessToken();
    return token != null && token.length > 0;
  }

  private setSession(userId: string, accessToken: string, refreshToken: string) {
    if (!this.isBrowser) return;
    localStorage.setItem('user-id', userId);
    localStorage.setItem('x-access-token', accessToken);
    localStorage.setItem('x-refresh-token', refreshToken);
  }

  private removeSession() {
    if (!this.isBrowser) return;
    localStorage.removeItem('user-id');
    localStorage.removeItem('x-access-token');
    localStorage.removeItem('x-refresh-token');
  }

  getnewAccessToken() {
    return this.http.get(`${this.webService.ROOT_URL}/users/me/access-token`, {
      headers: {
        'x-refresh-token': this.getRefreshToken() || '',
        '_id': this.getUserId() || ''
      }
    });
  }
  
  refreshAccessToken() {
    console.log('Attempting to refresh access token');
    return this.http.get<{ accessToken: string }>(`${this.webService.ROOT_URL}/users/me/access-token`, {
      headers: {
        'x-refresh-token': this.getRefreshToken() || '',
        '_id': this.getUserId() || ''
      }
    }).pipe(
      tap(response => {
        console.log('New access token received:', response.accessToken);
        this.setAccessToken(response.accessToken);
      }),
      catchError(error => {
        console.error('Error refreshing access token:', error);
        return throwError(() => new Error('Token refresh failed'));
      })
    );
  }
}
