import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './shared/api.service';
import { JwtHelperService } from '@auth0/angular-jwt';

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

  constructor(private router: Router, private apiService: ApiService, private jwtHelper: JwtHelperService) {}

  ngOnInit() {

    // this.apiService.validateUserToken().subscribe( response => {
    //   if (!response.authenticated){
    //     this.router.navigate(['/sign_in'])
    //   }
    // }
    // )

    console.log("al hamdoulilah");
  }

}

