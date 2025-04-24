import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { AuthInterceptor } from './authentication/auth.interceptor';
import { JwtHelperService } from '@auth0/angular-jwt';
import { provideStore, StoreModule } from '@ngrx/store';
import { appReducer } from './app.reducer';
import { authReducer } from './authentication/auth.reducer';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
      provideRouter(routes),
      provideClientHydration(withEventReplay()), 
      provideHttpClient(withInterceptorsFromDi()), provideClientHydration(), 
      provideStore(appReducer), // Provide the NgRx StoreModule with your reducers

      {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
      },  // Provide JwtHelperService manually
    {
      provide: JwtHelperService,
      useValue: new JwtHelperService(), // Create an instance of JwtHelperService
    }
      //   // Provide the NgRx StoreModule with your reducers
      // StoreModule.forRoot(appReducer) should be moved to an NgModule imports array
      // StoreModule.forRoot({ auth: authReducer }), // Add this line to provide the auth reducer
    // {
      
    // }
    
    ]};
