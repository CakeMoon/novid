import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router, } from '@angular/router';
import { Observable } from 'rxjs';
import { BusinessService } from '../businesses/business.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class OwnerGuard implements CanActivate {
  constructor(
    private businessService: BusinessService, 
    private tokenStorageService: TokenStorageService, 
    private _snackBar: MatSnackBar,
    private router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkOwned();
  }
  
  checkOwned(): boolean | UrlTree {
    const isLoggedIn = !!this.tokenStorageService.getToken();
    const owned = isLoggedIn && this.businessService.business$.value.owned;
    
    if (owned) {
      return owned
    }

    this._snackBar.open('You must claim the business first', 'Got it', { duration: 1000 });
    const urlSegments = this.router.url.split('/');
    urlSegments.pop();
    return this.router.parseUrl(['', ...urlSegments, 'claim'].join('/'));
  }
}
