import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { loginSuccess, logout } from '../authentication/auth.actions';
import { selectIsAuthenticated } from '../authentication/auth.selectors';
import { ApiService } from './api.service';
import { UtilisatorDTO } from '../model/UtilisatorDTO';


@Injectable({
  providedIn: 'root',
})
export class AuthService{



  constructor(private store: Store<AppState>, private apiservice: ApiService) {

  }




  // Call the backend to check if the user is authenticated
  checkAuthStatus(): Observable<any> {

    return this.apiservice.validateUserToken().pipe(
        // Map the response to extract the user and authenticated status
        map((response: { user: UtilisatorDTO, authenticated: boolean }) => {
            if (response.authenticated) {
                console.log('User authenticated:', response.authenticated);
                this.store.dispatch(loginSuccess({ user: response.user })); // Dispatch login success action
            }
            else {
                console.log('User NOT authenticated:', response.authenticated);
                this.store.dispatch(logout()); // Dispatch logout action
            }
            console.log('User authenticated:', response.authenticated);
            return response // Return the response as an Observable
        }),
        catchError((error) => {
          console.error('Error checking authentication status eere:', error);
          return of({ user: null, authenticated: false }); // Return a default value in case of error
        })
    );
  }



  setAuthenticated(): Subscription{
    return this.checkAuthStatus().subscribe((response) => {
      if (response.authenticated) {
        this.store.dispatch(loginSuccess({ user: response.user }));
      } else {
        this.store.dispatch(logout());
      }
    })

  }


}
