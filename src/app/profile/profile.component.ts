import { Component, OnDestroy, OnInit, Inject, PLATFORM_ID, Injectable } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../shared/api.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { logout } from '../authentication/auth.actions';
import { Observable } from 'rxjs';
import { selectIsAuthenticated, selectUsername } from '../authentication/auth.selectors';
import { AuthService } from '../shared/auth.service';


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
  
  isAuthenticated$: Observable<boolean>;
  username$: Observable<string | null>;

  constructor(private apiService: ApiService, private router: Router, private store: Store<AppState>, private authService: AuthService, @Inject(PLATFORM_ID) private platformId: Object) {

    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
    this.username$ = this.store.select(selectUsername);
    
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

}

