import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ApiService } from '../shared/api.service';
import { login, loginSuccess, loginFailure, logout } from './auth.actions';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { UtilisatorDTO } from '../model/UtilisatorDTO';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class AuthEffects {

login$;
loginSuccess$;
logout$;
loginFailure$;




  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {


      
        this.login$ = createEffect(() =>
          this.actions$.pipe(
            ofType(login),
            mergeMap(({ email, password }) =>
              this.apiService.DoLogIn({ email, password }).pipe(
                map(response => {
                  const user = response.body.user as UtilisatorDTO;
                  console.log("eee")
                  return loginSuccess({ user });
                }),
                catchError((error) => 
           {     
                    return of(loginFailure({ error: error.message || 'Unknown error' }));
                }

                
                )
              )
            )
          )
        );
      
        // Optional: Navigate in an effect (or keep in the service if preferred)
        this.loginSuccess$ = createEffect(() =>
          this.actions$.pipe(
            ofType(loginSuccess),
            tap(() => {
              if (isPlatformBrowser(this.platformId)){
                localStorage.setItem('isLoggedIn', 'true');  // Add this line
              }
              this.router.navigate(['/profile'])})
          ),
          { dispatch: false }
        );


        this.loginFailure$ = createEffect(() => 
                
            this.actions$.pipe(
                ofType(loginFailure),
                tap(({ error }) => {
                    this.snackBar.open('Wrong Credentials', 'Close', { duration: 2000 });
                // // Handle the error (e.g., show a notification)
                    console.error('Login failed', error);
                // return EMPTY
                })
            ),
            { dispatch: false }
            );
    
    
            // Logout effect
            // Optional: Navigate in an effect (or keep in the service if preferred)
      
        this.logout$ = createEffect(() =>
          this.actions$.pipe(
            ofType(logout),
            tap(() => {
              if (isPlatformBrowser(this.platformId)){
                localStorage.setItem('isLoggedIn', 'false');  // Add this line
              }
              this.apiService.logout().subscribe(
                {
                    next: (response) => console.log("disconnected successfully bro ! (from new auth effects "),
                    error: (err) => console.log("failure why disconnecting from new auth effects")
                  }
              );  // call logout API
            })
          ),
          { dispatch: false }
        );
  }
}
