import { Injectable } from '@angular/core';
import { 
  ActivatedRouteSnapshot, 
  CanActivate, 
  Router, 
  RouterStateSnapshot, 
  UrlTree } from '@angular/router';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private tokenStorageService: TokenStorageService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree {
    return this.checkLogin();
  }

  checkLogin(): true|UrlTree {
    const isLoggedIn = !!this.tokenStorageService.getToken();
    if (isLoggedIn) { return true; }

    // Redirect to the login page
    return this.router.parseUrl('/sign-in');
  }
}
