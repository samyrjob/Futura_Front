import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './shared/api.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AppState } from './app.state';
import { Store, StoreModule } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { AuthService } from './shared/auth.service';
import { logout } from './authentication/auth.actions';
import { selectIsAuthenticated } from './authentication/auth.selectors';

@Component({
  selector: 'app-root',
//   template: `
//   <h1>Angular Standalone App</h1>
//   <router-outlet></router-outlet>
// `,
  imports: [ RouterOutlet, RouterModule, CommonModule, StoreModule],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})



export class AppComponent{
  title = 'Welcome to Futura';
  inactivityTimeout: any;
  readonly INACTIVITY_LIMIT = 1*60*1000; // 1 minute
  displayconsole: any;






  constructor(
     private store: Store<AppState>, private authService: AuthService) {

  }


      


  ngOnInit(): void {
    // Subscribe to the Observable
    console.log("haha")
  }


  



  @HostListener('document:mousemove')
  @HostListener('document:keydown')
  @HostListener('document:click')
  @HostListener('document:scroll')
  @HostListener('document:touchstart')
  resetInactivityTimer(){
  

    clearTimeout(this.inactivityTimeout);
    this.inactivityTimeout = setTimeout(() => this.handleInactivityLogout(), this.INACTIVITY_LIMIT);
  }


  handleInactivityLogout() {
    if (this.store.select(selectIsAuthenticated)) {
    this.store.dispatch(logout());
    }
    

}

}