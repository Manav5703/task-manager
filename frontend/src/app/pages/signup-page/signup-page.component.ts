import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './signup-page.component.html',
  styleUrl: './signup-page.component.scss'
})
export class SignupPageComponent {
  showPassword: boolean = false;
  errorMessage: string = '';
  
  constructor(private authService: AuthService, private router: Router) {}
  
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword; // Toggles between true and false
  }

  onSignUpButtonClicked(email: string, password: string) {
    if (!email || !password) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }
    if (password.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters';
      return;
    }
    this.errorMessage = '';
    this.authService.signup(email, password).subscribe({
      next: (res: HttpResponse<any>) => {
        const accessToken = res.headers.get('x-access-token');
        const refreshToken = res.headers.get('x-refresh-token');
        console.log('Signup Response:', { accessToken, refreshToken, body: res.body });
        this.authService.setTokens(accessToken, refreshToken); // Assuming AuthService has this method
        this.router.navigate(['/lists']);
      },
      error: (err) => {
        console.error('Signup failed:', err);
        this.errorMessage = 'Signup failed. Please try again.';
      }
    });
  }
}
