import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable, Subject} from 'rxjs';
import { environment } from '../../environment/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public static activitySubject = new Subject<void>();


  apiUrl: string = environment.apiBaseUrl;
  private refreshTheToken = `${this.apiUrl}/auth/refresh-token-user`;
  private authStatus = `${this.apiUrl}/auth/status`;

  constructor(private http: HttpClient, private store: Store<AppState>) { }

  refreshToken(): Observable<any> {
      return this.http.post(this.refreshTheToken, {});
    }




  getAuthStatus(): Observable<any>{
      return this.http.get<{ exp: number }>(this.authStatus);

    }
}