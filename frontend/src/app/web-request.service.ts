import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebRequestService {

  readonly ROOT_URL: string;

  constructor(private http: HttpClient) {
    this.ROOT_URL = environment.apiUrl;
    console.log('API URL set to:', this.ROOT_URL);
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
