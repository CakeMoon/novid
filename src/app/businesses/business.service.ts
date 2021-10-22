import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders  } from '@angular/common/http';
import { Operation, Business } from './business';
import { Info } from './info';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  private baseUrl = 'http://localhost:3000/api';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  businessList$ = new BehaviorSubject([] as Business[]);
  favoriteList$ = new BehaviorSubject([] as Business[]);
  searchedName$ = new BehaviorSubject('');
  business$ = new BehaviorSubject({} as Business);

  constructor(
    private http: HttpClient,
  ) {
    this.getBusinessList();
    this.getFavoriteList();
    this.searchedName$.subscribe(name => {
      if (name === '') {
        this.getBusinessList();
        this.getFavoriteList();
      } else {
        this.search(name);
        this.searchFavorites(name);
      }
    })
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

  getBusinessForResovler(id: number | string): Observable<Business> {
    return this.businessList$.pipe(
      map(businesses => businesses.find(business => business.bid === +id)!)
    );
  }

  getBusiness(id: number | string): void{
    this.businessList$.pipe(
      map(businesses => businesses.find(business => business.bid === +id)!)
    ).subscribe(newBusiness => {
      this.business$.next(newBusiness);
    });
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
        rating: data.rating ? data.rating : 0,
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
        this.searchedName$.subscribe(name => {
          if (name === '') {
            this.getBusinessList();
            this.getFavoriteList();
          } else {
            this.search(name);
            this.searchFavorites(name);
          }
        })
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
        this.searchedName$.subscribe(name => {
          if (name === '') {
            this.getBusinessList();
            this.getFavoriteList();
          } else {
            this.search(name);
            this.searchFavorites(name);
          }
        })
        return data;
      },
      err => {
        return err;
      }
    );
  }

  editBusinesses(info: Info, bid: number): Observable<any> {
    return this.http.patch(
      [this.baseUrl, 'businesses', bid].join('/'),
      info, 
      this.httpOptions);
  }
}
