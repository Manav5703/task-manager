import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { HttpResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  showPassword: boolean = false; // Tracks password visibility
  errorMessage: string = '';
  isLoading: boolean = false;
  
  constructor(private authService: AuthService, private router: Router) {
    console.log('LoginPageComponent initialized');
  }

  onLoginButtonClicked(email: string, password: string) {
    console.log('Login button clicked with:', { email });
    
    if (!email || !password) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }
    
    this.errorMessage = '';
    this.isLoading = true;
    
    this.authService.login(email, password).subscribe({
      next: (res: HttpResponse<any>) => {
        console.log('Login successful, navigating to lists');
        this.isLoading = false;
        this.router.navigate(['/lists']);
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.errorMessage = 'Login failed. Please check your credentials and try again.';
        this.isLoading = false;
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    console.log('Password visibility toggled:', this.showPassword ? 'visible' : 'hidden');
  }
}