import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-profile',
  imports: [RouterModule],
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{

  username: string = '';
  message: string='';

  constructor(private apiService: ApiService) {}
  
  ngOnInit() {
    // Extract username from token or fetch from API (simplified here)
    this.username = 'user'; // In a real app, decode JWT or fetch user data
  }
  
  joinGame() {
    this.apiService.launchGame().subscribe({
      next: (response) => this.message = response,
      error: (err) => this.message = 'Failed to launch game: ' + err.message
    });
  }

}

