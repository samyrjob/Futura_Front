import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../shared/api.service';
import { CommonModule } from '@angular/common';


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

  constructor(private apiService: ApiService, private router: Router) {}
  
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
    this.apiService.logout().subscribe(
      {
        next: (response) => console.log("disconnected successfully bro ! "),
        error: (err) => console.log("failure why disconnecting")
      }
    );
  }

}

