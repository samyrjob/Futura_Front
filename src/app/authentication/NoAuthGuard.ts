import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ApiService } from '../shared/api.service';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
  constructor(private router: Router, private jwtHelper: JwtHelperService, private apiService: ApiService) {}

   
    canActivate(): Observable<boolean> {
        return this.apiService.validateUserToken().pipe(
          map(response => {
            if (response.authenticated) {
              this.router.navigate(['/profile']);
              return false;
            }
            return true;
          }),
        catchError(() => {
            // Allow access to public route even if validation fails
            return of(true);
          })
        );
      }
        
}
