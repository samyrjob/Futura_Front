import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { AuthInterceptor } from './authentication/auth.interceptor';
import { JwtHelperService } from '@auth0/angular-jwt';
import { INITIAL_STATE, provideStore, StoreModule } from '@ngrx/store';
import { appReducer } from './app.reducer';
import { authReducer } from './authentication/auth.reducer';
import { provideEffects, USER_PROVIDED_EFFECTS } from '@ngrx/effects';
import { AuthEffects } from './authentication/auth.effects';
import { provideStoreDevtools, StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environment/environment';
import { getInitialState, hydrationMetaReducer, initialStateFactory } from './local-storage-meta-reducer';


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
      provideRouter(routes),
      provideClientHydration(withEventReplay()), 
      provideHttpClient(withInterceptorsFromDi()), provideClientHydration(), 
      provideStore(appReducer, 

        {
          metaReducers: [hydrationMetaReducer],
          // initialState: getInitialState(INITIAL_STATE)
        }
      ),
      {
        provide: INITIAL_STATE,
        useFactory: initialStateFactory,
        deps: []
      },
      provideEffects(AuthEffects), // Provide the NgRx StoreModule with your reducers
      provideStoreDevtools({
        maxAge: 25,
        logOnly: environment.production,
      }),

      {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
      },  // Provide JwtHelperService manually
    {
      provide: JwtHelperService,
      useValue: new JwtHelperService(), // Create an instance of JwtHelperService
    }
  

    
    ]};
