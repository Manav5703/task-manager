import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './signup-page.component.html',
  styleUrl: './signup-page.component.scss'
})
export class SignupPageComponent {
  showPassword: boolean = false;
  errorMessage: string = '';
  isLoading: boolean = false;
  
  constructor(private authService: AuthService, private router: Router) {
    console.log('SignupPageComponent initialized');
  }
  
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    console.log('Password visibility toggled:', this.showPassword ? 'visible' : 'hidden');
  }

  onFormSubmit(event: Event) {
    // Prevent the default form submission which would refresh the page
    event.preventDefault();
    
    // Get form elements
    const form = event.target as HTMLFormElement;
    const emailInput = form.querySelector('#email') as HTMLInputElement;
    const pwInput = form.querySelector('#password') as HTMLInputElement;
    
    // Call the signup method with the form values
    this.onSignUpButtonClicked(emailInput.value, pwInput.value);
  }

  onSignUpButtonClicked(email: string, password: string) {
    console.log('Signup button clicked with:', { email });
    
    if (!email || !password) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }
    
    if (password.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters';
      return;
    }
    
    this.errorMessage = '';
    this.isLoading = true;
    
    this.authService.signup(email, password).subscribe({
      next: (res: HttpResponse<any>) => {
        console.log('Signup successful, navigating to lists');
        this.isLoading = false;
        this.router.navigate(['/lists']);
      },
      error: (err) => {
        console.error('Signup failed:', err);
        this.errorMessage = 'Signup failed. Please try again with a different email.';
        this.isLoading = false;
      }
    });
  }
}
