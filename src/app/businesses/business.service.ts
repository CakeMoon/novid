import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Operation, Business } from './business';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  private baseUrl = 'http://localhost:3000/api';
  private businessList$ = new BehaviorSubject([] as Business[]);

  constructor(private http: HttpClient) {
    this.http
    .get([this.baseUrl, 'businesses'].join('/'))
    .pipe(
      map((data: any) => {
        const acc = new Array<Business>();
        data? data.forEach((data: any) => {
          const operations = [
            {
              label: 'delivery',
              value: data.delivery,
            } as Operation,
            {
              label: 'takeout',
              value: data.takeout,
            } as Operation,
            {
              label: 'outdoor',
              value: data.outdoor,
            } as Operation,
            {
              label: 'indoor',
              value: data.indoor,
            } as Operation,
          ] as Operation[];
          
          const out = {
            bid: data.bid,
            name: data.name,
            address: data.address,
            operations: operations,
            vcode: data.vcode,
            authcode: data.authcode,
            rating: data.rating,
            numReviews: data.numReviews,
          } as Business;
          acc.push(out);
        }) :
        undefined
        ;
        return acc;
      })
    )
    .subscribe(
      res => {
        console.log(res);
        this.businessList$.next(res as Business[]);
      },
      err => {
        console.log(err);
      }
    );
  }

  getBusinessList() { return this.businessList$ };

  getBusiness(id: number | string): Observable<Business> {
    return this.getBusinessList().pipe(
      map(business => business.find(business => business.bid === +id)!)
    );
  }

} 
