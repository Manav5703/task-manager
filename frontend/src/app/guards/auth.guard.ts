import { PLATFORM_ID, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { isPlatformBrowser } from '@angular/common';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);
  
  // On server side, allow the route to be accessed
  // This prevents blocking routes during server-side rendering
  if (!isBrowser) {
    return true;
  }

  if (authService.isLoggedIn()) {
    return true;
  }

  // Redirect to login page
  console.log('User not logged in, redirecting to login page');
  router.navigate(['/login']);
  return false;
}; 