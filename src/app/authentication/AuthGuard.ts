import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, RouterStateSnapshot } from "@angular/router";
import { Router } from "@angular/router";
import { catchError, map, Observable, of } from "rxjs";
import { ApiService } from "../shared/api.service";


@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate{
    

    constructor(private http: HttpClient, private router: Router, private apiService: ApiService){}


    canActivate(): Observable<boolean> {

        return this.apiService.validateUserToken().pipe(
                map(response => {
                    if (!response.authenticated) {
                        if(!this.router.url.includes('/sign_in')){
                            this.router.navigate(['/sign_in'])
                            }
                      return false;
                    }
                    return true;
                  }),
                  
                  catchError(  () => {
                      if(!this.router.url.includes('/sign_in')){
                          this.router.navigate(['/sign_in'])
                        }
                    return of(false)
                    }
                )
            )
    }

}