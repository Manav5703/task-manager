import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, HTTP_INTERCEPTORS, withInterceptorsFromDi } from '@angular/common/http';
import { WebReqInterceptor } from './web-req.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi()
    ),
    { provide: HTTP_INTERCEPTORS, useClass: WebReqInterceptor, multi: true }
  ]
};
