import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../shared/api.service';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { logout } from '../authentication/auth.actions';
import { Observable, Subject, takeUntil, timer } from 'rxjs';
import { selectIsAuthenticated, selectUsername } from '../authentication/auth.selectors';
import { AuthService } from '../shared/auth.service';


@Component({
  selector: 'app-profile',
  imports: [RouterModule, CommonModule],
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  username: any;
  message: string='';

  isAuthenticated$: Observable<boolean>;
  username$: Observable<string | null>;

  constructor(private apiService: ApiService, private router: Router, private store: Store<AppState>, private authService: AuthService) {

    
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
    this.username$ = this.store.select(selectUsername);
    

    
  }
  

//   private destroy$ = new Subject<void>();

//   ngOnInit() {
//     timer(1000).pipe(
//       takeUntil(this.destroy$) // Annule si destroy$ émet
//     ).subscribe(() => {
//       this.authService.setAuthenticated();
//     });
// }

//   ngOnDestroy() {
//     this.destroy$.next();
//     this.destroy$.complete();
//   }






  
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

