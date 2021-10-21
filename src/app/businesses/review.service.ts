import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders  } from '@angular/common/http';
import { Prompt } from './prompt';
import { Review } from './review';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private baseUrl = 'http://localhost:3000/api';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  prompts$ = new BehaviorSubject([] as Prompt[]);
  reviews$ = new BehaviorSubject([] as Review[]);

  constructor(private http: HttpClient) { }

  getPrompts(bid: number) {
    this.http
      .get([this.baseUrl, 'businesses', bid, 'reviews', 'scores'].join('/'))
      .pipe(
        map((data: any) => {
          const acc = new Array<Prompt>();
          data ? data.forEach((data: any) => {
            const out = {
              promptID: data.number,
              promptTitle: data.promptTitle,
              promptDesc: data.promptDesc,
              promptRating: data.promptRating,
            } as Prompt;
            acc.push(out);
          }) : undefined;
          return acc;
        })
      )
      .subscribe(        
        res => {
          console.log(res);
          this.prompts$.next(res as Prompt[]);
        },
        err => {
          console.log(err);
        }
      );
  }

  getReviews(bid: number) {
    this.http
    .get([this.baseUrl, 'businesses', bid, 'reviews'].join('/'))
    .pipe(
      map((data: any) => {
        const acc = new Array<Review>();
        data ? data.forEach((data: any) => {
          const out = {
            reviewID: data.reviewID,
            verified: data.verified,
            reviewDate: data.reviewDate,
            text: data.text,
            username: data.username,
          } as Review;
          acc.push(out);
        }) : undefined;
        return acc;
      })
    )
    .subscribe(        
      res => {
        console.log(res);
        this.reviews$.next(res as Review[]);
      },
      err => {
        console.log(err);
      }
    );
  }

  getReivewPrompts(reviewID: number): Observable<Prompt[]> {
    return this.http    
      .get([this.baseUrl, 'users', reviewID, 'scores'].join('/'))
      .pipe(
        map((data: any) => {
          const prompts = this.prompts$.value;
          console.log(prompts);
          const acc = new Array<Prompt>();
          data ? data.forEach((data: any, i: number) => {
            const out = {
              promptID: data.promptID,
              promptTitle: prompts[i].promptTitle,
              promptDesc: prompts[i].promptDesc,
              promptRating: data.response,
            } as Prompt;
            acc.push(out);
          }) : undefined;
          return acc;
        })
      )
  }

}
