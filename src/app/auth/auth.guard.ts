import { Injectable } from '@angular/core';
import { 
  ActivatedRouteSnapshot, 
  CanActivate, 
  Router, 
  RouterStateSnapshot, 
  UrlTree } from '@angular/router';
import { TokenStorageService } from './token-storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private tokenStorageService: TokenStorageService, 
    private router: Router,
    private _snackBar: MatSnackBar,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree {
    return this.checkLogin();
  }

  checkLogin(): true|UrlTree {
    const isLoggedIn = !!this.tokenStorageService.getToken();
    if (isLoggedIn) { return true; }

    // Redirect to the login page
    this._snackBar.open('You must login first', 'Got it', { duration: 1000 });
    return this.router.parseUrl('/sign-in');
  }

}
