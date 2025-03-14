import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { HttpResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  showPassword: boolean = false; // Tracks password visibility
  errorMessage: string = '';
  
  constructor(private authService: AuthService, private router: Router) {}

  onLoginButtonClicked(email: string, password: string) {
    if (!email || !password) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }
    
    this.errorMessage = '';
    console.log('Attempting login with:', { email });
    
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
        this.errorMessage = 'Login failed. Please check your credentials and try again.';
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword; // Toggles between true and false
  }
}