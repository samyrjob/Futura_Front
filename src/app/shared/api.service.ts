import { Injectable } from '@angular/core';
import { HttpClient, HttpParameterCodec } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Score } from '../new-users/model/score';
import { LoginRequestDTO } from '../model/LoginRequestDTO';
import {Utilisator} from '../model/Utilisator';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private URL =  (window as any)["cfgApiBaseUrl"] + "/api";
  private getScore = `${this.URL}/score`;
  private logIn = `${this.URL}/users/login`;
  private register = `${this.URL}/users/register`;
  private getUtilisators = `${this.URL}/users/utilisators`;
  private launch = `${this.URL}/users/launch`;

  constructor(private http: HttpClient) {}


  retrieveScore(): Observable<Score> {
    return this.http.get<Score>(this.getScore);
  }

  DoLogIn(credentials: LoginRequestDTO): Observable<any>{
    return this.http.post(this.logIn, credentials, {responseType:'json'})
    .pipe(
      tap(jwt => {
        const token = JSON.stringify(jwt)
        localStorage.setItem("token", token)})
    );
    
  }



  DoRegister(new_user: Utilisator): Observable<any> {
    return this.http.post(this.register, new_user);
  }


    // Method to fetch all utilisateurs
  getAllUtilisateurs(): Observable<Utilisator[]> {
      return this.http.get<Utilisator[]>(this.getUtilisators);
    }
  

    launchGame(): Observable<any> {
      return this.http.post(this.launch, {responseType: 'text' });
    }



}
