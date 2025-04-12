import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './shared/api.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, map, Observable, Observer, of } from 'rxjs';

@Component({
  selector: 'app-root',
//   template: `
//   <h1>Angular Standalone App</h1>
//   <router-outlet></router-outlet>
// `,
  imports: [ RouterOutlet, RouterModule],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent{
  title = 'Welcome to Futura';
  inactivityTimeout: any;
  readonly INACTIVITY_LIMIT = 1*60*1000; // 1 minute


  //* Defining the Observer observer : 
  readonly observer: Observer<boolean> = {
    next: (authenticated: boolean) => {
      if (authenticated) {
        this.resetInactivityTimer();
      } else {
        console.log("User is not connected");
      }
    },
    error: (err: any) => {
      console.error('Error validating token', err);
    },
    complete: () => {
      // Optional completion handler
      console.log('Observation completed');
    }
  };

  constructor(private router: Router, private apiService: ApiService, private jwtHelper: JwtHelperService) {}

  ngOnInit() {

    this.isUserLoggedIn().subscribe(this.observer);
    console.log("al hamdoulilah");
  }




    // Check if user is logged in based on the presence of a valid JWT token
    isUserLoggedIn(): Observable<boolean> {
      return this.apiService.validateUserToken().pipe(
        map(response => response.authenticated ?? false), // Extract the "authenticated" field here //^ ?? corresponds to use of nullish coalescing operator
        catchError(error => { 
           console.error("token validation failed", error);
           return of(false);
          } // return Observable<false> 
        )
      );
    }
    
  



  @HostListener('document:mousemove')
  @HostListener('document:keydown')
  @HostListener('document:click')
  @HostListener('document:scroll')
  @HostListener('document:touchstart')
  resetInactivityTimer(){
    clearTimeout(this.inactivityTimeout);
    this.inactivityTimeout = setTimeout(() => this.handleInactivityLogout(), this.INACTIVITY_LIMIT);
  }


  // //* When inactivity is detected, call backend to log out 
  handleInactivityLogout(){
    this.apiService.logout().subscribe({
      next: () => {
        console.log('Logged out due to inactivity');
        this.router.navigate(['/sign_in']); // redirect to login
      },
      error: (err) => {
        console.error('Inactivity logout failed:', err);
        this.router.navigate(['/sign_in']); // fallback redirect anyway
      }
    });
  }

}

