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
import { HttpClient } from '@angular/common/http';

// ✅ ADD THIS IMPORT
import { RoomNavigatorComponent } from '../components/room-navigator/room-navigator.component';

@Component({
  selector: 'app-profile',
  imports: [
    RouterModule, 
    CommonModule,
    RoomNavigatorComponent  // ✅ ADD THIS
  ],
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
@Injectable({
  providedIn: 'root',
})
export class ProfileComponent implements OnInit, OnDestroy {

  // Store the event listener function to remove it later
  private storageEventListener: ((event: StorageEvent) => void) | undefined;

  username: any;
  message: string = '';
  isLaunching: boolean = false;
  
  // ✅ ADD THIS - Room Navigator visibility
  showRoomNavigator: boolean = false;
  
  isAuthenticated$: Observable<boolean>;
  username$: Observable<string | null>;
  hasEnteredWorld$: Observable<boolean>;

  constructor(
    private apiService: ApiService, 
    private router: Router, 
    private store: Store<AppState>, 
    private authService: AuthService, 
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
    this.username$ = this.store.select(selectUsername);
    this.hasEnteredWorld$ = this.store.select(selectHasEnteredWorld);
  }
  
  ngOnInit(): void {
    console.log(this.platformId);

    if (isPlatformBrowser(this.platformId)) {
      const storedAppState = localStorage.getItem('appState');
      const isLoggedIn = storedAppState ? JSON.parse(storedAppState).auth.isAuthenticated : false;
      console.log(isLoggedIn);
      
      this.storageEventListener = (event) => {
        if (event.key === 'appState' && isLoggedIn === 'false') {
          this.router.navigate(['/sign_in']);
        }
      };

      window.addEventListener('storage', this.storageEventListener);
    }

    this.username$.subscribe(username => {
      this.username = username;
      console.log("Fetched username:", this.username);
    });
  }

  ngOnDestroy(): void {
    console.log(this.platformId);
    if (isPlatformBrowser(this.platformId)) {
      if (this.storageEventListener) {
        window.removeEventListener('storage', this.storageEventListener);
      }
    }
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

  // ✅ NEW - Open Room Navigator
  openRoomNavigator(): void {
    this.showRoomNavigator = true;
  }

  // ✅ NEW - Close Room Navigator
  closeRoomNavigator(): void {
    this.showRoomNavigator = false;
  }

  launchVirtualWorld(): void {
    if (this.isLaunching) {
      return;
    }
    
    this.isLaunching = true;
    console.log('Requesting SSO token...');

    this.http.post<{ ssoToken: string }>(
      'http://localhost:9090/api/sso/generate', 
      {},
      { withCredentials: true }
    ).subscribe({
      next: (response) => {
        const ssoToken = response.ssoToken;
        console.log('Got SSO token:', ssoToken);
        
        this.store.dispatch(enterVirtualWorld());
        
        const futuraUrl = `futura://open?token=${ssoToken}`;
        console.log('Launching Futura:', futuraUrl);
        
        window.location.href = futuraUrl;
        
        setTimeout(() => {
          this.isLaunching = false;
        }, 2000);
      },
      error: (err) => {
        console.error('Failed to get SSO token:', err);
        this.isLaunching = false;
        
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