import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class WebRequestService {

  private _rootUrl: string;
  
  get ROOT_URL(): string {
    return this._rootUrl;
  }

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    // Initialize with environment value, will be updated after config loads
    this._rootUrl = environment.apiUrl;
    
    // Try to load config and update ROOT_URL
    this.configService.loadConfig().then(() => {
      this._rootUrl = this.configService.getApiUrl();
      console.log('API URL set to:', this._rootUrl);
    });
  }

  get(url: string) {
    return this.http.get(`${this.ROOT_URL}/${url}`).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  post(url: string, payload: Object) {
    return this.http.post(`${this.ROOT_URL}/${url}`, payload).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  patch(url: string, payload: Object) {
    return this.http.patch(`${this.ROOT_URL}/${url}`, payload).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  delete(url: string) {
    return this.http.delete(`${this.ROOT_URL}/${url}`).pipe(
      catchError(this.handleError.bind(this))
    );
  }
  login(email: string, password: string) {
    return this.http.post(`${this.ROOT_URL}/users/login`, {
      email,
      password
    }, {
      observe: 'response'
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  signup(email: string, password: string) {
    return this.http.post(`${this.ROOT_URL}/users`, {
      email,
      password
    }, {
      observe: 'response'
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', {
      url: error.url,
      status: error.status,
      message: error.message
    });
    return throwError(() => error);
  }
}
