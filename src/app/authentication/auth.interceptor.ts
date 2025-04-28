import { Injectable } from "@angular/core";
import { catchError, EMPTY, finalize, Observable, switchMap, throwError } from "rxjs";
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler, HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { ApiService } from "../shared/api.service";
import { MatSnackBar } from '@angular/material/snack-bar'; // Or your notification service



@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(private router: Router, private apiService: ApiService, private snackBar: MatSnackBar) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {



    // if (req.url.includes('validate-token-user')){
    //   return next.handle(req); // skip 401 handling
    // }
    
    const authReq = req.clone({ withCredentials: true });

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(authReq, next, error);
        }
        return throwError(() => error);
      })
    );
  }


  private handle401Error(request: HttpRequest<any>, next: HttpHandler, originalError: HttpErrorResponse) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      
      return this.apiService.logout().pipe(
        finalize(() => {
          this.isRefreshing = false;
          this.router.navigate(['/sign_in']);
        }),
        catchError(() => {
          this.router.navigate(['/sign_in']);
          return throwError(() => originalError); // Return the ORIGINAL error
        }),
        switchMap(() => throwError(() => originalError)) // Return the ORIGINAL error
      );
    }
    //! leave it for after when doing automatic logout please
    // this.snackBar.open('Session expired', 'Close', { duration: 2000 });
    return throwError(() => originalError); // Return the ORIGINAL error
    }
  }