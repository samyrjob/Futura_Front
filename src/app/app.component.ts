import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './shared/api.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, map, Observable, Observer, of, Subscription } from 'rxjs';
import { AppState } from './app.state';
import { Store, StoreModule } from '@ngrx/store';
import { AuthState } from './authentication/AuthState';
import { selectIsAuthenticated, selectUsername } from './authentication/auth.selectors';
import { login, logout } from './authentication/auth.actions';
import { CommonModule } from '@angular/common';
import { AuthService } from './shared/auth.service';

@Component({
  selector: 'app-root',
//   template: `
//   <h1>Angular Standalone App</h1>
//   <router-outlet></router-outlet>
// `,
  imports: [ RouterOutlet, RouterModule, CommonModule, StoreModule],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})



export class AppComponent{
  title = 'Welcome to Futura';
  inactivityTimeout: any;
  readonly INACTIVITY_LIMIT = 1*60*1000; // 1 minute
  displayconsole: any;






  constructor(private router: Router, private apiService: ApiService, private jwtHelper: JwtHelperService,
     private store: Store<AppState>, private authService: AuthService) {

  }


      


  ngOnInit(): void {
    // Subscribe to the Observable
    console.log("haha")
  }







    // Check if user is logged in based on the presence of a valid JWT token
    isUserLoggedIn(): Observable<boolean> {
      return this.apiService.validateUserToken().pipe(
        map(response => response.authenticated ?? false), // Extract the "authenticated" field here //^ ?? corresponds to use of nullish coalescing operator
        catchError(error => {
          //* We hide the console log for the user experience
          //  console.error("[FROM APP COMPONENT]token validation failed", error + "  ...");

           return of(false);
          } // return Observable<false> 
        )
      );
    }
    
  



  // @HostListener('document:mousemove')
  // @HostListener('document:keydown')
  // @HostListener('document:click')
  // @HostListener('document:scroll')
  // @HostListener('document:touchstart')
  // resetInactivityTimer(){
  

  //   clearTimeout(this.inactivityTimeout);
  //   this.inactivityTimeout = setTimeout(() => this.handleInactivityLogout(), this.INACTIVITY_LIMIT);
  // }


  // // //* When inactivity is detected, call backend to log out 
  // handleInactivityLogout(){

  //   this.apiService.logout().subscribe({
  //     next: () => {
  //       console.log('Logged out due to inactivity');
  //       this.router.navigate(['/sign_in']); // redirect to login
  //     },
  //     error: (err) => {
  //       console.error('Inactivity logout failed:', err);
  //       this.router.navigate(['/sign_in']); // fallback redirect anyway
  //     }
  //   });
  // }

}

