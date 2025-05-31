// import { Component, HostListener, Inject, Injectable, OnInit } from '@angular/core';
// import { RouterModule, Router } from '@angular/router';
// import { RouterOutlet } from '@angular/router';
// import { ApiService } from './shared/api.service';
// import { JwtHelperService } from '@auth0/angular-jwt';
// import { AppState } from './app.state';
// import { Store, StoreModule } from '@ngrx/store';
// import { CommonModule } from '@angular/common';
// import { AuthService } from './shared/auth.service';
// import { logout } from './authentication/auth.actions';
// import { selectIsAuthenticated } from './authentication/auth.selectors';
// import { filter, interval, mergeMap, Observable, of, Subscribable, Subscriber, Subscription, switchMap } from 'rxjs';

// @Component({
//   selector: 'app-root',
// //   template: `
// //   <h1>Angular Standalone App</h1>
// //   <router-outlet></router-outlet>
// // `,
//   imports: [ RouterOutlet, RouterModule, CommonModule, StoreModule],
//   standalone: true,
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.scss'
// })



// export class AppComponent{
//   title = 'Welcome to Futura';
//   inactivityTimeout: any;
//   readonly INACTIVITY_LIMIT = 1*60*1000; // 1 minute
//   displayconsole: any;
//   activity: boolean = false;





//   constructor(
//      private store: Store<AppState>, private authService: AuthService,  private authservice: AuthService) {
     
//   }


      


//   ngOnInit(): void {
//     // Subscribe to the Observable
//     console.log("haha")
          
          

//   }





  

//   returnTrueExpiration() {
//     this.authservice.aboutToExpireFunction().pipe(
//       filter((response: boolean) =>  response === true) 
//     )
//     .subscribe(() =>  
//     {
//       return this.authService.refreshToken();

//     })

//   }

      


  


  



//   @HostListener('document:mousemove')
//   @HostListener('document:keydown')
//   @HostListener('document:click')
//   @HostListener('document:scroll')
//   @HostListener('document:touchstart')
//   resetInactivityTimer(){
  
    
//     this.activity = true;
  
//       this.store.select(selectIsAuthenticated).subscribe((isAuthenticated) => {
//         if (isAuthenticated){
//           mergeMap(  async () => this.returnTrueExpiration())
//         }
//       })
    
//     clearTimeout(this.inactivityTimeout);
//     this.inactivityTimeout = setTimeout(() => {this.activity = false, this.handleInactivityLogout()}, this.INACTIVITY_LIMIT);
//   }


//   handleInactivityLogout() {

//     this.store.select(selectIsAuthenticated).subscribe((isAuthenticated) => {

//       if (isAuthenticated) {
//         this.store.dispatch(logout());
//       }

//   })
  
    

// }

// }

import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { AuthService } from './shared/auth.service';
import { AppState } from './app.state';
import { logout } from './authentication/auth.actions';
import { selectIsAuthenticated } from './authentication/auth.selectors';
import { fromEvent, merge, Subject, timer } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, CommonModule],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Welcome to Futura';
  readonly INACTIVITY_LIMIT = 1 * 60 * 1000; // 1 minute
  private activitySubject = new Subject<void>();
  private destroy$ = new Subject<void>();
  private inactivityTimeout: any;

  constructor(
    private store: Store<AppState>,
    private authService: AuthService
    // private router: Router
  ) {}

  ngOnInit(): void {
    // // Set up user activity detection
    // this.setupActivityDetection();

    // Handle inactivity logout
    this.activitySubject.pipe(
      debounceTime(this.INACTIVITY_LIMIT),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.handleInactivityLogout();
    });

    // Handle token refresh on activity
    this.activitySubject.pipe(
      debounceTime(500), // Debounce rapid events
      // distinctUntilChanged(), // Avoid duplicate events
      switchMap(() =>
        this.store.select(selectIsAuthenticated).pipe(
          filter(isAuthenticated => isAuthenticated), // Only proceed if authenticated
          // switchMap(() => this.authService.aboutToExpireFunction()),
          switchMap(()=> this.authService.getAuthStatus())
          // filter(aboutToExpire => aboutToExpire), // Only proceed if token is about to expire
          // switchMap(() => this.authService.refreshToken())
        )
      ),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) =>  {
        const exp = res.exp;
        console.log('🔁 status obtained successfully : \n'),
        console.log(exp);
        const current = new Date();
        const timestamp = current.getTime()/1000;
        if (exp - timestamp <= 30){
          console.log("less or equal 30 sc left before expiration of the token !")
          this.authService.refreshToken().subscribe();
        }

      },
      error: (err) => console.error('❌ Error getting the status:', err)
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    clearTimeout(this.inactivityTimeout);
  }

  @HostListener('document:mousemove')
  @HostListener('document:keydown')
  @HostListener('document:click')
  @HostListener('document:scroll')
  @HostListener('document:touchstart')
  onUserActivity(): void {
    this.activitySubject.next();
  }

  // private setupActivityDetection(): void {
  //   const events = [
  //     'mousemove',
  //     'keydown',
  //     'click',
  //     'scroll',
  //     'touchstart'
  //   ].map(event => fromEvent(document, event));

  //   merge(...events).pipe(
  //     takeUntil(this.destroy$)
  //   ).subscribe(() => this.activitySubject.next());
  // }

  private handleInactivityLogout(): void {
    this.store.select(selectIsAuthenticated).pipe(
      takeUntil(this.destroy$)
    ).subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.store.dispatch(logout());
        // this.router.navigate(['/sign_in']);
      }
    });
  }


  private subscribeGetAuthStatus(){
   return this.authService.getAuthStatus().subscribe(res => {
    const exp = res.exp;
    console.log(exp);
    
    

  });

  }
}