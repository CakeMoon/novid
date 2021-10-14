import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Business } from './interface/business';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  private baseUrl = 'http://localhost:3000/api';
  businessList$ = new BehaviorSubject([] as Business[]);

  constructor(private http: HttpClient) {
    this.http
    .get([this.baseUrl, 'businesses'].join('/'))
    .subscribe(
      res => {
        this.businessList$.next(res as Business[]);
      },
      err => {
        console.log(err);
      }
    );
  }
}
