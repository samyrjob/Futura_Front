import { Component, OnDestroy, OnInit, Inject, PLATFORM_ID, Injectable } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../shared/api.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { enterVirtualWorld, logout } from '../authentication/auth.actions';
import { Observable } from 'rxjs';
import { selectHasEnteredWorld, selectIsAuthenticated, selectUsername } from '../authentication/auth.selectors';
import { AuthService } from '../shared/auth.service';
import { HttpClient } from '@angular/common/http';  // ✅ ADD THIS IMPORT


@Component({
  selector: 'app-profile',
  imports: [RouterModule, CommonModule],
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
@Injectable({
  providedIn: 'root',
  
})
export class ProfileComponent implements OnInit, OnDestroy{

    // Store the event listener function to remove it later
    private storageEventListener: ((event: StorageEvent) => void) | undefined;

  username: any;
  message: string='';
  isLaunching: boolean = false;  // ✅ ADD THIS - For loading state
  
  isAuthenticated$: Observable<boolean>;
  username$: Observable<string | null>;
  hasEnteredWorld$: Observable<boolean>;
 

  constructor(
    private apiService: ApiService, 
    private router: Router, 
    private store: Store<AppState>, 
    private authService: AuthService, 
    private http: HttpClient,  // ✅ ADD THIS
    @Inject(PLATFORM_ID) private platformId: Object
  ) {

    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
    this.username$ = this.store.select(selectUsername);
    this.hasEnteredWorld$ = this.store.select(selectHasEnteredWorld);
    
  }
  
  ngOnInit(): void {

    console.log(this.platformId)

    if (isPlatformBrowser(this.platformId)){
      // Add the storage event listener when component loads
      const storedAppState = localStorage.getItem('appState');
      const isLoggedIn = storedAppState ? JSON.parse(storedAppState).auth.isAuthenticated : false;
      console.log(isLoggedIn);
        this.storageEventListener = (event) => {
          if (event.key === 'appState' && isLoggedIn === 'false') {
            this.router.navigate(['/sign_in']); // Use Angular Router (better than window.location)
          }
        };


        window.addEventListener('storage', this.storageEventListener);
      }

      // 🔥 Subscribe to username observable and assign to the variable
      this.username$.subscribe(username => {
        this.username = username;
        console.log("Fetched username:", this.username); // Optional debug
      });
        
  }
  

  ngOnDestroy(): void {

    console.log(this.platformId)
    if (isPlatformBrowser(this.platformId))
  {    // Remove the listener when the component is destroyed (prevents memory leaks)
      if (this.storageEventListener) {
        window.removeEventListener('storage', this.storageEventListener);
      }}

  }
  

  joinGame() {
    this.apiService.launchGame().subscribe({
      next: (response) => this.message = response,
      error: (err) => this.message = 'Failed to launch game: ' + err.message
    });
  }



  logout(): void {
    this.store.dispatch(logout());
    
  }

  // ✅ NEW SECURE METHOD WITH SSO TOKEN
  launchVirtualWorld(): void {
    // Prevent double-clicking
    if (this.isLaunching) {
      return;
    }
    
    this.isLaunching = true;
    console.log('Requesting SSO token...');

    // Step 1: Request SSO token from backend (JWT is sent automatically via cookie)
    this.http.post<{ ssoToken: string }>(
      'http://localhost:9090/api/sso/generate', 
      {},
      { withCredentials: true }  // ✅ Important: Send JWT cookie!
    ).subscribe({
      next: (response) => {
        const ssoToken = response.ssoToken;
        console.log('Got SSO token:', ssoToken);
        
        // Step 2: Dispatch action to update state
        this.store.dispatch(enterVirtualWorld());
        
        // Step 3: Launch with SSO TOKEN (secure!)
        const futuraUrl = `futura://open?token=${ssoToken}`;
        console.log('Launching Futura:', futuraUrl);
        
        // Step 4: Open the game
        window.location.href = futuraUrl;
        
        // Reset launching state after a delay
        setTimeout(() => {
          this.isLaunching = false;
        }, 2000);
      },
      error: (err) => {
        console.error('Failed to get SSO token:', err);
        this.isLaunching = false;
        
        // Show user-friendly error
        if (err.status === 401) {
          alert('Session expired. Please log in again.');
          this.router.navigate(['/sign_in']);
        } else {
          alert('Failed to launch game. Please try again.');
        }
      }
    });
  }

}