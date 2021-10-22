import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  constructor(
    private tokenStorageService: TokenStorageService, 
    private router: Router,
    private _snackBar: MatSnackBar,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkLogin();
  }

  checkLogin(): true|UrlTree {
    const isLoggedIn = !(!!this.tokenStorageService.getToken());
    if (isLoggedIn) { return true; }

    // Redirect to the login page
    this._snackBar.open('You are already logged in', 'Got it', { duration: 1000 });
    return this.router.parseUrl('/');
  }
  
}
