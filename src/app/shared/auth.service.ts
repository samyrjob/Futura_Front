import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap,of, map, Subscription, Subject, debounceTime } from 'rxjs';
import { environment } from '../../environment/environment';
import { selectIsAuthenticated } from '../authentication/auth.selectors';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { logout } from '../authentication/auth.actions';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

public  static logoutSub?: Subscription;
public static activitySubject = new Subject<void>();
static readonly INACTIVITY_LIMIT = 1 * 60 * 1000; // 1 minute


apiUrl: string = environment.apiBaseUrl;
private refreshTheToken = `${this.apiUrl}/auth/refresh-token-user`;
private aboutToExpire = `${this.apiUrl}/auth/about-to-expire`;
private authStatus = `${this.apiUrl}/auth/status`;

  constructor(private http: HttpClient, private store: Store<AppState>) { }

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







  static activitySubjectLogOut(store: Store<AppState>): Subscription{

    
    // Handle inactivity logout
    return this.activitySubject.pipe(
      debounceTime(this.INACTIVITY_LIMIT),
      // takeUntil(this.destroy$)
    ).subscribe(()  => {
      this.handleInactivityLogout(store);
    })

}

  static checklogoutSubValue(store: Store<AppState>) :  void{
    store.select(selectIsAuthenticated).subscribe(
      (response) => {
        if (response){
          if (AuthService.logoutSub !== undefined){
            AuthService.activitySubjectLogOut(store).unsubscribe();
           
          }
          else {
            AuthService.logoutSub = undefined;
            AuthService.activitySubjectLogOut(store);
       
          }
      }
      else {
          AuthService.activitySubjectLogOut(store).unsubscribe();
          AuthService.logoutSub = new Subscription();
      
      }
      }
    )

  }

  private static handleInactivityLogout(store: Store<AppState>): void {
    // if (this.logoutSub) {this.logoutSub.unsubscribe()}
    // else {
  
      // this.logoutSub =
       store.select(selectIsAuthenticated).subscribe((isAuthenticated) => {
        if (isAuthenticated) {
          store.dispatch(logout());
        }
      });
    }


  


}