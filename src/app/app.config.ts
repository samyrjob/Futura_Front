import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { AuthInterceptor } from './authentication/auth.interceptor';
import { JwtHelperService } from '@auth0/angular-jwt';



export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
      provideRouter(routes),
      provideClientHydration(withEventReplay()), 
      provideHttpClient(withInterceptorsFromDi()), provideClientHydration(), 

      {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
      },  // Provide JwtHelperService manually
    {
      provide: JwtHelperService,
      useValue: new JwtHelperService(), // Create an instance of JwtHelperService
    },
    // Provide tokenGetter function for JWT configuration
    
    ]};
