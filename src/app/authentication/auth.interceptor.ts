import { Injectable } from "@angular/core";
import { catchError, finalize, Observable, switchMap, throwError } from "rxjs";
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler, HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { ApiService } from "../shared/api.service";



@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(private router: Router, private apiService: ApiService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip interception for auth-related endpoints
    if (req.url.includes('login') || 
        req.url.includes('logout') || 
        req.url.includes('validate-token')) {
      return next.handle(req);
    }

    const authReq = req.clone({ withCredentials: true });

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(authReq, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      
      return this.apiService.logout().pipe(
        finalize(() => {
          this.isRefreshing = false;
          this.router.navigate(['/sign_in']);
        }),
        catchError(() => {
          this.router.navigate(['/sign_in']);
          return throwError(() => new Error('Session expired'));
        }),
        switchMap(() => throwError(() => new Error('Session expired')))
      );
    }
    return throwError(() => new Error('Session expired'));
  }
}