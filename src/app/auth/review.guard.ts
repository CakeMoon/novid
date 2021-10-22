import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BusinessService } from '../businesses/business.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewGuard implements CanActivate {
  constructor(
    private businessService: BusinessService, 
    private tokenStorageService: TokenStorageService, 
    private _snackBar: MatSnackBar,
    private router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkCanReview();
  }
  
  checkCanReview(): boolean | UrlTree {
    const isLoggedIn = !!this.tokenStorageService.getToken();
    const canReview = isLoggedIn && this.businessService.business$.value.eligibleToReview;
    
    if (canReview) {
      return canReview
    }

    if (!isLoggedIn) {
      this._snackBar.open('You must login first', 'Got it', { duration: 1000 });
      return this.router.parseUrl('/sign-in');
    }

    this._snackBar.open('You reach the review limitation for today', 'Got it', { duration: 1000 });
    const urlSegments = this.router.url.split('/');
    urlSegments.pop();
    return this.router.parseUrl(['', ...urlSegments, 'detail'].join('/'));
  }
}
