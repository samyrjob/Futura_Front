import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpParameterCodec, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { LoginRequestDTO } from '../model/LoginRequestDTO';
import {UtilisatorDTO} from '../model/UtilisatorDTO';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environment/environment';
import { Router } from '@angular/router';
import { NewUtilisatorDTO } from '../model/NewUtilisatorDTO';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  

apiUrl: string = environment.apiBaseUrl;
 

  private logIn = `${this.apiUrl}/users/login`;
  private register = `${this.apiUrl}/users/register`;
  private getUtilisators = `${this.apiUrl}/users/utilisators`;
  private launch = `${this.apiUrl}/users/launch-game`;
  private userAndValidationToken = `${this.apiUrl}/auth/validate-token-user`;
  private logOut = `${this.apiUrl}/users/logout`;


  constructor(private http: HttpClient, private router: Router) {

  }


  DoLogIn(credentials: LoginRequestDTO): Observable<any> {
    return this.http.post(this.logIn, credentials, {
        responseType: 'json',
        observe: 'response' // Get full response
    })
}



  DoRegister(new_user: NewUtilisatorDTO): Observable<any> {
    return this.http.post(this.register, new_user);
  }



    // Method to fetch all utilisateurs
  getAllUtilisateurs(): Observable<UtilisatorDTO[]> {
      return this.http.get<UtilisatorDTO[]>(this.getUtilisators);
    }
  


    launchGame(): Observable<any> {
      return this.http.post(this.launch, {responseType: 'text' });
    }



    validateUserToken(): Observable<any> {
      return this.http.get<{ user: UtilisatorDTO, authenticated: boolean }>(this.userAndValidationToken)
    }

    

    getUser(): Observable<UtilisatorDTO>{
      return this.validateUserToken().pipe(
        map(response => response.user)
      )
    }



    logout(): Observable<void> {
      return this.http.post<void>(this.logOut, {}, { 
      }).pipe(
        tap(() => {
          this.router.navigate(['/sign_in']);
        }),
        catchError(err => {
          console.error('Logout failed:', err);
          this.router.navigate(['/sign_in']);
          return throwError(() => err);
        })
      );
    }



}
