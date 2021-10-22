import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';

import { BusinessService } from './business.service';
import { Business } from './business';

@Injectable({
  providedIn: 'root',
})
export class DetailResolverService implements Resolve<Business> {
  constructor(private bs: BusinessService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Business> | Observable<never> {
    const id = route.paramMap.get('id')!;

    return this.bs.getBusinessForResovler(id).pipe(
      take(1),
      mergeMap(business => {
        if (business) {
          return of(business);
        } else { // id not found
          console.log('not found');
          this.router.navigate(['']);
          return EMPTY;
        }
      })
    );
  }
}