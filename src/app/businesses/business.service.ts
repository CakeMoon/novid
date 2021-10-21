import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders  } from '@angular/common/http';
import { Operation, Business } from './business';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TokenStorageService } from '../auth/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  private baseUrl = 'http://localhost:3000/api';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  isLoggedIn = false;
  businessList$ = new BehaviorSubject([] as Business[]);
  favoriteList$ = new BehaviorSubject([] as Business[]);

  constructor(
    private http: HttpClient,
    private tokenStorageService: TokenStorageService
  ) {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    this.getBusinessList();
    this.getFavoriteList();
  }

  search(name: string) {
    const params = new HttpParams()
      .set('name', name);

    this.http
      .get([this.baseUrl, 'businesses', 'search/'].join('/'), { params })
      .pipe(
        map(this.processData)
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

  searchFavorites(name: string) {
    const params = new HttpParams()
      .set('name', name);

    this.http
      .get([this.baseUrl, 'users', 'favorites', 'search/'].join('/'), { params })
      .pipe(
        map(this.processData)
      )
      .subscribe(
        res => {
          console.log(res);
          this.favoriteList$.next(res as Business[]);
        },
        err => {
          console.log(err);
        }
      );
  }

  getBusinessList() {
    this.http
    .get([this.baseUrl, 'businesses'].join('/'))
    .pipe(
      map(this.processData)
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

  getFavoriteList() {
    this.http
    .get([this.baseUrl, 'users', 'favorites'].join('/'))
    .pipe(
      map(this.processData)
    )
    .subscribe(
      res => {
        console.log(res);
        this.favoriteList$.next(res as Business[]);
      },
      err => {
        console.log(err);
      }
    );
  }

  getBusiness(id: number | string): Observable<Business> {
    return this.businessList$.pipe(
      map(business => business.find(business => business.bid === +id)!)
    );
  }

  processData(data: any) {
    const acc = new Array<Business>();
    data ? data.forEach((data: any) => {

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
  }

  checkFavorite(bid: number): Observable<boolean> {
    return this.http
      .get([this.baseUrl, 'users', 'favorites', bid].join('/'))
      .pipe(
        map(data => data ? true : false)
      );
  }

  addFavorite(bid: number) {
    console.log(bid);
    this.http.post([this.baseUrl, 'users', 'favorites', bid].join('/'), {}, this.httpOptions)
    .subscribe(
      data => {
        this.getFavoriteList();
        return data;
      },
      err => {
        return err;
      }
    )
  }

  deleteFavorite(bid: number) {
    console.log(bid);
    this.http.delete([this.baseUrl, 'users', 'favorites', bid].join('/'), this.httpOptions).subscribe(
      data => {
        this.getFavoriteList();
        return data;
      },
      err => {
        return err;
      }
    );
  }
}
