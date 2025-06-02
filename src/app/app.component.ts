// import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
// import { RouterModule, RouterOutlet } from '@angular/router';
// import { Store } from '@ngrx/store';
// import { CommonModule } from '@angular/common';
// import { AuthService } from './shared/auth.service';
// import { AppState } from './app.state';
// import { logout } from './authentication/auth.actions';
// import { selectIsAuthenticated } from './authentication/auth.selectors';
// import { fromEvent, merge, Observable, Subject, Subscription, timer } from 'rxjs';
// import { debounceTime, distinctUntilChanged, filter, switchMap, takeUntil } from 'rxjs/operators';

// @Component({
//   selector: 'app-root',
//   imports: [RouterOutlet, RouterModule, CommonModule],
//   standalone: true,
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.scss'
// })
// export class AppComponent implements OnInit {
//   title = 'Welcome to Futura';
//   // readonly INACTIVITY_LIMIT = 1 * 60 * 1000; // 1 minute
//   // private activitySubject = new Subject<void>();
//   private destroy$ = new Subject<void>();
//   // public  static logoutSub?: Subscription;


//   constructor(
//     private store: Store<AppState>,
//     private authService: AuthService
//     // private router: Router
//   ) {}



//   ngOnInit(): void {

    
 
    
    
//     AuthService.checklogoutSubValue(this.store);
    

  

//     // Handle token refresh on activity
//     AuthService.activitySubject.pipe(
//       debounceTime(500), // Debounce rapid events
//       // distinctUntilChanged(), // Avoid duplicate events
//       switchMap(() =>
//         this.store.select(selectIsAuthenticated).pipe(
//           filter(isAuthenticated => isAuthenticated), // Only proceed if authenticated
//           // switchMap(() => this.authService.aboutToExpireFunction()),
//           switchMap(()=> this.authService.getAuthStatus())
//           // filter(aboutToExpire => aboutToExpire), // Only proceed if token is about to expire
//           // switchMap(() => this.authService.refreshToken())
//         )
//       ),
//       // takeUntil(this.destroy$)
//     ).subscribe({
//       next: (res) =>  {
//         const exp = res.exp;
//         console.log('🔁 status obtained successfully : \n'),
//         console.log(exp);
//         const current = new Date();
//         const timestamp = current.getTime()/1000;
//         if (exp - timestamp <= 30){
//           console.log("less or equal 30 sc left before expiration of the token !")
//           this.authService.refreshToken().subscribe();
//         }

//       },
//       error: (err) => console.error('❌ Error getting the status:', err)
//     });
//   }


//   @HostListener('document:mousemove')
//   @HostListener('document:keydown')
//   @HostListener('document:click')
//   @HostListener('document:scroll')
//   @HostListener('document:touchstart')
//   onUserActivity(): void {
//     AuthService.activitySubject.next();
//   }



// }
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { InactivityService } from './shared/inactivity.service';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { debounceTime, filter, Subject, switchMap, takeUntil } from 'rxjs';
import { selectIsAuthenticated } from './authentication/auth.selectors';
import { AuthService } from './shared/auth.service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-root',
    imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private inactivityService: InactivityService, private store: Store<AuthService>, private authService: AuthService) {}

  private destroy$ = new Subject<void>();


  ngOnInit(): void {
    this.inactivityService.startMonitoring();
    this.triggerExpDate();


  }

  ngOnDestroy(): void {
    this.inactivityService.stopMonitoring();
    this.destroy$.next();
    this.destroy$.complete();
  }


  triggerExpDate(): void{


    // Handle token refresh on activity
    AuthService.activitySubject.pipe(
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


  @HostListener('document:mousemove')
  @HostListener('document:keydown')
  @HostListener('document:click')
  @HostListener('document:scroll')
  @HostListener('document:touchstart')
  onUserActivity(): void {
    AuthService.activitySubject.next();
  }










}
