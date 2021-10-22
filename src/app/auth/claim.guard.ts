import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BusinessService } from '../businesses/business.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ClaimGuard implements CanActivate {
  constructor(
    private businessService: BusinessService, 
    private tokenStorageService: TokenStorageService, 
    private _snackBar: MatSnackBar,
    private router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  
  checkCanClaim(): boolean | UrlTree {
    const isLoggedIn = !!this.tokenStorageService.getToken();
    const canClaim = isLoggedIn && !this.businessService.business$.value.owned;
    
    if (canClaim) {
      return canClaim
    }

    if (!isLoggedIn) {
      this._snackBar.open('You must login first', 'Got it', { duration: 1000 });
      return this.router.parseUrl('/sign-in');
    }

    this._snackBar.open('You already owned the business', 'Got it', { duration: 1000 });
    const urlSegments = this.router.url.split('/');
    urlSegments.pop();
    return this.router.parseUrl(['', ...urlSegments, 'detail'].join('/'));
  }
}
