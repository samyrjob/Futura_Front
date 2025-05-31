import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap,of, map } from 'rxjs';
import { environment } from '../../environment/environment';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  
apiUrl: string = environment.apiBaseUrl;
private refreshTheToken = `${this.apiUrl}/auth/refresh-token-user`;
private aboutToExpire = `${this.apiUrl}/auth/about-to-expire`;
private authStatus = `${this.apiUrl}/auth/status`;

  constructor(private http: HttpClient) { }

  refreshToken(): Observable<any> {
    return this.http.post(this.refreshTheToken, {});
  }


  // aboutToExpireFunction(): Observable<boolean>{
  //   return this.http.get<{[key: string]: boolean}>(this.aboutToExpire).pipe(
  //     map(response => response['30 seconds left before expiration :'] || false)
  //   );
  // }

  getAuthStatus(): Observable<any>{
    return this.http.get<{ exp: number }>(this.authStatus);

  }


  


}