import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../shared/api.service';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { logout } from '../authentication/auth.actions';


@Component({
  selector: 'app-profile',
  imports: [RouterModule, CommonModule],
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{

  username: any;
  message: string='';

  constructor(private apiService: ApiService, private router: Router, private store: Store<AppState>) {}
  
  ngOnInit() {
    // Extract username from token or fetch from API (simplified here)
    this.username = this.apiService.getUser();

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

