import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { HttpResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  showPassword: boolean = false; // Tracks password visibility
  constructor(private authService: AuthService, private router: Router) {}

  onLoginButtonClicked(email: string, password: string) {
    this.authService.login(email, password).subscribe({
      next: (res: HttpResponse<any>) => {
        console.log('Login Response:', {
          headers: {
            accessToken: res.headers.get('x-access-token'),
            refreshToken: res.headers.get('x-refresh-token'),
            allHeaders: res.headers.keys()
          },
          body: res.body
        });
        
        // Verify token storage immediately after login
        setTimeout(() => {
          const storedToken = localStorage.getItem('x-access-token');
          console.log('Stored token after login:', storedToken ? 'Token exists' : 'No token');
        }, 0);

        this.router.navigate(['/lists']);
      },
      error: (err) => {
        console.error('Login failed:', err);
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword; // Toggles between true and false
  }
}